import bcrypt from 'bcrypt';
import {jest} from '@jest/globals';
import mongoose from 'mongoose';

import User from '../../src/core/models/user';
import Server from '../../src/core/Server.js';
import authRoutes from '../../src/services/auth/index.js';

import { post } from '../utils/request.js';

describe('/auth', () => {
  let server;

  beforeAll(async () => {
    mongoose.connect(
      'mongodb://localhost:27017/basicAuth',
      { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('[Basic-Auth-database] Successfully connected mongo'.green))
      .catch(() => console.log('[Basic-Auth-database] Failed to connect mongo'.red));
    const app = await Server(
      { name: 'auth', port: 4000, routes: authRoutes},
      '/api-test',
    );
    server = await app.start();
  });

  describe('POST /auth/login', () => {
    test('should successfully login', async () => {
      let res;

      const encrypted_password = await bcrypt.hash('password', 10);
        const user = await new User({
          name: 'user',
          password: encrypted_password,
        }).save();

      res = await post(server, {
        url: '/api-test/auth/login',
        body: {
          name: 'user',
          password: 'password'
        },
      });

      console.log(res);
      expect(res).toBeDefined();
      //expect(res.account.password).toBeUndefined();
    });

  });

  afterAll(() => {
    server.close();
  });
});
