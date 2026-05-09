import { NextResponse } from "next/server";
import { getAvailableModels } from "@/lib/router";

/**
 * OpenAI-compatible /v1/models endpoint.
 * Lists all models that have at least one active, verified listing.
 */
export async function GET() {
  const models = await getAvailableModels();

  // Format as OpenAI-compatible model list
  const data = models.map((m) => ({
    id: m.slug,
    object: "model" as const,
    created: Math.floor(Date.now() / 1000),
    owned_by: m.provider.toLowerCase(),
    // ComputeX extensions
    x_provider: m.provider,
    x_display_name: m.name,
    x_min_input_price_per_million: m.minInputPrice,
    x_min_output_price_per_million: m.minOutputPrice,
  }));

  return NextResponse.json({ object: "list", data });
}
