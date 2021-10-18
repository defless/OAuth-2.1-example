import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../../core/models/user.js';

import { privateAction } from './resources.js';
import { error } from '../../utils.js';

const router = express.Router();

router.use(async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw { code: 400, message: 'missing authorization header'}
    };
    const token = req.headers.authorization.split(" ")[1];
    const user = await User.findById(
      jwt.verify(token, process.env.privateKey).id
    );
    if (!user) {
      throw {code: 401, message: 'unauthorized'}
    };
    next();
  } catch (e) {
    error(res, e);
  }

});

router.get('/', privateAction);

export default router;
