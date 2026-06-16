# Business Logic Model - Unit 3: Controllers

This document describes the core business logic and workflows for the Controller layer.

## Workflows

### 1. Unified Authentication (authenticate)
- **Purpose**: Delegate authentication logic based on the requested `grant_type`.
- **Workflow**:
    1. **Input Validation**: Validate body using Fastify schema (mandatory `grant_type`).
    2. **Strategy Selection**: Dispatch to the appropriate grant handler (Password, Refresh Token, Auth Code, Client Credentials).
    3. **Execution**: Execute the chosen strategy.
    4. **Response**: Return tokens or delegate error to centralized handler.

### 2. Grant Strategies
- **Password**: Validate credentials against database, hash comparison, and issue new tokens.
- **Refresh Token**: Validate refresh token against user record, rotate token, and issue new access token.
- **Authorization Code**: Verify code with third-party provider, link/create user, and issue tokens.
- **Client Credentials**: Validate client ID/Secret and issue application-level access token.

### 3. Resource Delivery (Resource Controller)
- **Purpose**: Serve content based on authentication status.
- **Workflow**:
    1. **Unrestricted**: Return public content to any requester.
    2. **Restricted**: Rely on `authMiddleware` (Unit 2) to validate identity, then return protected content.

### 4. PKCE Generation (Helper Controller)
- **Purpose**: Generate cryptographic parameters for PKCE flow.
- **Workflow**:
    1. Generate a random `code_verifier`.
    2. Compute SHA256 hash.
    3. Format as Base64-URL-encoded `code_challenge`.

## Centralized Error Handling Integration
- Controllers will now throw specific errors (e.g., `NotFoundError`, `UnauthorizedError`, `BadRequestError`) instead of manually sending responses.
- The global error handler (configured in Unit 1) will catch these and format the response.
