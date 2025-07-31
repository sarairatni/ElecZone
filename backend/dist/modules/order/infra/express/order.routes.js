"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const usecases_1 = require("../../app/usecases");
const adapters_1 = require("../adapters");
const router = (0, express_1.Router)();
const orderAdapters = new adapters_1.OrderAdapters();
const orderUseCases = new usecases_1.OrderUseCases(orderAdapters);
const orderController = new order_controller_1.OrderController(orderUseCases);
// Create a new order
router.post('/', (req, res) => orderController.createOrder(req, res));
// Get all orders
router.get('/', (req, res) => orderController.getAllOrders(req, res));
// Get order by ID
router.get('/:id', (req, res) => orderController.getOrderById(req, res));
// Get orders by customer ID
router.get('/customer/:customerId', (req, res) => orderController.getOrdersByCustomerId(req, res));
// Update order
router.put('/:id', (req, res) => orderController.updateOrder(req, res));
// Delete order
router.delete('/:id', (req, res) => orderController.deleteOrder(req, res));
exports.default = router;
