import { AIServicePort } from '../app/ai.ports';
import { ChatRequestDTO } from '../app/dto/ai-input.dto';
import { ChatResponseDTO } from '../app/dto/ai-output.dto';
import OpenAI from 'openai';

export class OpenAIAdapter implements AIServicePort {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async chat(request: ChatRequestDTO): Promise<ChatResponseDTO> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: request.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 1000,
      });

      const choice = completion.choices[0];

      return {
        message: choice.message.content || '',
        role: 'assistant',
        finishReason: choice.finish_reason || undefined,
        usage: completion.usage ? {
          promptTokens: completion.usage.prompt_tokens,
          completionTokens: completion.usage.completion_tokens,
          totalTokens: completion.usage.total_tokens,
        } : undefined,
      };
    } catch (error: any) {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
}
