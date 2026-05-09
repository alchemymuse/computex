import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

/**
 * Log a completed API request for billing and analytics.
 */
export async function logUsage(params: {
  userId: string;
  apiKeyId: string;
  modelId: string;
  listingId?: string;
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  latencyMs: number;
  statusCode: number;
}): Promise<void> {
  await prisma.usageLog.create({
    data: {
      userId: params.userId,
      apiKeyId: params.apiKeyId,
      modelId: params.modelId,
      listingId: params.listingId ?? null,
      inputTokens: params.inputTokens,
      outputTokens: params.outputTokens,
      totalCost: new Prisma.Decimal(params.totalCost),
      latencyMs: params.latencyMs,
      statusCode: params.statusCode,
    },
  });
}
