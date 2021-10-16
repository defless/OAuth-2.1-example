import express from 'express';
const router = express.Router();

import {login, signup, generateKey} from '../controllers/auth.js';

router.post('/login', login);
router.post('/signup', signup);
router.post('/generate', generateKey);


export default router;
