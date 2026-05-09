import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { API_KEY_PREFIX } from "@/lib/constants";

const createKeySchema = z.object({
  name: z.string().min(1).max(100),
});

export async function GET(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  const keys = await prisma.apiKey.findMany({
    where: { userId: payload.userId },
    select: {
      id: true,
      name: true,
      key: true,
      isActive: true,
      createdAt: true,
      lastUsedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Mask keys — only show last 8 chars
  const masked = keys.map((k) => ({
    ...k,
    key: `${API_KEY_PREFIX}...${k.key.slice(-8)}`,
  }));

  return NextResponse.json({ keys: masked });
}

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
    const { name } = createKeySchema.parse(body);

    const rawKey = `${API_KEY_PREFIX}${uuidv4().replace(/-/g, "")}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: payload.userId,
        key: rawKey,
        name,
      },
    });

    // Return the full key only on creation
    return NextResponse.json(
      { key: { id: apiKey.id, name: apiKey.name, key: rawKey, createdAt: apiKey.createdAt } },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: "Validation failed", type: "validation", code: "invalid_input" } },
        { status: 400 }
      );
    }
    console.error("Key creation error:", err);
    return NextResponse.json(
      { error: { message: "Internal server error", type: "server", code: "internal" } },
      { status: 500 }
    );
  }
}
