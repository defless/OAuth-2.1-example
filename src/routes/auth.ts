import type { FastifyInstance } from 'fastify';

import { signup } from '../controllers/auth';


const auth = async (fastify: FastifyInstance, opts: object) => {
  fastify.addSchema({
    $id: 'user',
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' }
    }
  })

  //fastify.post('/auth/authenticate', async (_request, _reply) => authenticate(_request, _reply));
  fastify.post('/auth/signup', async (_request, _reply) => signup(_request, _reply));
};

export default auth;
