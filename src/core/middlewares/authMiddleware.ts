import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

import User from '../models/user';

interface JWTPayload {
  id: string;
}

/**
 * Middleware to verify JWT and validate user identity.
 */
export default async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { authorization } = request.headers;

    if (!authorization) {
      return reply.status(400).send({
        message: 'missing_authorization_header',
      });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      return reply.status(400).send({
        message: 'invalid_authorization_format',
      });
    }

    const privateKey = process.env.PRIVATE_KEY || 'test';
    const decoded = jwt.verify(token, privateKey) as JWTPayload;

    const user = await User.findById(decoded.id);

    if (!user) {
      return reply.status(401).send({ message: 'unauthorized_client' });
    }

    // Attach user to request for use in controllers

    (request as any).user = user;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send({ message: 'unauthorized_client' });
    }

    return reply.status(500).send({ message: 'internal_server_error' });
  }
};
