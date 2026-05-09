import { redis } from "./redis";
import { DEFAULT_RATE_LIMIT } from "./constants";

/**
 * Sliding-window rate limiter using Redis.
 * Returns { allowed, remaining, resetInSeconds }.
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = DEFAULT_RATE_LIMIT,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetInSeconds: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  // Use a Redis pipeline for atomicity
  const pipeline = redis.pipeline();
  // Remove entries outside the window
  pipeline.zremrangebyscore(key, 0, now - windowMs);
  // Count current entries
  pipeline.zcard(key);
  // Add current request
  pipeline.zadd(key, now, `${now}:${Math.random()}`);
  // Set TTL
  pipeline.expire(key, windowSeconds);

  const results = await pipeline.exec();
  const currentCount = (results?.[1]?.[1] as number) ?? 0;

  const allowed = currentCount < limit;
  const remaining = Math.max(0, limit - currentCount - (allowed ? 1 : 0));
  const resetInSeconds = windowSeconds;

  return { allowed, remaining, resetInSeconds };
}
