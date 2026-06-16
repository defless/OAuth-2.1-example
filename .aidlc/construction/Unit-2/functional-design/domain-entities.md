# Domain Entities - Unit 2: Middlewares

This document defines the entities and types relevant to the authentication middleware.

## Entities

### JWTPayload
Represents the decrypted content of an authentication token.
- **Attributes**:
    - `id`: string (The internal User ID)

## Request Context (Fastify)
- **Identity**: The middleware validates the `UserItem` from Unit 1.
- **Header**: Standard HTTP `Authorization` header.

## Cleanup Rules (Unit 2 Specific)
- **Legacy Files**: All `.js` middleware files must be removed after successful `.ts` refactoring.
- **Type Checking**: `node_modules` must be excluded from type checking configurations (tsconfig).
