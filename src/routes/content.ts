import type { FastifyInstance } from 'fastify';
import authMiddleware from '../core/middlewares/authMiddleware'

const content = async (fastify: FastifyInstance, opts: object) => {

  fastify.get('/unrestricted', (_request, _reply) => {
    return JSON.stringify({ message: 'This is an unrestricted content 🎉' });
  });

  fastify.get('/restricted', { preHandler: [authMiddleware] }, (_request, _reply) => {
    return JSON.stringify({ message: 'This is a restricted content 🔒' });
  });
};

export default content;
