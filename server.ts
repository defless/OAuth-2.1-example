import Fastify from 'fastify'
import cors from '@fastify/cors'

import { content, auth, helpers } from './src/routes'

declare interface ServerOptions {
  logger?: boolean;
  disableRequestLogging?: boolean;
}

export const server = (opts: ServerOptions) => {
  const fastify = Fastify({
    logger: opts.logger || true,
    disableRequestLogging: opts.disableRequestLogging || false,
  })
  
  fastify.register(cors);
  fastify.setErrorHandler((_error, _request, reply) => {
    reply.status(500).send({ message: 'internal_server_error' })
  })
  
  fastify.register(auth);
  fastify.register(content);
  fastify.register(helpers);

  return fastify;
};