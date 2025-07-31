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


  findAll = async (_: Request,res:Response) =>{
try{
const users = await this.useCases.getAllUsers();
  res.json(users);
}catch(error){
  res.status(500).json({error:"Failed to get all users"});
}
  }
  delete = async (req: Request, res: Response) => {
try{
const id = Number(req.params.id);
await this.useCases.deleteUser(id);
}catch(error) {
  res.status(500).json({ error: "Failed to delete user" });
}
  }
  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updated = await this.useCases.updateUser(id, data);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  };


  // getProfile = async (req: Request, res: Response) => {
  //   const userId = req.user.userId;
  //   const user = await this.useCases.getById(userId);
  //   res.json(user);
  // };
}
