import express from 'express';

import {
  authenticate,
  signup,
} from './auth';

const router = express.Router();

router.post('/authenticate', authenticate);
router.post('/signup', signup);

export default router;
