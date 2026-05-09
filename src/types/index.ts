export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ApiErrorResponse {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

export interface ListingWithModel {
  id: string;
  endpointUrl: string;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  maxConcurrency: number;
  currentConcurrency: number;
  isVerified: boolean;
  seller: {
    id: string;
    name: string;
  };
  model: {
    slug: string;
    name: string;
    provider: string;
  };
}
