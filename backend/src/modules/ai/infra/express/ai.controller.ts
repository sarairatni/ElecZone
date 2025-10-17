import { Response } from 'express';
import { ChatUseCase } from '../../app/usecases';
import { OpenAIAdapter } from '../adapters';
import { CustomRequest } from '../../../user/infra/express/middlewares/auth.middleware';

const aiAdapter = new OpenAIAdapter();
const chatUseCase = new ChatUseCase(aiAdapter);

export class AIController {
  static async chat(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { messages, temperature, maxTokens } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Messages array is required and cannot be empty'
        });
        return;
      }

      const userId = req.user?.userId;

      const response = await chatUseCase.execute({
        messages,
        userId,
        temperature,
        maxTokens,
      });

      res.status(200).json(response);
    } catch (error: any) {
      console.error('AI Controller Error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message || 'Failed to process chat request'
      });
    }
  }
}
