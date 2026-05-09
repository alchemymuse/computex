import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

/** GET /api/marketplace/my-listings — List all listings owned by current user */
export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  const listings = await prisma.listing.findMany({
    where: { sellerId: payload.userId },
    include: {
      model: { select: { slug: true, name: true, provider: true } },
      _count: { select: { usageLogs: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ listings });
}
