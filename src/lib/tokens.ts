/**
 * Token counting utilities for billing.
 * Uses a simple heuristic (chars / 4) as a fast approximation.
 * For production accuracy, integrate tiktoken or the provider's token counter.
 */

export function estimateTokens(text: string): number {
  // Approximate: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  inputPricePerMillion: number,
  outputPricePerMillion: number
): number {
  const inputCost = (inputTokens / 1_000_000) * inputPricePerMillion;
  const outputCost = (outputTokens / 1_000_000) * outputPricePerMillion;
  return inputCost + outputCost;
}

export function countMessageTokens(
  messages: Array<{ role: string; content: string }>
): number {
  let total = 0;
  for (const msg of messages) {
    // ~4 tokens overhead per message for role/formatting
    total += 4 + estimateTokens(msg.content);
  }
  // Every reply is primed with assistant prefix
  total += 2;
  return total;
}
