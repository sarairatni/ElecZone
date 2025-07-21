import { Request, Response } from "express";
import { UserUseCases } from "../../../app/usecases";

export class UserController {
  constructor(private useCases: UserUseCases) {}

  register = async (req: Request, res: Response) => {
    try {
      const user = await this.useCases.register(req.body);
      res.status(201).json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const result = await this.useCases.login(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  };

  // getProfile = async (req: Request, res: Response) => {
  //   const userId = req.user.userId;
  //   const user = await this.useCases.getById(userId);
  //   res.json(user);
  // };
}
