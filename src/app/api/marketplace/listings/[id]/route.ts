import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

const updateListingSchema = z.object({
  endpointUrl: z.string().url().optional(),
  inputPricePerMillion: z.number().positive().optional(),
  outputPricePerMillion: z.number().positive().optional(),
  maxConcurrency: z.number().int().min(1).max(1000).optional(),
  isActive: z.boolean().optional(),
});

/** GET /api/marketplace/listings/[id] — Get a single listing */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      seller: { select: { id: true, name: true } },
      model: { select: { slug: true, name: true, provider: true } },
    },
  });

  if (!listing) {
    return NextResponse.json(
      { error: { message: "Listing not found", type: "not_found", code: "not_found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ listing });
}

/** PATCH /api/marketplace/listings/[id] — Update own listing */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    return NextResponse.json(
      { error: { message: "Listing not found", type: "not_found", code: "not_found" } },
      { status: 404 }
    );
  }

  // Only the owner or admin can update
  if (listing.sellerId !== payload.userId && payload.role !== "ADMIN") {
    return NextResponse.json(
      { error: { message: "Forbidden", type: "forbidden", code: "forbidden" } },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const data = updateListingSchema.parse(body);

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...(data.endpointUrl && { endpointUrl: data.endpointUrl }),
        ...(data.inputPricePerMillion && { inputPricePerMillion: data.inputPricePerMillion }),
        ...(data.outputPricePerMillion && { outputPricePerMillion: data.outputPricePerMillion }),
        ...(data.maxConcurrency && { maxConcurrency: data.maxConcurrency }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        // Reset verification if endpoint changed
        ...(data.endpointUrl && { isVerified: false }),
      },
      include: {
        model: { select: { slug: true, name: true } },
      },
    });

    return NextResponse.json({ listing: updated });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: { message: "Validation failed", type: "validation", code: "invalid_input", details: err.issues } },
        { status: 400 }
      );
    }
    console.error("Listing update error:", err);
    return NextResponse.json(
      { error: { message: "Internal server error", type: "server", code: "internal" } },
      { status: 500 }
    );
  }
}

/** DELETE /api/marketplace/listings/[id] — Deactivate (soft delete) own listing */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json(
      { error: { message: "Unauthorized", type: "auth", code: "unauthorized" } },
      { status: 401 }
    );
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    return NextResponse.json(
      { error: { message: "Listing not found", type: "not_found", code: "not_found" } },
      { status: 404 }
    );
  }

  if (listing.sellerId !== payload.userId && payload.role !== "ADMIN") {
    return NextResponse.json(
      { error: { message: "Forbidden", type: "forbidden", code: "forbidden" } },
      { status: 403 }
    );
  }

  await prisma.listing.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ message: "Listing deactivated" });
}
