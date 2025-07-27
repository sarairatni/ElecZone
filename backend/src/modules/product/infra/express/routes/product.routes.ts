// src/modules/product/infra/express/product.routes.ts

import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductUseCases } from "../../../app/usecases";
import { PrismaProductAdapter } from "../../adapters";

const router = Router();

const productPort = new PrismaProductAdapter();
const productUseCases = new ProductUseCases(productPort);
const controller = new ProductController(productUseCases);

// Routes
router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.get("/:id/category", controller.getCategoryByProductId);
export default router;
