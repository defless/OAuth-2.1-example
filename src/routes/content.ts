import type { FastifyInstance } from 'fastify';
import authMiddleware from '../core/middlewares/authMiddleware'

const content = async (fastify: FastifyInstance, opts: object) => {

  fastify.get('/unrestricted', (_request, reply) => {
    reply.code(200).send('This is an unrestricted content 🎉')
  });

  fastify.get(
    '/restricted',
    { preHandler: [authMiddleware] },
    (_request, reply) => {
      reply.code(200).send('This is a restricted content 🔒')
    }
  );
};

export default content;
