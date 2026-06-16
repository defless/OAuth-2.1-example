import type { FastifyInstance } from 'fastify';

import { generatePKCE } from '../controllers/helpers';

const helpers = async (fastify: FastifyInstance) => {
  fastify.get(
    '/helpers/pkce',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              code_challenge: { type: 'string' },
              code_verifier: { type: 'string' },
            },
          },
        },
      },
    },
    (_request, reply) => generatePKCE(reply),
  );

  fastify.get(
    '/helpers/callback',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            code: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              code: { type: 'string' },
            },
          },
          400: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { code } = request.query as { code: string };

      if (!code) {
        return reply.code(400).send({ message: 'invalid_code' });
      }

      reply.code(200).send({ code });
    },
  );
};

export default helpers;
