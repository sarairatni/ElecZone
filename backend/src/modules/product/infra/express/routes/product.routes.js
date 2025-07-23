"use strict";
// src/modules/product/infra/express/product.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const usecases_1 = require("../../../app/usecases");
const adapters_1 = require("../../adapters");
const router = (0, express_1.Router)();
const productPort = new adapters_1.PrismaProductAdapter();
const productUseCases = new usecases_1.ProductUseCases(productPort);
const controller = new product_controller_1.ProductController(productUseCases);
// Routes
router.post("/", controller.create);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
exports.default = router;
