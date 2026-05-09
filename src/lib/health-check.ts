import { prisma } from "./prisma";
import { HEALTH_CHECK_INTERVAL } from "./constants";

interface HealthCheckResult {
  listingId: string;
  healthy: boolean;
  latencyMs: number;
  error?: string;
}

/**
 * Perform a health check on a single listing endpoint.
 * Sends a minimal chat completion request and checks for a valid response.
 */
async function checkEndpoint(
  endpointUrl: string,
  listingId: string
): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "health-check",
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const latencyMs = Date.now() - startTime;

    // We accept any 2xx or 4xx (means the endpoint is alive, might just reject our dummy request)
    // Only 5xx or network errors count as unhealthy
    const healthy = response.status < 500;

    return { listingId, healthy, latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    return {
      listingId,
      healthy: false,
      latencyMs,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Run health checks on all active listings that haven't been checked recently.
 * Marks listings as verified/unverified based on results.
 * Returns summary of results.
 */
export async function runHealthChecks(): Promise<{
  checked: number;
  healthy: number;
  unhealthy: number;
}> {
  const staleThreshold = new Date(
    Date.now() - HEALTH_CHECK_INTERVAL * 1000
  );

  // Find listings that need checking
  const listings = await prisma.listing.findMany({
    where: {
      isActive: true,
      OR: [
        { lastHealthCheck: null },
        { lastHealthCheck: { lt: staleThreshold } },
      ],
    },
    select: { id: true, endpointUrl: true },
    take: 50, // Batch size
  });

  if (listings.length === 0) {
    return { checked: 0, healthy: 0, unhealthy: 0 };
  }

  // Run checks in parallel (with concurrency limit)
  const results = await Promise.allSettled(
    listings.map((listing) => checkEndpoint(listing.endpointUrl, listing.id))
  );

  let healthy = 0;
  let unhealthy = 0;

  for (const result of results) {
    if (result.status !== "fulfilled") continue;

    const { listingId, healthy: isHealthy } = result.value;

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        isVerified: isHealthy,
        lastHealthCheck: new Date(),
      },
    });

    if (isHealthy) healthy++;
    else unhealthy++;
  }

  return { checked: listings.length, healthy, unhealthy };
}

/**
 * Mark a single listing as verified (used after manual admin approval).
 */
export async function verifyListing(listingId: string): Promise<void> {
  await prisma.listing.update({
    where: { id: listingId },
    data: { isVerified: true, lastHealthCheck: new Date() },
  });
}

/**
 * Unverify a listing (e.g., after a failed request).
 */
export async function unverifyListing(listingId: string): Promise<void> {
  await prisma.listing.update({
    where: { id: listingId },
    data: { isVerified: false },
  });
}
