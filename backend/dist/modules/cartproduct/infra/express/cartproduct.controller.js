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
exports.CartProductController = void 0;
class CartProductController {
    constructor(usecases) {
        this.usecases = usecases;
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = req.body;
                const result = yield this.usecases.create(input);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                yield this.usecases.delete(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.usecases.getAll();
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const result = yield this.usecases.getById(id);
                if (result) {
                    res.json(result);
                }
                else {
                    res.status(404).json({ error: 'Not found' });
                }
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    getByCustomerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerId = Number(req.params.customerId);
                const result = yield this.usecases.getByCustomerId(customerId);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    updateQuantity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const { quantity } = req.body;
                if (!quantity || typeof quantity !== 'number') {
                    return res.status(400).json({ error: 'La quantité est requise et doit être un nombre' });
                }
                const result = yield this.usecases.updateQuantity(id, quantity);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    deleteAllByCustomerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerId = Number(req.params.customerId);
                yield this.usecases.deleteAllByCustomerId(customerId);
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.CartProductController = CartProductController;
