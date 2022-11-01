import express from 'express';
import { privateAction } from './resources';
import authMiddleware from '../../core/middlewares/authMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/', privateAction);

export default router;
