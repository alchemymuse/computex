import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

const createListingSchema = z.object({
  modelId: z.string(),
  endpointUrl: z.string().url(),
  inputPricePerMillion: z.number().positive(),
  outputPricePerMillion: z.number().positive(),
  maxConcurrency: z.number().int().min(1).max(1000).default(10),
});

/**
 * GET /api/marketplace/listings — Browse all active listings.
 * Query params:
 *   model    — filter by model slug (e.g. "gpt-4o")
 *   provider — filter by provider name (e.g. "OpenAI")
 *   verified — "true" to only show verified listings
 *   sort     — "price" (default) | "newest"
 *   page     — page number (default 1)
 *   limit    — items per page (default 20, max 100)
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const modelSlug = url.searchParams.get("model");
  const provider = url.searchParams.get("provider");
  const verifiedOnly = url.searchParams.get("verified") === "true";
  const sort = url.searchParams.get("sort") || "price";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));

  const where: Prisma.ListingWhereInput = {
    isActive: true,
    ...(verifiedOnly && { isVerified: true }),
    ...(modelSlug && { model: { slug: modelSlug } }),
    ...(provider && { model: { provider: { equals: provider, mode: "insensitive" } } }),
  };

  const orderBy: Prisma.ListingOrderByWithRelationInput =
    sort === "newest"
      ? { createdAt: "desc" }
      : { inputPricePerMillion: "asc" };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        seller: { select: { id: true, name: true } },
        model: { select: { slug: true, name: true, provider: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

/** POST /api/marketplace/listings — Create a new listing (sellers only) */
export async function POST(req: NextRequest) {
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  if (payload.role !== "SELLER" && payload.role !== "ADMIN") {
    return NextResponse.json(
      { error: { message: "Only sellers can create listings. Upgrade your role first.", type: "forbidden", code: "forbidden" } },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const data = createListingSchema.parse(body);

    const model = await prisma.aiModel.findUnique({ where: { id: data.modelId } });
    if (!model) {
      return NextResponse.json(
        { error: { message: "Model not found", type: "not_found", code: "model_not_found" } },
        { status: 404 }
      );
    }

    // Check for duplicate active listing by this seller for the same model+endpoint
    const existing = await prisma.listing.findFirst({
      where: {
        sellerId: payload.userId,
        modelId: data.modelId,
        endpointUrl: data.endpointUrl,
        isActive: true,
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: { message: "You already have an active listing for this model at this endpoint", type: "conflict", code: "duplicate_listing" } },
        { status: 409 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        sellerId: payload.userId,
        modelId: data.modelId,
        endpointUrl: data.endpointUrl,
        inputPricePerMillion: data.inputPricePerMillion,
        outputPricePerMillion: data.outputPricePerMillion,
        maxConcurrency: data.maxConcurrency,
      },
      include: {
        model: { select: { slug: true, name: true } },
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: "Validation failed", type: "validation", code: "invalid_input", details: err.issues } },
        { status: 400 }
      );
    }
    console.error("Listing creation error:", err);
    return NextResponse.json(
      { error: { message: "Internal server error", type: "server", code: "internal" } },
      { status: 500 }
    );
  }
}
