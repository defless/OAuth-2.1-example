import type { FastifyInstance } from 'fastify';
import authMiddleware from '../core/middlewares/authMiddleware'
import {
  getRestrictedContent,
  getUnrestrictedContent,
} from '../controllers/ressources';

const content = async (fastify: FastifyInstance, opts: object) => {

  fastify.get('/ressources/unrestricted',
    (request, reply) => getUnrestrictedContent(request, reply)
  );

  fastify.get('/ressources/restricted',
    { preHandler: [authMiddleware] },
    (request, reply) => getRestrictedContent(request, reply)
  );
};

export default content;
