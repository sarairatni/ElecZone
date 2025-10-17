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
exports.OrderUseCases = void 0;
class OrderUseCases {
    constructor(orderPorts) {
        this.orderPorts = orderPorts;
    }
    createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!orderData.customerFname || !orderData.customerLname || !orderData.customerPhone ||
                !orderData.wilaya || !orderData.commune || !orderData.detailedAddress) {
                throw new Error('All customer information fields are required');
            }
            if (!orderData.customerId || orderData.customerId <= 0) {
                throw new Error('Valid customer ID is required');
            }
            // Validate items
            if (!orderData.items || orderData.items.length === 0) {
                throw new Error('At least one item is required');
            }
            // Validate each item
            for (const item of orderData.items) {
                if (!item.productId || item.productId <= 0) {
                    throw new Error('Valid product ID is required for each item');
                }
                if (!item.quantity || item.quantity <= 0) {
                    throw new Error('Valid quantity is required for each item');
                }
                if (!item.unitPrice || item.unitPrice <= 0) {
                    throw new Error('Valid unit price is required for each item');
                }
            }
            // Validate total price
            const calculatedTotal = orderData.items.reduce((total, item) => {
                return total + (item.quantity * item.unitPrice);
            }, 0);
            if (Math.abs(calculatedTotal - orderData.totalPrice) > 0.01) {
                throw new Error('Total price does not match calculated total');
            }
            return yield this.orderPorts.createOrder(orderData);
        });
    }
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderPorts.getAllOrders();
        });
    }
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || id <= 0) {
                throw new Error('Valid order ID is required');
            }
            const order = yield this.orderPorts.getOrderById(id);
            if (!order) {
                throw new Error('Order not found');
            }
            return order;
        });
    }
    getOrdersByCustomerId(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!customerId || customerId <= 0) {
                throw new Error('Valid customer ID is required');
            }
            return yield this.orderPorts.getOrdersByCustomerId(customerId);
        });
    }
    updateOrder(id, orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || id <= 0) {
                throw new Error('Valid order ID is required');
            }
            if (orderData.totalPrice !== undefined && orderData.totalPrice <= 0) {
                throw new Error('Total price must be greater than 0');
            }
            const updatedOrder = yield this.orderPorts.updateOrder(id, orderData);
            if (!updatedOrder) {
                throw new Error('Order not found');
            }
            return updatedOrder;
        });
    }
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id || id <= 0) {
                throw new Error('Valid order ID is required');
            }
            const deleted = yield this.orderPorts.deleteOrder(id);
            if (!deleted) {
                throw new Error('Order not found or could not be deleted');
            }
            return deleted;
        });
    }
}
exports.OrderUseCases = OrderUseCases;
