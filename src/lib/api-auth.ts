import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { redis } from "./redis";
import { API_KEY_PREFIX } from "./constants";

export interface AuthenticatedUser {
  userId: string;
  apiKeyId: string;
  email: string;
  role: string;
}

/**
 * Authenticate a request using a ComputeX API key (cx-...).
 * Looks up the key in Redis cache first, falls back to Postgres.
 */
export async function authenticateApiKey(
  req: NextRequest
): Promise<AuthenticatedUser | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const key = authHeader.slice(7).trim();
  if (!key.startsWith(API_KEY_PREFIX)) return null;

  // Check Redis cache first
  const cacheKey = `apikey:${key}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached) as AuthenticatedUser;
  }

  // Fallback to database
  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    include: {
      user: { select: { id: true, email: true, role: true } },
    },
  });

  if (!apiKey || !apiKey.isActive) return null;

  const result: AuthenticatedUser = {
    userId: apiKey.user.id,
    apiKeyId: apiKey.id,
    email: apiKey.user.email,
    role: apiKey.user.role,
  };

  // Cache for 5 minutes
  await redis.set(cacheKey, JSON.stringify(result), "EX", 300);

  // Update lastUsedAt (fire-and-forget)
  prisma.apiKey
    .update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch(() => {});

  return result;
}
