import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import Crypto from 'crypto';
import bcrypt from 'bcrypt';

import type { SignupBody, AuthenticateBody } from '../core/types';

import User from '../core/models/user.js';

const getGithubToken = async (code: string) => {
  const tokenRequest = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GithubPublic,
      client_secret: process.env.GithubSecret,
      code,
    }),
  });

  return await tokenRequest.json();
};

const grantWithPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as AuthenticateBody;
  const user = await User.findOne({ email });
  if (!user) {
    reply.code(401).send({ message: 'unknow_user' });
  }
  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    reply.code(400).send({ message:'invalid_grant' });
  }
  const newRefreshToken = Crypto.randomBytes(64).toString('hex');
  user.refresh_token = newRefreshToken;
  user.save();
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

export const grantWithAuthCode = async (request: FastifyRequest, reply: FastifyReply) => {
  const { code } = request.body as { code: string};

  try {
    const { access_token } = await getGithubToken(code);
    if (!access_token) {
      reply.code(401).send({ message: 'invalid_grant' });
    }
    const userRequest = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });
    const user = await User.findOne({ githubId: (await userRequest.json()).id });

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
    throw new Error(e);
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
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      refresh_token: Crypto.randomBytes(64).toString('hex'),
    });
    await newUser.save();
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
    const userRequest = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const githubUser = await userRequest.json();
  
    const user = await User.findOne({ githubId: githubUser.id });

    if (user) {
      reply.code(409).send({ message: 'duplicate_user' })
    }

    const newUser = new User({
      githubId: githubUser.id,
      email: githubUser.email,
      refresh_token: Crypto.randomBytes(64).toString('hex'),
    });

    await newUser.save();


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