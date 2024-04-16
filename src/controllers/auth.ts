import type { FastifyRequest, FastifyReply } from 'fastify';
import Crypto from 'crypto';
import bcrypt from 'bcrypt';

import type {
  SignupBody,
  AuthenticateBody,
  ThirdPartyProvider,
  ClientCredentialsBody,
} from '../core/types';
import { generateAccessToken, getThirdPartyToken, getThirdPartyUser } from '../core/utils';

import Client from '../core/models/client';
import User from '../core/models/user';

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
        await grantWithRefreshToken(request, reply);
        break;

      case 'authorization_code':
        await grantWithAuthCode(request, reply);
        break;

      case 'client_credentials':
        await grantWithClientCredentials(request, reply);
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
      access_token: generateAccessToken(newUser._id, newUser.email),
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: newUser.refresh_token,
    });
  } catch (e) {
    reply.code(500).send({ message: 'internal_error' })
  }
};

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
    access_token: generateAccessToken(user._id, user.email),
    token_type: 'Bearer',
    expire_in: 900,
    refresh_token: user.refresh_token,
  });
};

const grantWithRefreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
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
    access_token: generateAccessToken(user._id, user.email),
    refresh_token: user.refresh_token,
    token_type: 'Bearer',
    expire_in: 900,
  });
};

const grantWithAuthCode = async (request: FastifyRequest, reply: FastifyReply) => {
  //retype
  const { code, provider, code_verifier } = request.body as { code: string, provider: ThirdPartyProvider, code_verifier: string };

  try {
    const { access_token } = await getThirdPartyToken(provider, code, code_verifier);
  
    if (!access_token) {
      reply.code(401).send({ message: 'invalid_grant' });
    }

    const userData = await getThirdPartyUser(provider, access_token);
    
    if (!userData.id) {
      reply.code(401).send({ message: 'invalid_grant' });
    }
  
    let user = await User.findOne({ providerId: userData.id });

    if (!user) {
      user = await new User({
        providerId: userData.id,
        email: userData.email || '',
        refresh_token: Crypto.randomBytes(64).toString('hex'),
      }).save();
    }

    reply.code(200).send({
      access_token: generateAccessToken(user._id, user.email),
      token_type: 'Bearer',
      expires_in: 900,
      refresh_token: user.refresh_token,
    });
  } catch (error) {
    reply.code(500).send({ message: 'internal_error' });
  }
};

const grantWithClientCredentials = async (request: FastifyRequest, reply: FastifyReply) => {
  const { client_secret, client_id } = request.body as ClientCredentialsBody;
  const client = await Client.findOne({ client_id });

  if (!client) {
    reply.code(401).send({ message: 'unknow_client' });
  }

  if (client.clientSecret !== client_secret) {
    reply.code(401).send({ message: 'invalid_grant' });
  }

  reply.code(200).send({
    access_token: generateAccessToken(client._id, client.email),
    token_type: 'Bearer',
    expires_in: 900,
  });
};