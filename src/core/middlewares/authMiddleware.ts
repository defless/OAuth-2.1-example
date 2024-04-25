import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

import User from '../models/user';

export default async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    if (!request.headers.authorization) {
      reply.status(400).send({ message: 'missing_authorization_header'});
    }
    const token = request.headers.authorization.split(' ')[1];
    const userId = jwt.verify(token, process.env.privateKey).id;
    const user = await User.findById(userId);
    if (!user) {
      reply.status(401).send({ message: 'unauthorized_client'});
    }
  } catch (e) {
    reply.status(500).send({ message: 'internal_server_error'});
  }
};
