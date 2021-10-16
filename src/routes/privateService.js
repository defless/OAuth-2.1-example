import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';

import { privateAction } from '../controllers/privateService.js';

router.use(function (req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (jwt.verify(token, process.env.privateKey)) {
      next();
    } else {
      res.status(401);
    }
  } else {
    res.status(401);
  }
});

router.get('/', privateAction);

export default router;
