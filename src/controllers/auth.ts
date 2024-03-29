import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import bcrypt from 'bcrypt';

import type { SignupBody, AuthenticateBody } from '../core/types';
import { getGithubToken, getGithubUser } from '../core/helpers';

import User from '../core/models/user.js';

/*
  Authenticates a user according to the spcecified grant type
*/
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
        await grantWithAuthCode(request, reply);
        break;

      default:
        reply.code(400).send({ message: 'invalid_grant_type' });
        break;
    }
  } catch (e) {
    reply.status(500).send({ message: 'internal_server_error' });
  }
};

export const credentialRegister = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { email, password } = request.body as SignupBody;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      reply.code(409).send({ message: 'duplicate_user' })
    }

    const newUser = await new User({
      email,
      password: await bcrypt.hash(password, 10),
      refresh_token: Crypto.randomBytes(64).toString('hex'),
    }).save();

    reply.code(201).send({
      access_token: jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.privateKey || 'privateKey',
        { expiresIn: '900s' },
      ),
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: newUser.refresh_token,
    });
  } catch (e) {
    reply.code(500).send({ message: 'internal_error' })
  }
};

export const thirdPartyRegister = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { code } = request.body as SignupBody;
  try {
    const { access_token } = await getGithubToken(code);

    if (!access_token) {
      reply.code(401).send({ message:'invalid_grant' });
    }
    const githubData = await getGithubUser(access_token); 
  
    const existingUser = await User.findOne({ githubId: githubData.id });

    if (existingUser) {
      reply.code(409).send({ message: 'duplicate_user' })
    }

    const newUser = await new User({
      githubId: githubData.id,
      email: githubData.email || '',
      refresh_token: Crypto.randomBytes(64).toString('hex'),
    }).save();

    reply.code(201).send({
      access_token: jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.privateKey || 'privateKey',
        { expiresIn: '900s' },
      ),
      token_type: 'Bearer',
      expires_in: 900,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: 'internal_error' });
  }
}

const grantWithPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as AuthenticateBody;
  const user = await User.findOne({ email });
  if (!user) {
    reply.code(401).send({ message: 'unknow_user' });
  }
  const matching = await bcrypt.compare(password, user.password);
  if (!matching) {
    reply.code(400).send({ message:'invalid_grant' });
  }
  const newRefreshToken = Crypto.randomBytes(64).toString('hex');
  user.refresh_token = newRefreshToken;
  await user.save();

  reply.code(200).send({
    access_token: jwt.sign(
      { id: user._id, email: user.email },
      process.env.privateKey || 'privateKey',
      { expireIn: '900s' },
    ),
    token_type: 'Bearer',
    expire_in: 900,
    refresh_token: user.refresh_token,
  });
};

const grantWithRefresh = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id, refresh_token } = request.body as AuthenticateBody;
  const user = await User.findById(id);

  if (!user) {
    reply.code(401).send({ message: 'unknow_user' });
  }

  if (user.refresh_token !== refresh_token) {
    reply.code(400).send({ message:'invalid_grant' });
  }
  user.refresh_token = Crypto.randomBytes(64).toString('hex');
  await user.save();
  reply.code(200).send({
    access_token: jwt.sign(
      { id: user._id, email: user.email },
      process.env.privateKey || 'privateKey',
      { expireIn: '900s' },
    ),
    refresh_token: user.refresh_token,
    token_type: 'Bearer',
    expire_in: 900,
  });
};

const grantWithAuthCode = async (request: FastifyRequest, reply: FastifyReply) => {
  const { code } = request.body as { code: string};

  try {
    const { access_token } = await getGithubToken(code);
  
    if (!access_token) {
      reply.code(401).send({ message: 'invalid_grant' });
    }

    const githubData = await getGithubUser(access_token);
    const user = await User.findOne({ githubId: githubData.id });

    if (!user) {
      reply.code(401).send({ message: 'unknow_user' });
    }

    reply.code(200).send({
      access_token: jwt.sign(
        { id: user._id, email: user.email },
        process.env.privateKey || 'privateKey',
        { expireIn: '900s' },
      ),
      token_type: 'Bearer',
      expire_in: 900,
      refresh_token: user.refresh_token,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: 'internal_error' });
  }
};