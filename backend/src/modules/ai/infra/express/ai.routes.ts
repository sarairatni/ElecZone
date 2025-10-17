import { Router } from 'express';
import { AIController } from './ai.controller';
import { verifyToken } from '../../../user/infra/express/middlewares/auth.middleware';

const router = Router();

router.post('/chat', verifyToken, AIController.chat);

export default router;
