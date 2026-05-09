import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      balanceUsd: true,
      balanceCredits: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: { message: "User not found", type: "auth", code: "not_found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}
