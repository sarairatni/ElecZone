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
exports.CartProductUseCases = void 0;
class CartProductUseCases {
    constructor(repository) {
        this.repository = repository;
    }
    create(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.create(input);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.delete(id);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getAll();
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getById(id);
        });
    }
    getByCustomerId(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getByCustomerId(customerId);
        });
    }
    updateQuantity(id, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (quantity <= 0) {
                throw new Error("La quantité doit être supérieure à 0");
            }
            return this.repository.updateQuantity(id, quantity);
        });
    }
    deleteAllByCustomerId(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!customerId || customerId <= 0) {
                throw new Error("ID client invalide");
            }
            return this.repository.deleteAllByCustomerId(customerId);
        });
    }
}
exports.CartProductUseCases = CartProductUseCases;
