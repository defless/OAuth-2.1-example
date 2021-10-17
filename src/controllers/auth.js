import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import User from '../models/user.js';
import bcrypt from 'bcrypt';

import { error, check } from '../utils.js';

export const login = async (req, res, next) => {
  try {
    check(req.body.name, 'name');
    check(req.body.password, 'password');
    const user = await User.where({ name: req.body.name }).findOne();
    if (!user) {
      throw { code: 404, message:'unknown_user' }
    }
    const result = await bcrypt.compare(req.body.password, user.password)
    if (result) {
      res.status(200).json({
        accesToken: jwt.sign(
          { id: user._id, name: user.name },
          process.env.privateKey,
          { expiresIn: '900s' }
        ),
        refreshToken: user.refreshToken,
      });
    } else {
      throw { code: 500, message:'wrong_password' }
    }
  } catch (e) {
    error(res, e);
  }
};

export const signup = async (req, res, next) => {
  try {
    check(req.body.name, 'name');
    check(req.body.password, 'password');
    const user = await User.where({ name: req.body.name }).findOne();
    if (user) {
      throw {code: 500, message:'duplicated_user'}
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const request = new User({
      name: req.body.name,
      password: hash,
      refreshToken: Crypto.randomBytes(64).toString('hex'),
    });
    request.save().then(() => res.status(201).json({
      message: 'Successfully_created',
    }));
  } catch (e) {
    error(res, e);
  }
};

export const generateKey = (req, res, next) => {
  const privateKey = Crypto.randomBytes(64).toString('hex');
  res.status(200).json({
    privateKey,
  });
};

export const generateAccessToken = async (req, res, next) => {
  try {
    check(req.body.id, 'user_id');
    check(req.body.refreshToken, 'refreshToken');
    const user = await User.where({ _id: req.body.id }).findOne();
    if (user.refreshToken === req.body.refreshToken) {
      res.status(200).json({
        accessToken: jwt.sign(
          { id: user._id, name: user.name },
          process.env.privateKey,
          { expiresIn: '900s' }
        ),
      });
    }
  } catch (e) {
    error(res, e);
  }
};
