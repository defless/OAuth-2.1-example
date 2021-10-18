import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import User from '../../core/models/user.js';
import bcrypt from 'bcrypt';

import { error, check } from '../../utils.js';

export const login = async (req, res, next) => {
  try {
    check(req.body.name, 'missing_name');
    check(req.body.password, 'missing_password');
    const user = await User.where({ name: req.body.name }).findOne();
    check(user, 'unknown_user', 404);
    const result = await bcrypt.compare(req.body.password, user.password)
    check(result, 'wrong_password', 500);
    res.status(200).json({
      accesToken: jwt.sign(
        { id: user._id, name: user.name },
        process.env.privateKey,
        { expiresIn: '900s' }
      ),
      refreshToken: user.refreshToken,
    });
  } catch (e) {
    error(res, e);
  }
};

export const signup = async (req, res, next) => {
  try {
    check(req.body.name, 'missing_name');
    check(req.body.password, 'missing_password');
    const user = await User.where({ name: req.body.name }).findOne();
    check(!user, 'duplicated_user', 500);
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

export const generatePrivateKey = (req, res, next) => {
  const privateKey = Crypto.randomBytes(64).toString('hex');
  process.env['privateKey'] = privateKey;
  res.status(200).json({privateKey});
};

export const generateAccessToken = async (req, res, next) => {
  try {
    check(req.body.id, 'missing_user_id');
    check(req.body.refreshToken, 'missing_refreshToken');
    const user = await User.where({ _id: req.body.id }).findOne();
    if (user.refreshToken !== req.body.refreshToken) {
      throw {code: 500, message:'unknown_refresh_token'}
    }
    res.status(200).json({
      accessToken: jwt.sign(
        { id: user._id, name: user.name },
        process.env.privateKey,
        { expiresIn: '120s' }
      ),
    });
  } catch (e) {
    error(res, e);
  }
};