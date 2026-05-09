import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { withdrawBalance } from "@/lib/payments";

const withdrawSchema = z.object({
  amount: z.number().min(10),
  method: z.enum(["bank", "crypto"]),
  destination: z.string().min(1),
});

/**
 * POST /api/payments/withdraw — Request a withdrawal.
 * Creates a pending withdrawal transaction.
 * Actual payout is processed manually or via a background job.
 */
export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { amount, method, destination } = withdrawSchema.parse(body);

    const newBalance = await withdrawBalance(
      payload.userId,
      amount,
      `Withdrawal request — $${amount.toFixed(2)} via ${method}`,
      {
        method,
        destination,
        status: "pending",
      }
    );

    if (newBalance === null) {
      return NextResponse.json(
        { error: { message: "Insufficient balance", type: "payment", code: "insufficient_balance" } },
        { status: 402 }
      );
    }

    return NextResponse.json({
      message: `Withdrawal of $${amount.toFixed(2)} initiated. Will be processed within 1-3 business days.`,
      newBalance,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: "Invalid withdrawal request (min $10)", type: "validation", code: "invalid_input", details: err.issues } },
        { status: 400 }
      );
    }
    console.error("Withdrawal error:", err);
    return NextResponse.json(
      { error: { message: "Withdrawal failed", type: "payment", code: "withdrawal_failed" } },
      { status: 500 }
    );
  }
}
