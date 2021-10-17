import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';

import { privateAction } from '../controllers/privateService.js';
import { error } from '../utils.js';

router.use((req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw { code: 400, message: 'missing authorization header'}
    };
    const token = req.headers.authorization.split(" ")[1];
    if (!req.body.id) { throw 'missing user id'}
    if (jwt.verify(token, process.env.privateKey).id !== req.body.id) {
      throw {code: 401, message: 'unauthorized'}
    };
    next();
  } catch (e) {
    error(res, e);
  }

});

router.get('/', privateAction);

export default router;
