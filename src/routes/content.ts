import type { FastifyInstance } from 'fastify';

const content = async (fastify: FastifyInstance, opts: object) => {
  fastify.get('/restricted', async (_request, _reply) => {
    return JSON.stringify({ message: 'This is a restricted content' });
  });
};

export default content;
