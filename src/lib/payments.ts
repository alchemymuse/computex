import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { BALANCE_CACHE_TTL } from "./constants";
import crypto from "crypto";

const balanceCacheKey = (userId: string) => `balance:${userId}`;

/**
 * Credit a user's balance and create a DEPOSIT transaction.
 * Used by both Stripe and crypto payment flows.
 */
export async function creditBalance(
  userId: string,
  amount: number,
  description: string,
  metadata?: Record<string, unknown>
): Promise<number> {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { balanceUsd: true },
    });

    if (!user) throw new Error("User not found");

    const currentBalance = user.balanceUsd.toNumber();
    const newBalance = currentBalance + amount;

    await tx.user.update({
      where: { id: userId },
      data: { balanceUsd: new Prisma.Decimal(newBalance) },
    });

    await tx.transaction.create({
      data: {
        userId,
        type: "DEPOSIT",
        amount: new Prisma.Decimal(amount),
        balanceBefore: user.balanceUsd,
        balanceAfter: new Prisma.Decimal(newBalance),
        description,
        metadata: metadata as Prisma.InputJsonValue,
      },
    });

    return newBalance;
  });

  // Update cache
  await redis.set(balanceCacheKey(userId), result.toString(), "EX", BALANCE_CACHE_TTL);

  return result;
}

/**
 * Process a withdrawal from a user's balance.
 * Returns null if insufficient funds.
 */
export async function withdrawBalance(
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
        type: "WITHDRAWAL",
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
    await redis.set(balanceCacheKey(userId), result.toString(), "EX", BALANCE_CACHE_TTL);
  }

  return result;
}

/**
 * Verify an HMAC-SHA256 webhook signature.
 * Used for crypto payment provider webhooks.
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

/**
 * Check if a transaction with the given external ID already exists (idempotency).
 */
export async function isTransactionProcessed(
  externalId: string
): Promise<boolean> {
  const existing = await prisma.transaction.findFirst({
    where: {
      metadata: {
        path: ["externalId"],
        equals: externalId,
      },
    },
  });
  return !!existing;
}
