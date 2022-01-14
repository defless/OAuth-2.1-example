import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import User from '../../core/models/user.js';
import bcrypt from 'bcrypt';

import { error, check } from '../../utils.js';

export const authenticate = async (req, res, next) => {
  let user;
  try {
    check(req.body.grant_type, 'invalid_request');
    if (req.body.grant_type === 'password') {
      user = await User.findOne({ name: req.body.name });
      check(user, 'unknown_user', 404);
      const result = await bcrypt.compare(req.body.password, user.password)
      check(result, 'invalid_grant', 400);
    } else { // req.body.grant_type === 'refresh_token'
      check(req.body.id, 'invalid_request');
      check(req.body.refreshToken, 'invalid_request');
      user = await User.findById(req.body.id);
      if (user.refreshToken !== req.body.refreshToken) { //then should check it's still valid
        throw {code: 500, message:'invalid_grant'} 
      }
    }  
    res.status(200).json({
      access_token: jwt.sign(
        { id: user._id, name: user.name },
        process.env.privateKey || 'privateKey',
        { expiresIn: '900s' }
      ),
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: user.refreshToken, // should generater new refresh token each time
    });
  } catch (e) {
    error(res, e);
  }
};

export const signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    check(!user, 'duplicated_user', 500);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const request = new User({
      name: req.body.name,
      password: hashedPassword,
      refreshToken: Crypto.randomBytes(64).toString('hex'),
    });
    request.save().then(() => res.status(201).json({
      message: 'successfully_created',
    }));
  } catch (e) {
    error(res, e);
  }
};