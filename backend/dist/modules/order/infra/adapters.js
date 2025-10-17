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
exports.OrderAdapters = void 0;
const client_1 = require("@prisma/client");
const mapOrderItems = (items) => {
    return items.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        product: {
            ProductID: item.Product.ProductID,
            Name: item.Product.Name,
            Description: item.Product.Description,
            Price: item.Product.Price,
            ImgUrl: item.Product.ImgUrl
        }
    }));
};
class OrderAdapters {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.prisma.order.create({
                data: {
                    customerFname: orderData.customerFname,
                    customerLname: orderData.customerLname,
                    customerPhone: orderData.customerPhone,
                    customerId: orderData.customerId,
                    wilaya: orderData.wilaya,
                    commune: orderData.commune,
                    postalCode: orderData.postalCode,
                    detailedAddress: orderData.detailedAddress,
                    totalPrice: orderData.totalPrice,
                    status: 'PENDING'
                },
                include: {
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
            // 2. Grouper les produits identiques et additionner leurs quantités
            const groupedItems = orderData.items.reduce((acc, item) => {
                const existingItem = acc.find(groupedItem => groupedItem.productId === item.productId);
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                    existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
                }
                else {
                    acc.push({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.quantity * item.unitPrice
                    });
                }
                return acc;
            }, []);
            // 3. Créer les OrderItems pour chaque produit groupé
            const orderItems = yield Promise.all(groupedItems.map(item => this.prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice
                },
                include: { Product: true }
            })));
            // 3. Formater la réponse
            return {
                id: order.id,
                customerFname: order.customerFname,
                customerLname: order.customerLname,
                customerPhone: order.customerPhone,
                customerId: order.customerId,
                wilaya: order.wilaya,
                commune: order.commune,
                postalCode: order.postalCode || undefined,
                detailedAddress: order.detailedAddress,
                totalPrice: order.totalPrice,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                orderItems: mapOrderItems(orderItems),
                user: order.User
            };
        });
    }
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.prisma.order.findMany({
                include: {
                    User: {
                        select: {
                            id: true,
                            fname: true,
                            lastname: true,
                            email: true
                        }
                    },
                    OrderItems: {
                        include: { Product: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return orders.map(order => ({
                id: order.id,
                customerFname: order.customerFname,
                customerLname: order.customerLname,
                customerPhone: order.customerPhone,
                customerId: order.customerId,
                wilaya: order.wilaya,
                commune: order.commune,
                postalCode: order.postalCode || undefined,
                detailedAddress: order.detailedAddress,
                totalPrice: order.totalPrice,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                orderItems: mapOrderItems(order.OrderItems),
                user: order.User
            }));
        });
    }
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.prisma.order.findUnique({
                where: { id },
                include: {
                    User: {
                        select: {
                            id: true,
                            fname: true,
                            lastname: true,
                            email: true
                        }
                    },
                    OrderItems: {
                        include: { Product: true }
                    }
                }
            });
            if (!order)
                return null;
            return {
                id: order.id,
                customerFname: order.customerFname,
                customerLname: order.customerLname,
                customerPhone: order.customerPhone,
                customerId: order.customerId,
                wilaya: order.wilaya,
                commune: order.commune,
                postalCode: order.postalCode || undefined,
                detailedAddress: order.detailedAddress,
                totalPrice: order.totalPrice,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                orderItems: mapOrderItems(order.OrderItems),
                user: order.User
            };
        });
    }
    getOrdersByCustomerId(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.prisma.order.findMany({
                where: { customerId },
                include: {
                    User: {
                        select: {
                            id: true,
                            fname: true,
                            lastname: true,
                            email: true
                        }
                    },
                    OrderItems: {
                        include: { Product: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            return orders.map(order => ({
                id: order.id,
                customerFname: order.customerFname,
                customerLname: order.customerLname,
                customerPhone: order.customerPhone,
                customerId: order.customerId,
                wilaya: order.wilaya,
                commune: order.commune,
                postalCode: order.postalCode || undefined,
                detailedAddress: order.detailedAddress,
                totalPrice: order.totalPrice,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                orderItems: mapOrderItems(order.OrderItems),
                user: order.User
            }));
        });
    }
    updateOrder(id, orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.prisma.order.update({
                where: { id },
                data: orderData,
                include: {
                    User: {
                        select: {
                            id: true,
                            fname: true,
                            lastname: true,
                            email: true
                        }
                    },
                    OrderItems: {
                        include: { Product: true }
                    }
                }
            });
            return {
                id: order.id,
                customerFname: order.customerFname,
                customerLname: order.customerLname,
                customerPhone: order.customerPhone,
                customerId: order.customerId,
                wilaya: order.wilaya,
                commune: order.commune,
                postalCode: order.postalCode || undefined,
                detailedAddress: order.detailedAddress,
                totalPrice: order.totalPrice,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                orderItems: mapOrderItems(order.OrderItems),
                user: order.User
            };
        });
    }
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.order.delete({
                    where: { id }
                });
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.OrderAdapters = OrderAdapters;
