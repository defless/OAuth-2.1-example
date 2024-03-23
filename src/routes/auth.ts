import type { FastifyInstance, RouteShorthandOptions } from 'fastify';

import { authenticate, signup } from '../controllers/auth';


const auth = async (fastify: FastifyInstance) => {
  const authenticateOptions: RouteShorthandOptions = {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password', 'grant_type'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
          grant_type: { 
            type: 'string',
            enum: ['password', 'refresh_token', 'authorization_code']
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            access_token: { type: 'string' },
            token_type: { type: 'string', enum: ['Bearer'] },
            expires_in: { type: 'number' },
            refresh_token: { type: 'number' }
          }
        }
      }
    }
  };
  fastify.post(
    '/auth/authenticate',
    authenticateOptions,
    async (_request, _reply) => authenticate(_request, _reply));
  const signUpOptions: RouteShorthandOptions = {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }
  fastify.post(
    '/auth/signup',
    signUpOptions,
    async (_request, _reply) => signup(_request, _reply)
  );
};

export default auth;