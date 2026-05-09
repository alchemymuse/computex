import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

/**
 * GET /api/dashboard/transactions — Transaction history with pagination.
 * Query params:
 *   page  — page number (default 1)
 *   limit — items per page (default 20, max 100)
 *   type  — filter by type (DEPOSIT, WITHDRAWAL, USAGE, REFUND, ESCROW_LOCK, ESCROW_RELEASE)
 */
export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  const url = req.nextUrl;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
  const typeFilter = url.searchParams.get("type");

  const where = {
    userId: payload.userId,
    ...(typeFilter && { type: typeFilter as "DEPOSIT" | "WITHDRAWAL" | "USAGE" | "REFUND" | "ESCROW_LOCK" | "ESCROW_RELEASE" }),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({
    transactions: transactions.map((t) => ({
      id: t.id,
      type: t.type,
      amount: t.amount.toNumber(),
      balanceBefore: t.balanceBefore.toNumber(),
      balanceAfter: t.balanceAfter.toNumber(),
      description: t.description,
      createdAt: t.createdAt.toISOString(),
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
