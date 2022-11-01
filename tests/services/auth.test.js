import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import User from '../../src/core/models/user';
import Server from '../../src/core/server';
import authRoutes from '../../src/services/auth/index';

import { post } from '../utils/request';

describe('/auth', () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(
      'mongodb://localhost:27017/basicAuthTest',
      { useNewUrlParser: true, useUnifiedTopology: true },
    )
      .then(() => console.log('[Basic-Auth-test-database] Successfully connected mongo'.green))
      .catch(() => console.log('[Basic-Auth-test-database] Failed to connect mongo'.red));
    const app = await Server(
      { name: 'auth', port: 4000, routes: authRoutes },
      '/api-test',
    );
    server = await app.start();
  });

  describe('POST /auth/signup', () => {
    test('should successfully signUp', async () => {
      const req = await post(server, {
        url: '/api-test/auth/signup',
        body: {
          name: 'user',
          password: 'password',
        },
      });
      const res = await req.json();
      expect(res.message).toBe('successfully_created');
    });

    test('should throw a 500 for duplicated user', async () => {
      await new User({
        name: 'user',
        password: 'password',
        refreshToken: 'refreshTest',
      }).save();

      const req = await post(server, {
        url: '/api-test/auth/signup',
        body: {
          name: 'user',
          password: 'password',
        },
      });
      const res = await req.json();

      expect(req.status).toBe(500);
      expect(res.error).toBe('duplicated_user');
    });
  });

  describe('POST /auth/authenticate', () => {
    test('should successfully login', async () => {
      const encryptedPassword = await bcrypt.hash('password', 10);
      await new User({
        name: 'test',
        password: encryptedPassword,
        refreshToken: 'refreshTest',
      }).save();

      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          name: 'test',
          password: 'password',
          grant_type: 'password',
        },
      });

      const res = await req.json();

      expect(res.refresh_token).not.toBe('refreshTest');
      expect(req.status).toBe(200);
    });

    test('should throw a 404 for unknown user', async () => {
      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          name: 'no_user',
          password: 'password',
          grant_type: 'password',
        },
      });
      const res = await req.json();

      expect(req.status).toBe(404);
      expect(res.error).toBe('unknown_user');
    });

    test('should throw a 400 for wrong password', async () => {
      const encryptedPassword = await bcrypt.hash('password', 10);
      await new User({
        name: 'user',
        password: encryptedPassword,
        refreshToken: 'refreshTest',
      }).save();

      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          name: 'user',
          password: 'test',
          grant_type: 'password',
        },
      });
      const res = await req.json();

      expect(req.status).toBe(400);
      expect(res.error).toBe('invalid_grant');
    });

    test('should generate new accessToken', async () => {
      const user = await new User({
        name: 'user',
        password: 'password',
        refresh_token: 'refreshTest',
      }).save();

      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          id: user._id,
          refresh_token: 'refreshTest',
          grant_type: 'refresh_token',
        },
      });

      expect(req.status).toBe(200);
    });

    test('should throw a 400 if user id is missing', async () => {
      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          refreshToken: 'refreshTest',
          grant_type: 'refresh_token',
        },
      });
      const res = await req.json();

      expect(req.status).toBe(400);
      expect(res.error).toBe('invalid_request');
    });

    test('should throw a 400 if refreshToken is missing', async () => {
      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          id: 'id',
          grant_type: 'refresh_token',
        },
      });
      const res = await req.json();

      expect(req.status).toBe(400);
      expect(res.error).toBe('invalid_request');
    });

    test('should throw a 400 if the refreshToken is wrong', async () => {
      const user = await new User({
        name: 'user',
        password: 'password',
        refresh_token: 'refreshTest',
      }).save();

      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          id: user._id,
          refresh_token: 'test',
          grant_type: 'refresh_token',
        },
      });
      const res = await req.json();

      expect(req.status).toBe(400);
      expect(res.error).toBe('invalid_grant');
    });
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });
});
