export const authenticateSchema = {
  body: {
    type: 'object',
    required: ['grant_type'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
      refresh_token: { type: 'string' },
      client_id: { type: 'string' },
      client_secret: { type: 'string' },
      grant_type: {
        type: 'string',
        enum: [
          'password',
          'refresh_token',
          'authorization_code',
          'client_credentials',
        ],
      },
    },
  },
};

export const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
    },
  },
};
