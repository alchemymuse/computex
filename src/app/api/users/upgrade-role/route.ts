import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

/** POST /api/users/upgrade-role — Upgrade BUYER to SELLER */
export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  if (payload.role === "SELLER" || payload.role === "ADMIN") {
    return NextResponse.json(
      { error: { message: "Already a seller or admin", type: "conflict", code: "already_seller" } },
      { status: 409 }
    );
  }

  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: { role: "SELLER" },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json({
    message: "Role upgraded to SELLER. You can now create listings.",
    user,
  });
}
