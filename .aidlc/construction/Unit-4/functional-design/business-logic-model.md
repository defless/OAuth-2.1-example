# Business Logic Model - Unit 4: Routes

This document describes the routing logic and path mappings for the API layer.

## Workflows

### 1. Route Registration
- **Purpose**: Organize and expose controllers via HTTP endpoints using Fastify.
- **Workflow**:
    1. **Modular Loading**: The main server registers the `index` route module.
    2. **Sub-module Registration**: `index` module registers specific route groups (`auth`, `helpers`, `resources`).
    3. **Schema Attachment**: Each route attaches a validation schema for request bodies and responses.
    4. **Middleware Injection**: Protected routes (`/resources/restricted`) inject `authMiddleware` before the controller handler.

### 2. Path Mapping
- **Auth Routes (`/auth/*`)**:
    - `POST /auth/authenticate`: Maps to `auth.authenticate`.
    - `POST /auth/register`: Maps to `auth.credentialRegister`.
- **Helper Routes (`/helpers/*`)**:
    - `GET /helpers/pkce`: Maps to `helpers.generatePKCE`.
    - `GET /helpers/callback`: Direct handling of authorization codes (simplified for PKCE/OAuth demo).
- **Resource Routes (`/resources/*`)**:
    - `GET /resources/unrestricted`: Maps to `resources.getUnrestrictedResources`.
    - `GET /resources/restricted`: Maps to `resources.getRestrictedResources` (Protected).

## Refactoring Logic
- **Path Correction**: Migration from `/ressources` (French spelling/typo) to `/resources` (English standard) across all definitions.
- **Type Safety**: Use of `FastifyInstance` and inferred/explicit types for request and reply objects.
