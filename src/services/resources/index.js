import express from 'express';

import { privateAction } from './resources.js';
import { error, check } from '../../utils.js';
import { authMiddleware } from '../../core/middlewares/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', privateAction);

export default router;
