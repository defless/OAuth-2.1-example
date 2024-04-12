import type { FastifyInstance } from 'fastify';
import { createHash, randomBytes } from 'crypto';

const helpers = async (fastify: FastifyInstance) => {
  fastify.get('/helpers/pkce', (_request, reply) => {
  
    const code_verifier = randomBytes(64).toString('hex');
    const sha256String = createHash('sha256')
    .update(code_verifier)
    .digest('base64');
  
    const code_challenge = sha256String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  
    reply.send({ code_challenge, code_verifier });
  })
};

export default helpers;