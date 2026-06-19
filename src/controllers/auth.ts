import Crypto from 'crypto';

import type { FastifyRequest, FastifyReply } from 'fastify';
import type { ObjectId } from 'mongoose';
import bcrypt from 'bcrypt';

import type {
  UserItem,
  ClientItem,
  SignupBody,
  AuthenticateBody,
  ThirdPartyProvider,
  ClientCredentialsBody,
} from '../core/types';
import {
  generateAccessToken,
  getThirdPartyToken,
  getThirdPartyUser,
} from '../core/utils';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
} from '../core/errors';
import Client from '../core/models/client';
import User from '../core/models/user';

const grantWithPassword = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email, password } = request.body as AuthenticateBody;

  if (!email || !password) {
    throw new BadRequestError('missing_fields');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError('unknow_user');
  }

  const matching = await bcrypt.compare(password, user.password);

  if (!matching) {
    throw new BadRequestError('invalid_grant');
  }

  const newRefreshToken = Crypto.randomBytes(64).toString('hex');
  user.refresh_token = newRefreshToken;
  await user.save();

  return reply.code(200).send({
    access_token: generateAccessToken(user._id, user.email),
    token_type: 'Bearer',
    expires_in: 900,
    refresh_token: user.refresh_token,
  });
};

const grantWithRefreshToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id, refresh_token } = request.body as AuthenticateBody;
  const user = await User.findById(id);

  if (!user) {
    throw new UnauthorizedError('unknow_user');
  }

  if (user.refresh_token !== refresh_token) {
    throw new BadRequestError('invalid_grant');
  }

  user.refresh_token = Crypto.randomBytes(64).toString('hex');
  await user.save();

  return reply.code(200).send({
    access_token: generateAccessToken(user._id, user.email),
    refresh_token: user.refresh_token,
    token_type: 'Bearer',
    expires_in: 900,
  });
};

const grantWithAuthCode = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { code, provider, code_verifier } = request.body as {
    code: string;
    provider: ThirdPartyProvider;
    code_verifier: string;
  };

  const { access_token } = await getThirdPartyToken(
    provider, code, code_verifier,
  );

  if (!access_token) {
    throw new UnauthorizedError('invalid_grant');
  }

  const userData = await getThirdPartyUser(provider, access_token);

  if (!userData.id) {
    throw new UnauthorizedError('invalid_grant');
  }

  let user = await User.findOne({ providerId: userData.id });

  if (!user) {
    user = await new User({
      providerId: userData.id,
      email: userData.email || '',
      refresh_token: Crypto.randomBytes(64).toString('hex'),
    }).save();
  }

  return reply.code(200).send({
    access_token: generateAccessToken(user._id, user.email),
    token_type: 'Bearer',
    expires_in: 900,
    refresh_token: user.refresh_token,
  });
};

const grantWithClientCredentials = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { client_secret, client_id } = request.body as ClientCredentialsBody;
  const client = await Client.findOne<ClientItem>({ clientId: client_id });

  if (!client) {
    throw new UnauthorizedError('unknow_client');
  }

  if (client.clientSecret !== client_secret) {
    throw new UnauthorizedError('invalid_grant');
  }

  return reply.code(200).send({
    access_token: generateAccessToken(
      client._id as ObjectId, client.name,
    ),
    token_type: 'Bearer',
    expires_in: 900,
  });
};

/**
 * Authenticates a user according to the specified grant type
 */
export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { grant_type } = request.body as AuthenticateBody;

  if (!grant_type) {
    throw new BadRequestError('missing_grant_type');
  }

  switch (grant_type) {
    case 'password':
      return grantWithPassword(request, reply);
    case 'refresh_token':
      return grantWithRefreshToken(request, reply);
    case 'authorization_code':
      return grantWithAuthCode(request, reply);
    case 'client_credentials':
      return grantWithClientCredentials(request, reply);
    default:
      throw new BadRequestError('invalid_grant_type');
  }
};

/**
 * Registers a new user with credentials
 */
export const credentialRegister = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email, password } = request.body as SignupBody;

  if (!email || !password) {
    throw new BadRequestError('missing_fields');
  }

  const existingUser = await User.findOne<UserItem>({ email });

  if (existingUser) {
    throw new ConflictError('duplicate_user');
  }

  const newUser = await new User<UserItem>({
    email,
    password: await bcrypt.hash(password, 10),
    refresh_token: Crypto.randomBytes(64).toString('hex'),
  }).save();

  return reply.code(201).send({
    access_token: generateAccessToken(newUser._id, newUser.email),
    token_type: 'Bearer',
    expires_in: 900,
    refresh_token: newUser.refresh_token,
  });
};
