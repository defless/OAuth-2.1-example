# Business Rules - Unit 3: Controllers

This document defines the business rules, validation constraints, and naming conventions for the Controller layer.

## Authentication Rules
- **Grant Type Enforcement**: Only supported grant types (`password`, `refresh_token`, `authorization_code`, `client_credentials`) are allowed.
- **Credential Integrity**: Registration requires unique emails and salted/hashed passwords (Unit 1 rules).
- **Token Rotation**: Refresh tokens must be rotated upon use to enhance security.
- **Validation**: All incoming request bodies MUST be validated against Fastify JSON Schemas before processing.

## Resource Rules
- **Naming Correction**: All functions and exports related to "ressources" MUST be renamed to "resources".
- **Function Names**:
    - `getUnrestrictedContent` -> `getUnrestrictedResources`
    - `getRestrictedContent` -> `getRestrictedResources`

## Error Handling Rules
- **Abstraction**: Controllers MUST NOT call `reply.send()` for error states.
- **Consistency**: Use standardized error objects to ensure consistent API responses across all modules.
- **Robustness**: Validation errors caught by Fastify schemas should return `400 Bad Request` automatically.

## PKCE Rules
- **Algorithm**: MUST use SHA256 for challenge generation.
- **Encoding**: MUST use Base64-URL encoding (no padding, URL-safe characters).
