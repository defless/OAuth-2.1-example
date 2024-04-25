import type { FastifyInstance } from 'fastify';

import { authenticate, credentialRegister } from '../controllers/auth';


const auth = async (fastify: FastifyInstance) => {
  /*
    Authenticate a user with corresponding grant_type
  */
  fastify.post('/auth/authenticate',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            refresh_token: { type: 'string' },
            client_id: { type: 'string' },
            client_secret: { type: 'string' },
            grant_type: {  type: 'string' }
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
  fastify.post('/auth/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
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

};

export default auth;
