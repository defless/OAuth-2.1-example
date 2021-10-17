import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';

import { privateAction } from '../controllers/privateService.js';

router.use((req, res, next) => {
  try {
    if (!req.headers.authorization) { throw 'missing headers'}
    const token = req.headers.authorization.split(" ")[1];
    if (!req.body.id) { throw 'missing user id'}
    if (jwt.verify(token, process.env.privateKey).id !== req.body.id) {
      throw 'unauthorized'
    };
    next();
  } catch (e) {
    res.status(404).json({ error: e })
  }

});

router.get('/', privateAction);

export default router;
