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
exports.PrismaProductAdapter = void 0;
const client_1 = require("@prisma/client");
class PrismaProductAdapter {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.prisma.product.create({
                data: {
                    Name: data.Name,
                    Description: data.Description,
                    Price: data.Price,
                    CategoryID: data.CategoryID,
                    ImgUrl: data.ImgUrl,
                }, include: { Category: true }
            });
            return this.toOutputDTO(product);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.prisma.product.findUnique({
                where: { ProductID: id },
                include: { Category: true }
            });
            return product ? this.toOutputDTO(product) : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.prisma.product.findMany({ include: { Category: true } });
            return products.map(this.toOutputDTO);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.product.delete({
                where: { ProductID: id },
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.prisma.product.update({
                where: { ProductID: id },
                data: {
                    Name: data.Name,
                    Description: data.Description,
                    Price: data.Price,
                    CategoryID: data.CategoryID,
                    ImgUrl: data.ImgUrl,
                }, include: { Category: true }
            });
            return this.toOutputDTO(updated);
        });
    }
    toOutputDTO(product) {
        console.log("Prisma product with category:", product);
        return {
            ProductID: product.ProductID,
            Name: product.Name,
            Description: product.Description,
            Price: product.Price,
            CategoryID: product.CategoryID,
            ImgUrl: product.ImgUrl,
            CategoryName: product.Category.Name
        };
    }
    getCategoryByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.prisma.product.findUnique({
                where: { ProductID: productId },
                include: { Category: true }
            });
            console.log("Prisma product with category:", product);
            if (!product || !product.Category)
                return null;
            return {
                CategoryID: product.Category.CategoryID,
                Name: product.Category.Name
            };
        });
    }
}
exports.PrismaProductAdapter = PrismaProductAdapter;
