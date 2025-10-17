export interface ChatResponseDTO {
  message: string;
  role: 'assistant';
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ChatErrorDTO {
  error: string;
  message: string;
}
