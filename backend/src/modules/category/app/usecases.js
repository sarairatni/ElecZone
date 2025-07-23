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
exports.CategoryUseCases = void 0;
class CategoryUseCases {
    constructor(repo) {
        this.repo = repo;
    }
    createCategory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.create(input);
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.findAll();
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.findById(id);
        });
    }
    updateCategory(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.update(id, input);
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.delete(id);
        });
    }
    findProducts(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.findProducts(categoryId);
        });
    }
}
exports.CategoryUseCases = CategoryUseCases;
