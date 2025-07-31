import { Router } from 'express';
import { OrderController } from './order.controller';
import { OrderUseCases } from '../../app/usecases';
import { OrderAdapters } from '../adapters';

const router = Router();
const orderAdapters = new OrderAdapters();
const orderUseCases = new OrderUseCases(orderAdapters);
const orderController = new OrderController(orderUseCases);


router.post('/', (req, res) => orderController.createOrder(req, res));
router.get('/', (req, res) => orderController.getAllOrders(req, res));
router.get('/:id', (req, res) => orderController.getOrderById(req, res));
router.get('/customer/:customerId', (req, res) => orderController.getOrdersByCustomerId(req, res));
router.put('/:id', (req, res) => orderController.updateOrder(req, res));
router.delete('/:id', (req, res) => orderController.deleteOrder(req, res));
router.patch('/:id/status', (req, res) => orderController.updateStatus(req, res));
router.delete('/:id', (req, res) => orderController.deleteOrder(req, res));
export default router; 