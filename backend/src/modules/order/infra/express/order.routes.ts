import { Router } from 'express';
import { OrderController } from './order.controller';
import { OrderUseCases } from '../../app/usecases';
import { OrderAdapters } from '../adapters';

const router = Router();
const orderAdapters = new OrderAdapters();
const orderUseCases = new OrderUseCases(orderAdapters);
const orderController = new OrderController(orderUseCases);

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

export default router; 