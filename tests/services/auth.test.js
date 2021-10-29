import Server from '../../src/core/Server.js';
import authRoutes from '../../src/services/auth/index.js';

import { post } from '../utils/request.js';

describe('/auth', () => {
  let server;
  beforeAll(async () => {
    const app = await Server(
      { name: 'auth', port: 4000, routes: authRoutes},
      '/api-test',
    );
    server = await app.start();
  });

  describe('POST /auth/login', () => {
    test('should successfully login', async () => {
      const res = await post(server, {
        url: '/api-test/auth/login',
        body: {
          name: 'test',
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
