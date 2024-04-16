import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server';

import { server } from '../server.ts';
import User from '../src/core/models/user.ts';
import { get } from './utils/request.ts';
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
    describe('POST /auth/authenticate', () => {});

    describe('POST /auth/register', () => {
      test('should return a 201 success response', async () => {});

      test('should return a 409 duplicate_user error', async () => {});

      test('should return a 409 duplicate_user error', async () => {});
    });
  });

  describe('/content', () => {
    describe('GET /content/unrestricted', () => {
      test('should return a 200 status code', async () => {
        const response = await get('/content/unrestricted');
        expect(response.content).toBe('This is an unrestricted content 🎉');
      });
    });

    describe('GET /content/restricted', () => {
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
          '/content/restricted',
          { headers: { authorization: `Bearer ${accessToken}` } },
        );
        console.log(response);
        expect(response.content).toBe('This is a restricted content 🔒');
      });

      test('should return a 401 unauthorized error', async () => {
        const secondUser = new User({});
        const accessToken = generateAccessToken(secondUser._id, user.email);
        const response = await get(
          '/content/restricted',
          { headers: { authorization: `Bearer ${accessToken}` } },
        );
        expect(response.message).toBe('unauthorized_client');
      });

      test('should return a 400 missing_authorization_header error', async () => {
        const response = await get(
          '/content/restricted',
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
