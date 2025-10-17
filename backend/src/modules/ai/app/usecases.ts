import { ChatRequestDTO } from './dto/ai-input.dto';
import { ChatResponseDTO } from './dto/ai-output.dto';
import { AIServicePort } from './ai.ports';

export class ChatUseCase {
  constructor(private aiService: AIServicePort) {}

  async execute(request: ChatRequestDTO): Promise<ChatResponseDTO> {
    if (!request.messages || request.messages.length === 0) {
      throw new Error('Messages array cannot be empty');
    }

    const lastMessage = request.messages[request.messages.length - 1];
    if (lastMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }

    return await this.aiService.chat(request);
  }
}
