import { Router } from "express";
import { CategoryController } from "./category.controller";
import { CategoryAdapter } from "../adapters";
import { CategoryUseCases } from "../../app/usecases";

const router = Router();

const categoryPort = new CategoryAdapter();
const categoryUseCases = new CategoryUseCases(categoryPort);
const controller = new CategoryController(categoryUseCases);

/***** 
 const productPort = new PrismaProductAdapter();
 const productUseCases = new ProductUseCases(productPort);
 const controller = new ProductController(productUseCases);
*/

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.get("/:id/products", controller.getProductsByCategory);

export default router;
