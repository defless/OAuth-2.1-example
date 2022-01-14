import express from 'express';
const router = express.Router();

import {
  authenticate,
  signup,
} from './auth.js';

router.post('/authenticate', authenticate);
router.post('/signup', signup);

export default router;
