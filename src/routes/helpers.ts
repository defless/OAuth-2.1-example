import type { FastifyInstance } from 'fastify';
import { generatePKCE } from '../controllers/helpers';

const helpers = async (fastify: FastifyInstance) => {
  fastify.get('/helpers/pkce',
    (request, reply) => generatePKCE(request, reply)
  );

  fastify.get('/helpers/callback',
    async (request, reply) => {
      const { code } = request.query as { code: string };
      if (!code) {
        return reply.code(400).send('invalid_code');
      }
      reply.code(200).send({ code });
    }
  );
};

export default helpers;