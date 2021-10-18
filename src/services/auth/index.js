import express from 'express';
const router = express.Router();

import {
  login,
  signup,
  generatePrivateKey,
  generateAccessToken,
} from './auth.js';

router.post('/login', login);
router.post('/signup', signup);
router.post('/generatePk', generatePrivateKey);
router.post('/generateAt', generateAccessToken);

export default router;
