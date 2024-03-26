import Fastify from 'fastify'
import mongoose from 'mongoose'
import 'dotenv/config'

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

fastify.setErrorHandler((_error, _request, reply) => {
  reply.status(500).send({ message: 'internal_server_error' })
})

fastify.register(auth);
fastify.register(content);

try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}