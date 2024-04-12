import type { FastifyInstance } from 'fastify';

import {
  authenticate,
  credentialRegister,
  thirdPartyRegister,
} from '../controllers/auth';


const auth = async (fastify: FastifyInstance) => {
  /*
    Authenticate a user with corresponding grant_type
  */
  fastify.post('/auth/authenticate',
    {
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
              refresh_token: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => authenticate(request, reply)
  );

  /*
    Register a new user with credentials
  */
  fastify.post('/auth/register/credentials',
    {
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
          201: {
            type: 'object',
            properties: {
              access_token: { type: 'string' },
              token_type: { type: 'string', enum: ['Bearer'] },
              expires_in: { type: 'number' },
              refresh_token: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => credentialRegister(request, reply)
  );

  /*
    Register a new user with third-party service
  */
  fastify.post('/auth/register/third-party',
    {
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
          201: {
            type: 'object',
            properties: {
              access_token: { type: 'string' },
              token_type: { type: 'string', enum: ['Bearer'] },
              expires_in: { type: 'number' },
              refresh_token: { type: 'string' }
            }
          }
        }
      }
    },
    async (request, reply) => thirdPartyRegister(request, reply)
  );

  /*
    Returns the authorization code sent by the third-party service
  */
  fastify.get('/auth/callback',
  async (request, reply) => {
    const { code } = request.query as { code: string };
    if (!code) {
      return reply.code(400).send('invalid_code');
    }
    reply.code(200).send({ code });
  });
};

export default auth;
