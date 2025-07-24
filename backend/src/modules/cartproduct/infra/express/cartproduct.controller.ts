import { Request, Response } from 'express';
import { CartProductUseCases } from '../../app/usecases';
import { CartProductInputDTO } from '../../app/dto/cartproduct-input.dto';

export class CartProductController {
  constructor(private usecases: CartProductUseCases) {}

  async create(req: Request, res: Response) {
    try {
      const input: CartProductInputDTO = req.body;
      const result = await this.usecases.create(input);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await this.usecases.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const result = await this.usecases.getAll();
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await this.usecases.getById(id);
      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
} 