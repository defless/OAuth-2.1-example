import {
  describe, it, expect, beforeAll, afterAll,
} from 'bun:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';

import { server } from '../server.ts';
import User from '../src/core/models/user.ts';
import Client from '../src/core/models/client.ts';
import { get, post, setBaseUrl } from './utils/request.ts';
import { generateAccessToken } from '../src/core/utils.ts';
import {
  UserItem,
} from '../src/core/types.ts';

describe('api tests', () => {
  let mongoServer: MongoMemoryServer;
  const fastify = server({ logger: false, disableRequestLogging: true });

  beforeAll(async () => {
    await fastify.listen({ port: 0 });
    const address = fastify.server.address();
    const port = typeof address === 'string'
      ? 3000
      : address?.port || 3000;
    setBaseUrl(`http://localhost:${port}`);

    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(
      mongoServer.getUri(),
      { dbName: 'basic_auth-tests' },
    );
  });

  describe('/helpers', () => {
    it(
      'should return a code_challenge and a code_verifier for PKCE',
      async () => {
        const pkce = await get('/helpers/pkce');

        expect(pkce).toHaveProperty('code_challenge');
        expect(pkce).toHaveProperty('code_verifier');
      },
    );
  });

  describe('/auth', () => {
    beforeAll(() => {
      process.env.PRIVATE_KEY = 'test';
    });

    describe('POST /auth/authenticate', () => {
      describe('with grant_type=password', () => {
        beforeAll(async () => {
          await new User({
            email: 'test@test.fr',
            password: await bcrypt.hash('password', 10),
            refresh_token: 'test',
          }).save();
        });

        it('should return a 200 success response', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'password',
              password: 'password',
              email: 'test@test.fr',
            },
          });
          expect(response.access_token).toBeDefined();
          expect(response.refresh_token).toBeDefined();
          expect(response.expires_in).toBe(900);
          expect(response.token_type).toBe('Bearer');
        });

        it('should return a 401 unknow_user error', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'password',
              password: 'password',
              email: 'wrong@test.fr',
            },
          });

          expect(response.message).toBe('unknow_user');
        });

        it('should return a 400 invalid_grant error', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'password',
              password: 'wrong',
              email: 'test@test.fr',
            },
          });

          expect(response.message).toBe('invalid_grant');
        });
      });

      describe('with grant_type=refresh_token', () => {
        let user: UserItem;
        beforeAll(async () => {
          user = await new User({
            email: 'test2@test.fr',
            password: await bcrypt.hash('password', 10),
            refresh_token: 'refreshtoken',
          }).save();
        });

        it('should return a 200 success response', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'refresh_token',
              refresh_token: 'refreshtoken',
              id: user._id,
            },
          });

          expect(response.access_token).toBeDefined();
          expect(response.refresh_token).toBeDefined();
          expect(response.refresh_token).not.toBe('refreshtoken');
          expect(response.expires_in).toBe(900);
          expect(response.token_type).toBe('Bearer');
        });
      });

      describe('with grant_type=client_credentials', () => {
        beforeAll(async () => {
          await new Client({
            name: 'test',
            clientId: 'clientId',
            clientSecret: 'clientSecret',
          }).save();
        });

        it('should return a 200 success response', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'client_credentials',
              client_secret: 'clientSecret',
              client_id: 'clientId',
            },
          });

          expect(response.access_token).toBeDefined();
          expect(response.token_type).toBe('Bearer');
          expect(response.expires_in).toBe(900);
          expect(response?.refresh_token).toBeUndefined();
        });
      });
    });
  });

  describe('/resources', () => {
    describe('GET /resources/unrestricted', () => {
      it('should return a 200 status code', async () => {
        const response = await get('/resources/unrestricted');
        expect(response.content).toBe('This is an unrestricted content 🎉');
      });
    });

    describe('GET /resources/restricted', () => {
      let user: UserItem;
      beforeAll(async () => {
        user = await new User({
          providerId: 'providerId',
          email: 'test3@test.fr',
          password: 'password',
          refresh_token: 'test',
        }).save();
      });

      it('should return a 200 status code', async () => {
        process.env.PRIVATE_KEY = 'privateKey';
        const accessToken = generateAccessToken(user._id as any, user.email);
        const response = await get(
          '/resources/restricted',
          { headers: { authorization: `Bearer ${accessToken}` } },
        );

        expect(response.content).toBe('This is a restricted content 🔒');
      });
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await fastify.close();
  });
});
