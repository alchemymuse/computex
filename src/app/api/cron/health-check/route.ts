import { NextRequest, NextResponse } from "next/server";
import { runHealthChecks } from "@/lib/health-check";

const CRON_SECRET = process.env.CRON_SECRET;

/**
 * GET /api/cron/health-check — Triggered by external cron or Vercel Cron.
 * Protected by a shared secret in the Authorization header.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret (skip in development)
  if (CRON_SECRET) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "unauthorized" } },
        { status: 401 }
      );
    }
  }

  try {
    const results = await runHealthChecks();
    return NextResponse.json({
      message: "Health checks completed",
      ...results,
    });
  } catch (err) {
    console.error("Health check cron error:", err);
    return NextResponse.json(
      { error: { message: "Health check failed", code: "internal" } },
      { status: 500 }
    );
  }
}
