import { Router } from "express";
import { PrismaUserRepo } from "../adapters";
import { UserUseCases } from "../../app/usecases";
import { UserController } from "./controllers/user.controller";
// import { verifyToken } from "./middlewares/auth.middleware";

const router = Router();

const repo = new PrismaUserRepo();
const useCases = new UserUseCases(repo);
const controllerr = new UserController(useCases);

router.get("/", controllerr.findAll);
router.delete("/:id", controllerr.delete)
router.post("/register", controllerr.register);
router.post("/login", controllerr.login);
router.put("/:id", controllerr.update)
// router.get("/me", verifyToken, controller.getProfile);
export default router;
