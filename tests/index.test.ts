import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';

import { server } from '../server.ts';
import User from '../src/core/models/user.ts';
import Client from '../src/core/models/client.ts';
import { get, post } from './utils/request.ts';
import { generateAccessToken } from '../src/core/utils.ts';

describe('api tests', () => {
  let mongoServer;
  const fastify = server({ logger: false, disableRequestLogging: true });

  beforeAll(async () => {
    await fastify.listen({ port: 3000 });
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: 'basic_auth-tests' });
  });

  describe('/helpers', () => {
    test('should return a code_challenge and a code_verifier for PKCE', async () => {
      const pkce = await get('/helpers/pkce');

      expect(pkce).toHaveProperty('code_challenge');
      expect(pkce).toHaveProperty('code_verifier');
    });
  });

  describe('/auth', () => {
    process.env.privateKey = 'test';

    describe('POST /auth/authenticate', () => {
      describe('with grant_type=password', () => {
        let user;
        beforeAll(async () => {
          user = await new User({
            email: 'test@test.fr',
            password: await bcrypt.hash('password', 10),
            refresh_token: 'test',
          }).save();
        });
        test('should return a 200 success response', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'password',
              password: 'password',
              email: 'test@test.fr'
            },
          });
          expect(response.access_token).toBeTruthy();
          expect(response.refresh_token).toBeTruthy();
          expect(response.expires_in).toBe(900);
          expect(response.token_type).toBe('Bearer');
        });
        test('should return a 401 unknow_user error', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'password',
              password: 'password',
              email: 'wrong@test.fr'
            },
          });
          
          expect(response.message).toBe('unknow_user');
        });
        test('should return a 400 invalid_grant error', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'password',
              password: 'wrong',
              email: 'test@test.fr'
            },
          });
          
          expect(response.message).toBe('invalid_grant');
        });
      });
      describe('with grant_type=refresh_token', () => {
        let user;
        beforeAll(async () => {
          user = await new User({
            email: 'test@test.fr',
            password: await bcrypt.hash('password', 10),
            refresh_token: 'refreshtoken',
          }).save();
        });
        test('should return a 200 success response', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'refresh_token',
              refresh_token: 'refreshtoken',
              id: user._id,
            },
          });

          expect(response.access_token).toBeTruthy();
          expect(response.refresh_token).toBeTruthy();
          expect(response.refresh_token).not.toBe('refreshtoken');
          expect(response.expires_in).toBe(900);
          expect(response.token_type).toBe('Bearer');
        });
        test('should return a 401 unknow_user error', async () => {
          const wrongUser = new User();
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'refresh_token',
              refresh_token: 'refreshtoken',
              id: wrongUser._id,
            },
          });

          expect(response.message).toBe('unknow_user');
        });
        test('should return a 400 invalid_grant error', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'refresh_token',
              refresh_token: 'wrong',
              id: user._id,
            },
          });

          expect(response.message).toBe('invalid_grant');
        });
      });

      describe('with grant_type=client_credentials', () => {
        let client;
        beforeAll(async () => {
          client = await new Client({
            name: 'test',
            clientId: 'clientId',
            clientSecret: 'clientSecret',
          }).save();
        });
        test('should return a 200 success response', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'client_credentials',
              client_secret: 'clientSecret',
              client_id: 'clientId',
            },
          });

          expect(response.access_token).toBeTruthy();
          expect(response.token_type).toBe('Bearer');
          expect(response.expires_in).toBe(900);
          expect(response?.refresh_token).toBeUndefined();
        });
        test('should return a 401 unknow_client error', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'client_credentials',
              client_secret: 'clientSecret',
              client_id: 'wrongClientId',
            },
          });

          expect(response.message).toBe('unknow_client');
        });
        test('should return a 400 invalid_grant error', async () => {
          const response = await post('/auth/authenticate', {
            body: {
              grant_type: 'client_credentials',
              client_secret: 'wrongClientSecret',
              client_id: 'clientId',
            },
          });

          expect(response.message).toBe('invalid_grant');
        });
      });

      test('should return a 400 invalid_grant_type error', async () => {
        const response = await post('/auth/authenticate', {
          body: { grant_type: 'invalid_grant_type' },
        });
        expect(response.message).toBe('invalid_grant_type');
      });
    });

    describe('POST /auth/register', () => {
      test('should return a 201 success response', async () => {});

      test('should return a 409 duplicate_user error', async () => {});

    });
  });

  describe('/ressources', () => {
    describe('GET /ressources/unrestricted', () => {
      test('should return a 200 status code', async () => {
        const response = await get('/ressources/unrestricted');
        expect(response.content).toBe('This is an unrestricted content 🎉');
      });
    });

    describe('GET /ressources/restricted', () => {
      let user;
      beforeAll(async () => {
        user = await new User({
          providerId: 'providerId',
          email: 'test@test.fr',
          password: 'password',
          refresh_token: 'test',
        }).save();
      });
      test('should return a 200 status code', async () => {
        process.env.privateKey = 'privateKey';
        const accessToken = generateAccessToken(user._id, user.email);
        const response = await get(
          '/ressources/restricted',
          { headers: { authorization: `Bearer ${accessToken}` } },
        );

        expect(response.content).toBe('This is a restricted content 🔒');
      });

      test('should return a 401 unauthorized error', async () => {
        const secondUser = new User({});
        const accessToken = generateAccessToken(secondUser._id, user.email);
        const response = await get(
          '/ressources/restricted',
          { headers: { authorization: `Bearer ${accessToken}` } },
        );
        expect(response.message).toBe('unauthorized_client');
      });

      test('should return a 400 missing_authorization_header error', async () => {
        const response = await get(
          '/ressources/restricted',
          { headers: {} },
        );
        expect(response.message).toBe('missing_authorization_header');
      });
    });

    test('', async () => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await fastify.close();
  });
});
