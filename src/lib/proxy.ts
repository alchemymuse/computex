import { ChatCompletionRequest } from "@/types";

export interface ProxyResult {
  response: Response;
  startTime: number;
}

/**
 * Forward a chat completion request to an upstream endpoint.
 * Passes through all OpenAI-compatible parameters.
 * Returns the raw Response for streaming or JSON consumption.
 */
export async function proxyRequest(
  endpointUrl: string,
  body: ChatCompletionRequest,
  upstreamApiKey?: string
): Promise<ProxyResult> {
  const startTime = Date.now();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (upstreamApiKey) {
    headers["Authorization"] = `Bearer ${upstreamApiKey}`;
  }

  const response = await fetch(endpointUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return { response, startTime };
}

/**
 * Parse a non-streaming response and extract usage info.
 */
export async function parseCompletionResponse(
  response: Response
): Promise<{
  body: Record<string, unknown>;
  promptTokens: number;
  completionTokens: number;
}> {
  const body = await response.json();

  const promptTokens = body?.usage?.prompt_tokens ?? 0;
  const completionTokens = body?.usage?.completion_tokens ?? 0;

  return { body, promptTokens, completionTokens };
}

/**
 * Stream an SSE response from upstream to the client,
 * accumulating content chunks for token counting.
 * Returns the accumulated output text when the stream ends.
 */
export function createStreamRelay(
  upstreamResponse: Response
): { readable: ReadableStream; outputPromise: Promise<string> } {
  let resolveOutput: (value: string) => void;
  const outputPromise = new Promise<string>((resolve) => {
    resolveOutput = resolve;
  });

  const upstreamBody = upstreamResponse.body;
  if (!upstreamBody) {
    resolveOutput!("");
    return {
      readable: new ReadableStream({
        start(controller) {
          controller.close();
        },
      }),
      outputPromise,
    };
  }

  let accumulated = "";
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      const reader = upstreamBody.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // Parse SSE lines to accumulate content
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const parsed = JSON.parse(line.slice(6));
                const delta = parsed?.choices?.[0]?.delta?.content;
                if (delta) {
                  accumulated += delta;
                }
              } catch {
                // Not valid JSON, skip
              }
            }
          }

          // Pass through to client
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
        resolveOutput!(accumulated);
      }
    },
  });

  return { readable, outputPromise };
}
