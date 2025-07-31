"use strict";
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
exports.CategoryController = void 0;
class CategoryController {
    constructor(categoryUseCases) {
        this.categoryUseCases = categoryUseCases;
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const created = yield this.categoryUseCases.createCategory(data);
                res.status(201).json(created);
            }
            catch (error) {
                if (error.code === "P2002") {
                    return res.status(409).json({ error: "Category name must be unique" });
                }
                console.error("Erreur création catégorie:", error);
                res.status(500).json({ error: "Failed to create category" });
            }
        });
        this.findById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const category = yield this.categoryUseCases.getCategoryById(id);
                if (!category)
                    return res.status(404).json({ error: "Category not found" });
                res.json(category);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to get category" });
            }
        });
        this.findAll = (_, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('GET /categories about ot be  called');
                const categories = yield this.categoryUseCases.getAllCategories();
                console.log('GET /categories has been called');
                res.json(categories);
            }
            catch (error) {
                console.error('Error in GET /categories:', error);
                res.status(500).json({ error: "Failed to get categories" });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const data = req.body;
                const updated = yield this.categoryUseCases.updateCategory(id, data);
                res.json(updated);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to update category" });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                yield this.categoryUseCases.deleteCategory(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: "Failed to delete category" });
            }
        });
        this.getProductsByCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const categoryId = parseInt(req.params.id);
            if (isNaN(categoryId)) {
                return res.status(400).json({ error: "Invalid category ID" });
            }
            try {
                const products = yield this.categoryUseCases.findProducts(categoryId);
                res.status(200).json(products);
            }
            catch (error) {
                console.error("Error:", error);
                res.status(500).json({ error: "Failed to fetch products by category" });
            }
        });
    }
}
exports.CategoryController = CategoryController;
