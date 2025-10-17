import { ChatRequestDTO } from './dto/ai-input.dto';
import { ChatResponseDTO } from './dto/ai-output.dto';

export interface AIServicePort {
  chat(request: ChatRequestDTO): Promise<ChatResponseDTO>;
}
