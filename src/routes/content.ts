import type { FastifyInstance } from 'fastify';
import authMiddleware from '../core/middlewares/authMiddleware'
import {
  getRestrictedContent,
  getUnrestrictedContent,
} from '../controllers/content';

const content = async (fastify: FastifyInstance, opts: object) => {

  fastify.get('/content/unrestricted',
    (request, reply) => getUnrestrictedContent(request, reply)
  );

  fastify.get('/content/restricted',
    { preHandler: [authMiddleware] },
    (request, reply) => getRestrictedContent(request, reply)
  );
};

export default content;
