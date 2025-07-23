"use strict";
// src/modules/product/infra/express/product.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
class ProductController {
    constructor(productUseCases) {
        this.productUseCases = productUseCases;
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const created = yield this.productUseCases.createProduct(data);
                res.status(201).json(created);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to create product" });
            }
        });
        this.findById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const product = yield this.productUseCases.getProductById(id);
                if (!product)
                    return res.status(404).json({ error: "Product not found" });
                res.json(product);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to get product" });
            }
        });
        this.findAll = (_, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this.productUseCases.getAllProducts();
                res.json(products);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to get products" });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const data = req.body;
                const updated = yield this.productUseCases.updateProduct(id, data);
                res.json(updated);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to update product" });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                yield this.productUseCases.deleteProduct(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: "Failed to delete product" });
            }
        });
    }
}
exports.ProductController = ProductController;
