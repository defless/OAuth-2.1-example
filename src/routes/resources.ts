import type { FastifyInstance } from 'fastify';

import authMiddleware from '../core/middlewares/authMiddleware';
import {
  getRestrictedResources,
  getUnrestrictedResources,
} from '../controllers/resources';

const resources = async (fastify: FastifyInstance) => {
  fastify.get(
    '/resources/unrestricted',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              content: { type: 'string' },
            },
          },
        },
      },
    },
    (_request, reply) => getUnrestrictedResources(reply),
  );

  fastify.get(
    '/resources/restricted',
    {
      preHandler: [authMiddleware],
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              content: { type: 'string' },
            },
          },
        },
      },
    },
    (_request, reply) => getRestrictedResources(reply),
  );
};

export default resources;
