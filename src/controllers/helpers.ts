import { createHash, randomBytes } from 'crypto';

import type { FastifyReply } from 'fastify';

/**
 * Generates PKCE challenge and verifier.
 */
export const generatePKCE = async (reply: FastifyReply) => {
  const code_verifier = randomBytes(64).toString('hex');
  const sha256String = createHash('sha256')
    .update(code_verifier)
    .digest('base64');

  const code_challenge = sha256String
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return reply.send({ code_challenge, code_verifier });
};
