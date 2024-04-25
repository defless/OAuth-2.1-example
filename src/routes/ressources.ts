import type { FastifyInstance } from 'fastify';
import authMiddleware from '../core/middlewares/authMiddleware'
import {
  getRestrictedContent,
  getUnrestrictedContent,
} from '../controllers/ressources';

const content = async (fastify: FastifyInstance, opts: object) => {

  fastify.get('/ressources/unrestricted',
    (_request, reply) => getUnrestrictedContent(reply)
  );

  fastify.get('/ressources/restricted',
    { preHandler: [authMiddleware] },
    (_request, reply) => getRestrictedContent(reply)
  );
};

export default content;
