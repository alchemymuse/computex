import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

/**
 * GET /api/dashboard/usage — Usage stats for the last N days.
 * Query params:
 *   days — number of days to look back (default 30, max 90)
 */
export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  const days = Math.min(
    90,
    Math.max(1, parseInt(req.nextUrl.searchParams.get("days") || "30", 10))
  );
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Daily aggregated usage
  const dailyUsage = await prisma.$queryRaw<
    Array<{
      date: string;
      requests: bigint;
      inputTokens: bigint;
      outputTokens: bigint;
      totalCost: number;
    }>
  >`
    SELECT
      DATE("createdAt") as date,
      COUNT(*)::bigint as requests,
      COALESCE(SUM("inputTokens"), 0)::bigint as "inputTokens",
      COALESCE(SUM("outputTokens"), 0)::bigint as "outputTokens",
      COALESCE(SUM("totalCost"::numeric), 0) as "totalCost"
    FROM "UsageLog"
    WHERE "userId" = ${payload.userId}
      AND "createdAt" >= ${since}
    GROUP BY DATE("createdAt")
    ORDER BY date ASC
  `;

  // Model breakdown
  const byModel = await prisma.usageLog.groupBy({
    by: ["modelId"],
    where: {
      userId: payload.userId,
      createdAt: { gte: since },
    },
    _sum: {
      inputTokens: true,
      outputTokens: true,
      totalCost: true,
    },
    _count: true,
  });

  // Enrich with model names
  const modelIds = byModel.map((m) => m.modelId);
  const models = await prisma.aiModel.findMany({
    where: { id: { in: modelIds } },
    select: { id: true, slug: true, name: true },
  });
  const modelMap = new Map(models.map((m) => [m.id, m]));

  const modelBreakdown = byModel.map((m) => ({
    model: modelMap.get(m.modelId) ?? { slug: "unknown", name: "Unknown" },
    requests: m._count,
    inputTokens: m._sum.inputTokens ?? 0,
    outputTokens: m._sum.outputTokens ?? 0,
    totalCost: m._sum.totalCost?.toNumber() ?? 0,
  }));

  // Summary totals
  const totals = await prisma.usageLog.aggregate({
    where: {
      userId: payload.userId,
      createdAt: { gte: since },
    },
    _sum: {
      inputTokens: true,
      outputTokens: true,
      totalCost: true,
    },
    _count: true,
  });

  return NextResponse.json({
    period: { days, since: since.toISOString() },
    totals: {
      requests: totals._count,
      inputTokens: totals._sum.inputTokens ?? 0,
      outputTokens: totals._sum.outputTokens ?? 0,
      totalCost: totals._sum.totalCost?.toNumber() ?? 0,
    },
    daily: dailyUsage.map((d) => ({
      date: d.date,
      requests: Number(d.requests),
      inputTokens: Number(d.inputTokens),
      outputTokens: Number(d.outputTokens),
      totalCost: Number(d.totalCost),
    })),
    byModel: modelBreakdown,
  });
}
