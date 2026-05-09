import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { BALANCE_CACHE_TTL } from "./constants";

const balanceCacheKey = (userId: string) => `balance:${userId}`;

export interface EscrowLock {
  lockId: string;
  userId: string;
  amount: number;
}

/**
 * Lock funds in escrow before a request is proxied.
 * This prevents the user from double-spending during streaming.
 * The lock creates a transaction record of type ESCROW_LOCK.
 * Returns null if insufficient funds.
 */
export async function lockEscrow(
  userId: string,
  estimatedCost: number,
  metadata?: Record<string, unknown>
): Promise<EscrowLock | null> {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { balanceUsd: true },
    });

    if (!user) throw new Error("User not found");

    const currentBalance = user.balanceUsd.toNumber();
    if (currentBalance < estimatedCost) return null;

    const newBalance = currentBalance - estimatedCost;

    await tx.user.update({
      where: { id: userId },
      data: { balanceUsd: new Prisma.Decimal(newBalance) },
    });

    const transaction = await tx.transaction.create({
      data: {
        userId,
        type: "ESCROW_LOCK",
        amount: new Prisma.Decimal(estimatedCost),
        balanceBefore: user.balanceUsd,
        balanceAfter: new Prisma.Decimal(newBalance),
        description: "Escrow lock for pending request",
        metadata: metadata as Prisma.InputJsonValue,
      },
    });

    return { lockId: transaction.id, newBalance };
  });

  if (!result) return null;

  // Update cache
  await redis.set(
    balanceCacheKey(userId),
    result.newBalance.toString(),
    "EX",
    BALANCE_CACHE_TTL
  );

  return {
    lockId: result.lockId,
    userId,
    amount: estimatedCost,
  };
}

/**
 * Release escrow after a request completes.
 * Calculates the actual cost and refunds the difference (or charges more if under-estimated).
 *
 * @param lock - The original escrow lock
 * @param actualCost - The real cost based on actual token usage
 * @param description - Human-readable description for the transaction
 */
export async function releaseEscrow(
  lock: EscrowLock,
  actualCost: number,
  description: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const refundAmount = lock.amount - actualCost;

  await prisma.$transaction(async (tx) => {
    if (refundAmount > 0) {
      // Refund the difference
      const user = await tx.user.findUnique({
        where: { id: lock.userId },
        select: { balanceUsd: true },
      });
      if (!user) return;

      const currentBalance = user.balanceUsd.toNumber();
      const newBalance = currentBalance + refundAmount;

      await tx.user.update({
        where: { id: lock.userId },
        data: { balanceUsd: new Prisma.Decimal(newBalance) },
      });

      await tx.transaction.create({
        data: {
          userId: lock.userId,
          type: "ESCROW_RELEASE",
          amount: new Prisma.Decimal(refundAmount),
          balanceBefore: user.balanceUsd,
          balanceAfter: new Prisma.Decimal(newBalance),
          description: `Escrow release: ${description}`,
          metadata: {
            lockId: lock.lockId,
            estimatedCost: lock.amount,
            actualCost,
            refunded: refundAmount,
            ...(metadata ?? {}),
          } as Prisma.InputJsonValue,
        },
      });
    } else if (refundAmount < 0) {
      // Under-estimated: deduct additional amount
      const additionalCharge = Math.abs(refundAmount);
      const user = await tx.user.findUnique({
        where: { id: lock.userId },
        select: { balanceUsd: true },
      });
      if (!user) return;

      const currentBalance = user.balanceUsd.toNumber();
      const newBalance = currentBalance - additionalCharge;

      await tx.user.update({
        where: { id: lock.userId },
        data: { balanceUsd: new Prisma.Decimal(Math.max(0, newBalance)) },
      });

      await tx.transaction.create({
        data: {
          userId: lock.userId,
          type: "USAGE",
          amount: new Prisma.Decimal(additionalCharge),
          balanceBefore: user.balanceUsd,
          balanceAfter: new Prisma.Decimal(Math.max(0, newBalance)),
          description: `Additional charge: ${description}`,
          metadata: {
            lockId: lock.lockId,
            estimatedCost: lock.amount,
            actualCost,
            additionalCharge,
            ...(metadata ?? {}),
          } as Prisma.InputJsonValue,
        },
      });
    }
    // If refundAmount === 0, no additional transaction needed
  });

  // Invalidate cache so next read gets fresh balance
  await redis.del(balanceCacheKey(lock.userId));
}

/**
 * Estimate the maximum cost for a request (used to size the escrow lock).
 * Uses input tokens * price + estimated max output * price.
 */
export function estimateMaxCost(
  inputTokens: number,
  maxOutputTokens: number,
  inputPricePerMillion: number,
  outputPricePerMillion: number
): number {
  const inputCost = (inputTokens / 1_000_000) * inputPricePerMillion;
  const outputCost = (maxOutputTokens / 1_000_000) * outputPricePerMillion;
  return inputCost + outputCost;
}
