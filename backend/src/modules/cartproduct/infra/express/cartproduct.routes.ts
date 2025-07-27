import { Router } from 'express';
import { CartProductController } from './cartproduct.controller';
import { CartProductUseCases } from '../../app/usecases';
import { CartProductPrismaAdapter } from '../adapters';

const router = Router();
const adapter = new CartProductPrismaAdapter();
const usecases = new CartProductUseCases(adapter);
const controller = new CartProductController(usecases);

router.post('/', (req, res) => controller.create(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.get('/customer/:customerId', (req, res) => controller.getByCustomerId(req, res));
router.put('/:id/quantity', (req, res) => controller.updateQuantity(req, res));

export default router; 