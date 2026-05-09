import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  amount: z.number().min(5).max(10000),
});

/**
 * POST /api/payments/checkout — Create a Stripe Checkout session.
 * User must be authenticated. Returns the Stripe session URL.
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
    const { amount } = checkoutSchema.parse(body);

    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ComputeX Balance Top-Up",
              description: `Add $${amount.toFixed(2)} to your ComputeX balance`,
            },
            unit_amount: Math.round(amount * 100), // cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: payload.userId,
        amount: amount.toString(),
      },
      success_url: `${appUrl}/dashboard/billing?payment=success`,
      cancel_url: `${appUrl}/dashboard/billing?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: "Invalid amount (min $5, max $10,000)", type: "validation", code: "invalid_input" } },
        { status: 400 }
      );
    }
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json(
      { error: { message, type: "payment", code: "checkout_failed" } },
      { status: 500 }
    );
  }
}
