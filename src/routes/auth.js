import express from 'express';
const router = express.Router();

import {login, signup, generatePrivateKey} from '../controllers/auth.js';

router.post('/login', login);
router.post('/signup', signup);
router.post('/generatePk', generatePrivateKey);


export default router;
