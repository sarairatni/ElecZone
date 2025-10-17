export interface ChatMessageDTO {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequestDTO {
  messages: ChatMessageDTO[];
  userId?: string;
  temperature?: number;
  maxTokens?: number;
}
