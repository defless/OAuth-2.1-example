# Domain Entities - Unit 4: Routes

This document describes the data structures (entities) relevant to the routing layer.

## Route Definitions
- **AuthRoute**: Definition of endpoints related to user lifecycle and token issuance.
- **HelperRoute**: Definition of endpoints for PKCE parameter generation and OAuth callbacks.
- **ResourceRoute**: Definition of endpoints for accessing protected or public data.

## Request/Response Schemas (Simplified)
- **AuthenticateRequest**: `email?`, `password?`, `refresh_token?`, `client_id?`, `client_secret?`, `grant_type`.
- **RegisterRequest**: `email`, `password`.
- **AuthResponse**: `access_token`, `token_type`, `expires_in`, `refresh_token`.
- **PKCEResponse**: `code_challenge`, `code_verifier`.
- **ResourceResponse**: `content`.

## Types
- **FastifyInstance**: The core server instance used for route registration.
- **FastifyRequest**: The request object, extended with types for `Body`, `Query`, and `Params` where necessary.
- **FastifyReply**: The response object.
