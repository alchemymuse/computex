import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

/** GET /api/marketplace/stats — Seller earnings and usage stats */
export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  if (payload.role !== "SELLER" && payload.role !== "ADMIN") {
    return NextResponse.json(
      { error: { message: "Only sellers can view stats", type: "forbidden", code: "forbidden" } },
      { status: 403 }
    );
  }

  // Get seller's listings
  const listings = await prisma.listing.findMany({
    where: { sellerId: payload.userId },
    select: { id: true },
  });

  const listingIds = listings.map((l) => l.id);

  // Aggregate usage across all seller listings
  const usageStats = await prisma.usageLog.aggregate({
    where: { listingId: { in: listingIds } },
    _sum: {
      inputTokens: true,
      outputTokens: true,
      totalCost: true,
    },
    _count: true,
  });

  // Usage in last 24h
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentUsage = await prisma.usageLog.aggregate({
    where: {
      listingId: { in: listingIds },
      createdAt: { gte: oneDayAgo },
    },
    _sum: {
      inputTokens: true,
      outputTokens: true,
      totalCost: true,
    },
    _count: true,
  });

  // Active listings count
  const activeListings = await prisma.listing.count({
    where: { sellerId: payload.userId, isActive: true },
  });

  return NextResponse.json({
    stats: {
      totalListings: listings.length,
      activeListings,
      allTime: {
        requests: usageStats._count,
        inputTokens: usageStats._sum.inputTokens ?? 0,
        outputTokens: usageStats._sum.outputTokens ?? 0,
        totalEarnings: usageStats._sum.totalCost?.toNumber() ?? 0,
      },
      last24h: {
        requests: recentUsage._count,
        inputTokens: recentUsage._sum.inputTokens ?? 0,
        outputTokens: recentUsage._sum.outputTokens ?? 0,
        earnings: recentUsage._sum.totalCost?.toNumber() ?? 0,
      },
    },
  });
}
