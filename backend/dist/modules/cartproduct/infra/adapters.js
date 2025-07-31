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
exports.CartProductPrismaAdapter = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CartProductPrismaAdapter {
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartProduct = yield prisma.cartProduct.create({
                data: {
                    productId: input.productId,
                    customerId: input.customerId,
                    quantity: input.quantity,
                },
            });
            return cartProduct;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.cartProduct.delete({ where: { id } });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.cartProduct.findMany();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.cartProduct.findUnique({ where: { id } });
        });
    }
    getByCustomerId(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.cartProduct.findMany({
                where: { customerId },
                include: {
                    Product: true,
                    User: {
                        select: {
                            id: true,
                            fname: true,
                            lastname: true,
                            email: true
                        }
                    }
                }
            });
        });
    }
    updateQuantity(id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.cartProduct.update({
                where: { id },
                data: { quantity },
                include: {
                    Product: true,
                    User: {
                        select: {
                            id: true,
                            fname: true,
                            lastname: true,
                            email: true
                        }
                    }
                }
            });
        });
    }
    deleteAllByCustomerId(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.cartProduct.deleteMany({
                where: { customerId }
            });
        });
    }
}
exports.CartProductPrismaAdapter = CartProductPrismaAdapter;
