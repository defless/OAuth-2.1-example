import Fastify from 'fastify'
import cors from '@fastify/cors'
import mongoose from 'mongoose'
import 'dotenv/config'
import { createHash, randomBytes } from 'crypto';

import { content, auth } from './src/routes'

try {
  await mongoose.connect('mongodb://localhost:27017/basicAuth');
  console.log('[Basic-Auth-database] Successfully connected mongo')
} catch (error) {
  console.log('[Basic-Auth-database] Failed to connect mongo');
}

const fastify = Fastify({
  logger: true
})

fastify.register(cors);
fastify.setErrorHandler((_error, _request, reply) => {
  reply.status(500).send({ message: 'internal_server_error' })
})

fastify.register(auth);
fastify.register(content);

fastify.get('/', async (_request, reply) => {

  const code_verifier = randomBytes(64).toString('hex');
  const sha256String = createHash('sha256')
  .update(code_verifier)
  .digest('base64');

  const code_challenge = sha256String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  reply.send({ code_challenge, code_verifier });
})

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}