import jwt from 'jsonwebtoken';
import User from '../models/user';
import { error, check } from '../../utils.js';
import { FastifyReply, FastifyRequest } from 'fastify';

export default async (req: FastifyRequest, res: FastifyReply) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('authorization_header is missing')
    }
    const token = req.headers.authorization.split(' ')[1];
    const userId = jwt.verify(token, process.env.privateKey).id;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('unauthorized_client')
    }
  } catch (e) {
    error(res, e);
  }
};
