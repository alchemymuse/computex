import { prisma } from "./prisma";

export interface RouteTarget {
  type: "listing";
  listingId: string;
  endpointUrl: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  sellerId: string;
  modelId: string;
  modelSlug: string;
  modelName: string;
}

interface ListingRow {
  id: string;
  endpointUrl: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  sellerId: string;
  modelId: string;
  modelSlug: string;
  modelName: string;
}

/**
 * Find the best available offer for a given model slug.
 * Strategy: Lowest input price among active, verified listings with available concurrency.
 * Uses raw SQL for the cross-field concurrency comparison.
 */
export async function findBestOffer(
  modelSlug: string
): Promise<RouteTarget | null> {
  const rows = await prisma.$queryRaw<ListingRow[]>`
    SELECT
      l."id",
      l."endpointUrl",
      l."inputPricePerMillion",
      l."outputPricePerMillion",
      l."sellerId",
      m."id" AS "modelId",
      m."slug" AS "modelSlug",
      m."name" AS "modelName"
    FROM "Listing" l
    JOIN "AiModel" m ON l."modelId" = m."id"
    WHERE m."slug" = ${modelSlug}
      AND m."isActive" = true
      AND l."isActive" = true
      AND l."isVerified" = true
      AND l."currentConcurrency" < l."maxConcurrency"
    ORDER BY l."inputPricePerMillion" ASC, l."outputPricePerMillion" ASC
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    type: "listing",
    listingId: row.id,
    endpointUrl: row.endpointUrl,
    inputPricePerMillion: Number(row.inputPricePerMillion),
    outputPricePerMillion: Number(row.outputPricePerMillion),
    sellerId: row.sellerId,
    modelId: row.modelId,
    modelSlug: row.modelSlug,
    modelName: row.modelName,
  };
}

/**
 * Atomically increment concurrency if a slot is available.
 * Returns true if a slot was acquired.
 */
export async function acquireConcurrencySlot(
  listingId: string
): Promise<boolean> {
  const result = await prisma.$executeRaw`
    UPDATE "Listing"
    SET "currentConcurrency" = "currentConcurrency" + 1
    WHERE "id" = ${listingId}
      AND "currentConcurrency" < "maxConcurrency"
  `;
  return result > 0;
}

/**
 * Decrement concurrency counter for a listing (call after proxying).
 */
export async function releaseConcurrencySlot(
  listingId: string
): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "Listing"
    SET "currentConcurrency" = GREATEST("currentConcurrency" - 1, 0)
    WHERE "id" = ${listingId}
  `;
}

/**
 * List all available models with their cheapest listing price.
 */
export async function getAvailableModels(): Promise<
  Array<{
    slug: string;
    name: string;
    provider: string;
    minInputPrice: number;
    minOutputPrice: number;
  }>
> {
  const models = await prisma.aiModel.findMany({
    where: {
      isActive: true,
      listings: {
        some: { isActive: true, isVerified: true },
      },
    },
    include: {
      listings: {
        where: { isActive: true, isVerified: true },
        orderBy: { inputPricePerMillion: "asc" },
        take: 1,
        select: {
          inputPricePerMillion: true,
          outputPricePerMillion: true,
        },
      },
    },
  });

  return models.map((m) => ({
    slug: m.slug,
    name: m.name,
    provider: m.provider,
    minInputPrice: m.listings[0]?.inputPricePerMillion.toNumber() ?? 0,
    minOutputPrice: m.listings[0]?.outputPricePerMillion.toNumber() ?? 0,
  }));
}
