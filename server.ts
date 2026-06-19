import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';

import { resources, auth, helpers } from './src/routes';
import { AppError } from './src/core/errors';

interface ServerOptions {
  logger?: boolean;
  disableRequestLogging?: boolean;
}

export const server = (opts: ServerOptions): FastifyInstance => {
  const fastify = Fastify({
    logger: opts.logger ?? true,
    disableRequestLogging: opts.disableRequestLogging ?? false,
  });

  fastify.register(cors);
  fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  // Register routes
  fastify.register(auth);
  fastify.register(resources);
  fastify.register(helpers);

  fastify.setErrorHandler((
    error: Error & { validation?: unknown[] },
    _request,
    reply,
  ) => {
    fastify.log.error(error);

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message });
    }

    // Handle Fastify validation errors
    if (error.validation) {
      return reply.status(400).send({
        message: 'validation_error',
        errors: error.validation,
      });
    }

    reply.status(500).send({ message: 'internal_server_error' });
  });

  return fastify;
};
