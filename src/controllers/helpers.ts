import { createHash, randomBytes } from 'crypto';

export const generatePKCE = async (_request, reply) => {
  const code_verifier = randomBytes(64).toString('hex');
  const sha256String = createHash('sha256')
  .update(code_verifier)
  .digest('base64');

  const code_challenge = sha256String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  reply.send({ code_challenge, code_verifier });
};