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
exports.ProductUseCases = void 0;
class ProductUseCases {
    constructor(productPort) {
        this.productPort = productPort;
    }
    createProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productPort.create(data);
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productPort.findById(id);
        });
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productPort.findAll();
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.productPort.delete(id);
        });
    }
    updateProduct(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productPort.update(id, data);
        });
    }
}
exports.ProductUseCases = ProductUseCases;
