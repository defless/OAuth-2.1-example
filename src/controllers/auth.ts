import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import bcrypt from 'bcrypt';

import type { SignupBody, AuthenticateBody } from '../core/types';

import User from '../core/models/user.js';

const grantWithPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  const { username, password } = request.body as AuthenticateBody;
  const user = await User.findOne({ username });
  if (!user) {
    reply.code(401).send('unknow_user');
  }
  const replyult = await bcrypt.compare(password, user.password);
  if (!replyult) {
    reply.code(400).send('invalid_grant');
  }
  const newRefreplyhToken = Crypto.randomBytes(64).toString('hex');
  user.refresh_token = newRefreplyhToken;
  user.save();
  reply.code(200).send({
    access_token: jwt.sign(
      { id: user._id, username: user.username },
      process.env.privateKey || 'privateKey',
      { expireplyIn: '900s' },
    ),
    token_type: 'Bearer',
    expireply_in: 900,
    refreplyh_token: user.refresh_token,
  });
};

const grantWithRefresh = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id, refresh_token } = request.body as AuthenticateBody;
  const user = await User.findById(id);
  if (user.refresh_token !== refresh_token) {
    reply.code(400).send('invalid_grant');
  }
  user.refresh_token = Crypto.randomBytes(64).toString('hex');
  await user.save();
  reply.code(200).send({
    access_token: jwt.sign(
      { id: user._id, username: user.username },
      process.env.privateKey || 'privateKey',
      { expireplyIn: '900s' },
    ),
    refresh_token: user.refresh_token,
    token_type: 'Bearer',
    expireply_in: 900,
  });
};

const grantWithOneTimeCode = async (request: FastifyRequest, reply: FastifyReply) => {
  const { authorization_code } = request.body as AuthenticateBody;
  const user = await User.findOne({ authorization_code });
  if (!user) {
    reply.code(400).send('invalid_grant');
  }
  reply.code(200).send({
    access_token: jwt.sign(
      { id: user._id, username: user.username },
      process.env.privateKey || 'privateKey',
      { expireplyIn: '900s' },
    ),
    token_type: 'Bearer',
    expireply_in: 900,
  });
};

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const { grant_type } = request.body as AuthenticateBody;
  try {
    switch (grant_type) {
      case 'password':
        await grantWithPassword(request, reply);
        break;

      case 'refresh_token':
        await grantWithRefresh(request, reply);
        break;

      case 'authorization_code':
        await grantWithOneTimeCode(request, reply);
        break;

      default:
        throw new Error('invalid_grant_type');
    }
  } catch (e) {
    throw new Error(e);
  }
};

export const signup = async (request: FastifyRequest, reply: FastifyReply) => {
  const { username, password } = request.body as SignupBody;
  try {
    const user = await User.findOne({ username });
    if (user) {
      throw new Error('existing_user')
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const requestuest = new User({
      username,
      password: hashedPassword,
      refreplyh_token: Crypto.randomBytes(64).toString('hex'),
    });
    await requestuest.save();
    reply.code(201).send({ message: 'User created' })
  } catch (e) {
    throw new Error('internal_error')
  }
};
