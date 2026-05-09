import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateApiKey } from "@/lib/api-auth";
import { hasMinimumBalance, deductBalance } from "@/lib/balance";
import { lockEscrow, releaseEscrow, estimateMaxCost } from "@/lib/escrow";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  findBestOffer,
  acquireConcurrencySlot,
  releaseConcurrencySlot,
  type RouteTarget,
} from "@/lib/router";
import {
  proxyRequest,
  parseCompletionResponse,
  createStreamRelay,
} from "@/lib/proxy";
import { countMessageTokens, estimateTokens, calculateCost } from "@/lib/tokens";
import { logUsage } from "@/lib/usage";
import type { ChatCompletionRequest } from "@/types";
import type { AuthenticatedUser } from "@/lib/api-auth";

const DEFAULT_MAX_OUTPUT_TOKENS = 4096;

const requestSchema = z.object({
  model: z.string().min(1),
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string(),
      })
    )
    .min(1),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().optional(),
  stream: z.boolean().optional().default(false),
});

function errorResponse(message: string, code: string, status: number) {
  return NextResponse.json(
    { error: { message, type: "error", code } },
    { status }
  );
}

export async function POST(req: NextRequest) {
  // 1. Authenticate via API key
  const auth = await authenticateApiKey(req);
  if (!auth) {
    return errorResponse(
      "Invalid or missing API key. Use 'Authorization: Bearer cx-...'",
      "invalid_api_key",
      401
    );
  }

  // 2. Rate limit
  const { allowed, remaining, resetInSeconds } = await checkRateLimit(
    auth.userId
  );
  if (!allowed) {
    const res = errorResponse(
      "Rate limit exceeded. Try again later.",
      "rate_limit_exceeded",
      429
    );
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("Retry-After", resetInSeconds.toString());
    return res;
  }

  // 3. Parse and validate request body
  let body: ChatCompletionRequest;
  try {
    const raw = await req.json();
    body = requestSchema.parse(raw) as ChatCompletionRequest;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return errorResponse(
        `Invalid request: ${err.issues.map((e: { message: string }) => e.message).join(", ")}`,
        "invalid_request",
        400
      );
    }
    return errorResponse("Invalid JSON body", "invalid_request", 400);
  }

  // 4. Check balance
  const hasFunds = await hasMinimumBalance(auth.userId);
  if (!hasFunds) {
    return errorResponse(
      "Insufficient balance. Please top up your account.",
      "insufficient_balance",
      402
    );
  }

  // 5. Find best offer for the requested model
  const target = await findBestOffer(body.model);
  if (!target) {
    return errorResponse(
      `No available provider for model '${body.model}'. Check /v1/models for supported models.`,
      "model_not_found",
      404
    );
  }

  // 6. Acquire concurrency slot
  const slotAcquired = await acquireConcurrencySlot(target.listingId);
  if (!slotAcquired) {
    return errorResponse(
      "All providers for this model are at capacity. Try again shortly.",
      "capacity_exceeded",
      503
    );
  }

  try {
    // 7. Proxy the request to upstream
    const { response: upstreamResponse, startTime } = await proxyRequest(
      target.endpointUrl,
      body
    );

    if (!upstreamResponse.ok) {
      const latencyMs = Date.now() - startTime;
      // Log failed request (no billing)
      logUsage({
        userId: auth.userId,
        apiKeyId: auth.apiKeyId,
        modelId: target.modelId,
        listingId: target.listingId,
        inputTokens: 0,
        outputTokens: 0,
        totalCost: 0,
        latencyMs,
        statusCode: upstreamResponse.status,
      }).catch(() => {});

      const errorBody = await upstreamResponse
        .text()
        .catch(() => "Upstream error");
      return errorResponse(
        `Upstream provider error: ${errorBody.slice(0, 200)}`,
        "upstream_error",
        502
      );
    }

    // 8. Handle streaming vs non-streaming
    if (body.stream) {
      // For streaming: lock escrow upfront based on estimated max cost
      const inputTokens = countMessageTokens(body.messages);
      const maxOutput = body.max_tokens || DEFAULT_MAX_OUTPUT_TOKENS;
      const estimatedMax = estimateMaxCost(
        inputTokens,
        maxOutput,
        target.inputPricePerMillion,
        target.outputPricePerMillion
      );

      const escrow = await lockEscrow(auth.userId, estimatedMax, {
        model: target.modelSlug,
        listingId: target.listingId,
      });

      if (!escrow) {
        return errorResponse(
          "Insufficient balance to cover estimated cost of this request.",
          "insufficient_balance",
          402
        );
      }

      return handleStreamResponse(upstreamResponse, startTime, body, target, auth, escrow);
    } else {
      return await handleJsonResponse(
        upstreamResponse,
        startTime,
        body,
        target,
        auth
      );
    }
  } catch (err) {
    console.error("Proxy error:", err);
    return errorResponse("Internal proxy error", "proxy_error", 500);
  } finally {
    // Always release the concurrency slot
    releaseConcurrencySlot(target.listingId).catch(() => {});
  }
}

async function handleJsonResponse(
  upstreamResponse: Response,
  startTime: number,
  body: ChatCompletionRequest,
  target: RouteTarget,
  auth: AuthenticatedUser
) {
  const {
    body: responseBody,
    promptTokens,
    completionTokens,
  } = await parseCompletionResponse(upstreamResponse);

  const latencyMs = Date.now() - startTime;

  // Use upstream token counts if available, otherwise estimate
  const inputTokens = promptTokens || countMessageTokens(body.messages);
  const outputTokens =
    completionTokens ||
    estimateTokens(
      ((responseBody as { choices?: { message?: { content?: string } }[] })
        ?.choices?.[0]?.message?.content ?? "")
    );

  const totalCost = calculateCost(
    inputTokens,
    outputTokens,
    target.inputPricePerMillion,
    target.outputPricePerMillion
  );

  // Deduct balance and log (fire-and-forget for latency)
  const description = `${target.modelSlug} — ${inputTokens} in / ${outputTokens} out`;

  deductBalance(auth.userId, totalCost, description, {
    model: target.modelSlug,
    listingId: target.listingId,
    inputTokens,
    outputTokens,
  }).catch((err) => console.error("Balance deduction error:", err));

  logUsage({
    userId: auth.userId,
    apiKeyId: auth.apiKeyId,
    modelId: target.modelId,
    listingId: target.listingId,
    inputTokens,
    outputTokens,
    totalCost,
    latencyMs,
    statusCode: 200,
  }).catch((err) => console.error("Usage log error:", err));

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("X-ComputeX-Model", target.modelSlug);
  headers.set("X-ComputeX-Latency", latencyMs.toString());
  headers.set("X-ComputeX-Cost", totalCost.toFixed(8));

  return new NextResponse(JSON.stringify(responseBody), {
    status: 200,
    headers,
  });
}

function handleStreamResponse(
  upstreamResponse: Response,
  startTime: number,
  body: ChatCompletionRequest,
  target: RouteTarget,
  auth: AuthenticatedUser,
  escrow: { lockId: string; userId: string; amount: number }
) {
  const { readable, outputPromise } = createStreamRelay(upstreamResponse);

  // When stream completes, calculate actual cost and release escrow (refund difference)
  outputPromise.then((outputText) => {
    const latencyMs = Date.now() - startTime;
    const inputTokens = countMessageTokens(body.messages);
    const outputTokens = estimateTokens(outputText);

    const totalCost = calculateCost(
      inputTokens,
      outputTokens,
      target.inputPricePerMillion,
      target.outputPricePerMillion
    );

    const description = `${target.modelSlug} (stream) — ${inputTokens} in / ${outputTokens} out`;

    releaseEscrow(escrow, totalCost, description, {
      model: target.modelSlug,
      listingId: target.listingId,
      inputTokens,
      outputTokens,
    }).catch((err) => console.error("Escrow release error:", err));

    logUsage({
      userId: auth.userId,
      apiKeyId: auth.apiKeyId,
      modelId: target.modelId,
      listingId: target.listingId,
      inputTokens,
      outputTokens,
      totalCost,
      latencyMs,
      statusCode: 200,
    }).catch((err) => console.error("Usage log error:", err));
  });

  const headers = new Headers();
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache");
  headers.set("Connection", "keep-alive");
  headers.set("X-ComputeX-Model", target.modelSlug);

  return new NextResponse(readable, { status: 200, headers });
}
