"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const adapters_1 = require("../adapters");
const usecases_1 = require("../../app/usecases");
const router = (0, express_1.Router)();
const categoryPort = new adapters_1.CategoryAdapter();
const categoryUseCases = new usecases_1.CategoryUseCases(categoryPort);
const controller = new category_controller_1.CategoryController(categoryUseCases);
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
exports.default = router;
