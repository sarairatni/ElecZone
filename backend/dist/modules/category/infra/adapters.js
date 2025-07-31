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
exports.CategoryAdapter = void 0;
const client_1 = require("@prisma/client");
class CategoryAdapter {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.prisma.category.create({
                data: {
                    Name: data.Name,
                },
            });
            return this.toOutputDTO(category);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.prisma.category.findUnique({
                where: { CategoryID: id },
            });
            return category ? this.toOutputDTO(category) : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.prisma.category.findMany();
            return categories.map(this.toOutputDTO);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.prisma.category.update({
                where: { CategoryID: id },
                data: {
                    Name: data.Name,
                },
            });
            return this.toOutputDTO(updated);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.category.delete({
                where: { CategoryID: id },
            });
        });
    }
    findProducts(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.product.findMany({
                where: {
                    CategoryID: categoryId,
                },
            });
        });
    }
    //----------------------------------
    toOutputDTO(category) {
        return {
            CategoryID: category.CategoryID,
            Name: category.Name,
            CreatedAt: category.createdAt,
            UpdatedAt: category.updatedAt,
        };
    }
}
exports.CategoryAdapter = CategoryAdapter;
