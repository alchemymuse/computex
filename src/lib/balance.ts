import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { BALANCE_CACHE_TTL } from "./constants";

const balanceCacheKey = (userId: string) => `balance:${userId}`;

/**
 * Get user's USD balance. Checks Redis first, falls back to Postgres.
 */
export async function getBalance(userId: string): Promise<number> {
  const cached = await redis.get(balanceCacheKey(userId));
  if (cached !== null) {
    return parseFloat(cached);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { balanceUsd: true },
  });

  if (!user) return 0;

  const balance = user.balanceUsd.toNumber();
  await redis.set(balanceCacheKey(userId), balance.toString(), "EX", BALANCE_CACHE_TTL);
  return balance;
}

/**
 * Check if user has sufficient balance for a minimum request cost.
 */
export async function hasMinimumBalance(
  userId: string,
  minimumUsd: number = 0.0001
): Promise<boolean> {
  const balance = await getBalance(userId);
  return balance >= minimumUsd;
}

/**
 * Atomically deduct balance and create a transaction record.
 * Uses a Prisma transaction to ensure consistency.
 * Returns the new balance, or null if insufficient funds.
 */
export async function deductBalance(
  userId: string,
  amount: number,
  description: string,
  metadata?: Record<string, unknown>
): Promise<number | null> {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { balanceUsd: true },
    });

    if (!user) throw new Error("User not found");

    const currentBalance = user.balanceUsd.toNumber();
    if (currentBalance < amount) return null;

    const newBalance = currentBalance - amount;

    await tx.user.update({
      where: { id: userId },
      data: { balanceUsd: new Prisma.Decimal(newBalance) },
    });

    await tx.transaction.create({
      data: {
        userId,
        type: "USAGE",
        amount: new Prisma.Decimal(amount),
        balanceBefore: user.balanceUsd,
        balanceAfter: new Prisma.Decimal(newBalance),
        description,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });

    return newBalance;
  });

  if (result !== null) {
    // Update cache
    await redis.set(balanceCacheKey(userId), result.toString(), "EX", BALANCE_CACHE_TTL);
  }

  return result;
}

/**
 * Invalidate the cached balance for a user.
 */
export async function invalidateBalanceCache(userId: string): Promise<void> {
  await redis.del(balanceCacheKey(userId));
}
