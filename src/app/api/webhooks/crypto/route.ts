import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  creditBalance,
  verifyWebhookSignature,
  isTransactionProcessed,
} from "@/lib/payments";

const CRYPTO_WEBHOOK_SECRET = process.env.CRYPTO_WEBHOOK_SECRET || "";

/**
 * Expected webhook payload from your crypto payment gateway
 * (e.g., NOWPayments, CoinGate, or custom listener).
 */
interface CryptoWebhookPayload {
  /** Unique transaction/payment ID from the provider */
  paymentId: string;
  /** Status: "confirmed", "pending", "failed" */
  status: string;
  /** Amount in USD equivalent */
  amountUsd: number;
  /** Token used: "USDC", "USDT" */
  token: string;
  /** Chain: "polygon", "arbitrum" */
  chain: string;
  /** On-chain transaction hash */
  txHash: string;
  /** Deposit address that received the funds */
  depositAddress: string;
  /** Number of block confirmations */
  confirmations: number;
}

/**
 * POST /api/webhooks/crypto — Handle crypto payment confirmations.
 * Verifies HMAC signature, looks up user by deposit address,
 * and credits their balance.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();

  // Verify webhook signature
  if (CRYPTO_WEBHOOK_SECRET) {
    const signature = req.headers.get("x-webhook-signature") || "";
    if (!signature) {
      return NextResponse.json(
        { error: "Missing webhook signature" },
        { status: 400 }
      );
    }

    const valid = verifyWebhookSignature(body, signature, CRYPTO_WEBHOOK_SECRET);
    if (!valid) {
      console.error("Crypto webhook signature verification failed");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }
  }

  let payload: CryptoWebhookPayload;
  try {
    payload = JSON.parse(body) as CryptoWebhookPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  // Only process confirmed payments
  if (payload.status !== "confirmed") {
    console.log(`Crypto payment ${payload.paymentId} status: ${payload.status} — skipping`);
    return NextResponse.json({ received: true });
  }

  // Require minimum confirmations
  const minConfirmations = payload.chain === "polygon" ? 30 : 12;
  if (payload.confirmations < minConfirmations) {
    console.log(
      `Crypto payment ${payload.paymentId} has ${payload.confirmations}/${minConfirmations} confirmations — waiting`
    );
    return NextResponse.json({ received: true, waiting: true });
  }

  // Idempotency check
  const alreadyProcessed = await isTransactionProcessed(payload.paymentId);
  if (alreadyProcessed) {
    console.log("Crypto payment already processed:", payload.paymentId);
    return NextResponse.json({ received: true });
  }

  // Look up user by deposit address.
  // In production, you'd have a DepositAddress table mapping addresses to users.
  // For now, we search user metadata or use a simple approach.
  const user = await prisma.user.findFirst({
    where: {
      // This assumes deposit addresses are stored in a way that's queryable.
      // A real implementation would use a dedicated DepositAddress model.
      // For the MVP, we look up by the metadata field on past crypto transactions,
      // or we require the payment gateway to include the userId in the callback.
      id: (payload as unknown as { userId?: string }).userId || "",
    },
    select: { id: true },
  });

  if (!user) {
    console.error(
      `No user found for deposit address: ${payload.depositAddress}`
    );
    return NextResponse.json(
      { error: "Unknown deposit address" },
      { status: 404 }
    );
  }

  // Validate amount
  if (!payload.amountUsd || payload.amountUsd <= 0) {
    console.error("Invalid amount in crypto webhook:", payload.amountUsd);
    return NextResponse.json(
      { error: "Invalid amount" },
      { status: 400 }
    );
  }

  // Credit the user's balance
  try {
    await creditBalance(
      user.id,
      payload.amountUsd,
      `${payload.token} deposit on ${payload.chain} — $${payload.amountUsd.toFixed(2)}`,
      {
        externalId: payload.paymentId,
        provider: "crypto",
        token: payload.token,
        chain: payload.chain,
        txHash: payload.txHash,
        depositAddress: payload.depositAddress,
        confirmations: payload.confirmations,
      }
    );
    console.log(
      `Credited $${payload.amountUsd.toFixed(2)} (${payload.token}/${payload.chain}) to user ${user.id}`
    );
  } catch (err) {
    console.error("Failed to credit crypto balance:", err);
    return NextResponse.json(
      { error: "Failed to credit balance" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true, credited: true });
}
