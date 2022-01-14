import bcrypt from 'bcrypt';
import {jest} from '@jest/globals';
import mongoose from 'mongoose';

import User from '../../src/core/models/user';
import Server from '../../src/core/Server.js';
import authRoutes from '../../src/services/auth/index.js';

import { post } from '../utils/request.js';
import { TestWatcher } from '@jest/core';

describe('/auth', () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(
      'mongodb://localhost:27017/basicAuthTest',
      { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('[Basic-Auth-test-database] Successfully connected mongo'.green))
      .catch(() => console.log('[Basic-Auth-test-database] Failed to connect mongo'.red));
    const app = await Server(
      { name: 'auth', port: 4000, routes: authRoutes},
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
          password: 'password'
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
          password: 'password'
        },
      });
      const res = await req.json();

      expect(req.status).toBe(500);
      expect(res.error).toBe('duplicated_user');
    });
  });

  describe('POST /auth/authenticate', () => {
    test('should successfully login', async () => {
      const encrypted_password = await bcrypt.hash('password', 10);
        await new User({
          name: 'test',
          password: encrypted_password,
          refreshToken: 'refreshTest',
        }).save();

      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          name: 'test',
          password: 'password',
          grant_type: 'password'
        },
      });

      const res = await req.json();
      expect(res.refresh_token).toBe('refreshTest');
    });

    test('should throw a 404 for unknown user', async () => {
      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          name: 'user',
          password: 'password',
          grant_type: 'password'
        },
      });
      const res = await req.json();
      
      expect(req.status).toBe(404);
      expect(res.error).toBe('unknown_user');
    });

    test('should throw a 400 for wrong password', async () => {
      const encrypted_password = await bcrypt.hash('password', 10);
      await new User({
        name: 'user',
        password: encrypted_password,
        refreshToken: 'refreshTest',
      }).save();


      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          name: 'user',
          password: 'test',
          grant_type: 'password'
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
        refreshToken: 'refreshTest',
      }).save();
  
      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          id: user._id,
          refreshToken: 'refreshTest',
          grant_type: 'refresh_token'
        },
      });

      expect(req.status).toBe(200);
      //add check to jwt
    });

    test('should throw a 400 if user id is missing', async () => {
  
      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          refreshToken: 'refreshTest',
          grant_type: 'refresh_token'
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
          grant_type: 'refresh_token'
        },
      });
      const res = await req.json();

      expect(req.status).toBe(400);
      expect(res.error).toBe('invalid_request');
    });

    test('should throw a 500 if the refreshToken is wrong', async () => {
      const user = await new User({
        name: 'user',
        password: 'password',
        refreshToken: 'refreshTest',
      }).save();
  
      const req = await post(server, {
        url: '/api-test/auth/authenticate',
        body: {
          id: user._id,
          refreshToken: 'test',
          grant_type: 'refresh_token'
        },
      });
      const res = await req.json();

      expect(req.status).toBe(500);
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
