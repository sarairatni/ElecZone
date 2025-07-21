import { Router } from "express";
import { PrismaUserRepo } from "../adapters";
import { UserUseCases } from "../../app/usecases";
import { UserController } from "./controllers/user.controller";
import { verifyToken } from "./middlewares/auth.middleware";

const router = Router();
const repo = new PrismaUserRepo();
const useCases = new UserUseCases(repo);
const controller = new UserController(useCases);

router.post("/register", controller.register);
router.post("/login", controller.login);
// router.get("/me", verifyToken, controller.getProfile);

export default router;
