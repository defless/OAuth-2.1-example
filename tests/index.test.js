import mongoose from 'mongoose';
import { server } from '../server.ts';

import { get } from './utils/request.ts';

describe('api tests', () => {
  const fastify = server({ logger: false, disableRequestLogging: true });

  beforeAll(async () => {
    await fastify.listen({ port: 3000 });
  });

  describe('/helpers', () => {
    test('should return a code_challenge and a code_verifier for PKCE', async () => {
      const pkce = await get({ url: '/helpers/pkce' });

      expect(pkce).toHaveProperty('code_challenge');
      expect(pkce).toHaveProperty('code_verifier');
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await fastify.close();
  });
});
