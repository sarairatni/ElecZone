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
exports.OrderController = void 0;
class OrderController {
    constructor(orderUseCases) {
        this.orderUseCases = orderUseCases;
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderData = req.body;
                const order = yield this.orderUseCases.createOrder(orderData);
                res.status(201).json(order);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this.orderUseCases.getAllOrders();
                res.status(200).json(orders);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const order = yield this.orderUseCases.getOrderById(id);
                res.status(200).json(order);
            }
            catch (error) {
                res.status(404).json({ error: error.message });
            }
        });
    }
    getOrdersByCustomerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customerId = parseInt(req.params.customerId);
                const orders = yield this.orderUseCases.getOrdersByCustomerId(customerId);
                res.status(200).json(orders);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const orderData = req.body;
                const order = yield this.orderUseCases.updateOrder(id, orderData);
                res.status(200).json(order);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                yield this.orderUseCases.deleteOrder(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(404).json({ error: error.message });
            }
        });
    }
}
exports.OrderController = OrderController;
