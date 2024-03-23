import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import bcrypt from 'bcrypt';

import type { SignupBody, AuthenticateBody } from '../core/types';

import User from '../core/models/user.js';

import { error, check } from '../utils.js';

const grantWithPassword = async (req: FastifyRequest, res: FastifyReply) => {
  const { username, password } = req.body as AuthenticateBody;
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('unknow_user')
  }
  const result = await bcrypt.compare(password, user.password);
  check(result, 'invalid_grant', 400);
  const newRefreshToken = Crypto.randomBytes(64).toString('hex');
  user.refresh_token = newRefreshToken;
  user.save();
  res.code(200).send({
    access_token: jwt.sign(
      { id: user._id, username: user.username },
      process.env.privateKey || 'privateKey',
      { expiresIn: '900s' },
    ),
    token_type: 'Bearer',
    expires_in: 900,
    refresh_token: user.refresh_token,
  });
};

const grantWithRefresh = async (req: FastifyRequest, res: FastifyReply) => {
  const { id, refresh_token } = req.body as AuthenticateBody;
  const user = await User.findById(id);
  if (user.refresh_token !== refresh_token) {
    throw new Error('invalid_grant');
  }
  res.code(200).send({
    access_token: jwt.sign(
      { id: user._id, username: user.username },
      process.env.privateKey || 'privateKey',
      { expiresIn: '900s' },
    ),
    token_type: 'Bearer',
    expires_in: 900,
  });
};

const grantWithOneTimeCode = async (req: FastifyRequest, res: FastifyReply) => {
  const { authorization_code } = req.body as AuthenticateBody;
  const user = await User.findOne({ authorization_code });
  if (!user) {
    throw new Error('invalid_grant')
  }
  res.code(200).send({
    access_token: jwt.sign(
      { id: user._id, username: user.username },
      process.env.privateKey || 'privateKey',
      { expiresIn: '900s' },
    ),
    token_type: 'Bearer',
    expires_in: 900,
  });
};

export const authenticate = async (req: FastifyRequest, res: FastifyReply) => {
  const { grant_type } = req.body as AuthenticateBody;
  try {
    switch (grant_type) {
      case 'password':
        await grantWithPassword(req, res);
        break;

      case 'refresh_token':
        await grantWithRefresh(req, res);
        break;

      case 'authorization_code':
        await grantWithOneTimeCode(req, res);
        break;

      default:
        throw new Error('invalid_grant_type');
    }
  } catch (e) {
    error(res, e);
  }
};

export const signup = async (req: FastifyRequest, res: FastifyReply) => {
  const { username, password } = req.body as SignupBody;
  try {
    const user = await User.findOne({ username });
    if (user) {
      throw new Error('existing_user')
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const request = new User({
      username,
      password: hashedPassword,
      refresh_token: Crypto.randomBytes(64).toString('hex'),
    });
    await request.save();
    res.code(201).send({ message: 'User created' })
  } catch (e) {
    throw new Error('internal_error')
  }
};
