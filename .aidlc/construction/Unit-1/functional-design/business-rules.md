# Business Rules - Unit 1: Core & Models

This document defines the business rules, validation logic, and constraints for the foundational layer.

## User Rules (UserItem)
- **Unique Identifier**: User must have a unique email address.
- **Password Security**: Passwords must be hashed using bcrypt before persistence.
- **Required Fields**: Email and Password are required for registration.

## Client Rules (ClientItem)
- **Unique Identifier**: Each client must have a unique `clientId`.
- **Credential Integrity**: `clientSecret` must be generated and stored securely.

## System-wide Rules
- **Naming Convention**: All internal and external identifiers for "resources" must use the standard English spelling (rename from `ressources`).
- **Runtime Consistency**: All dependencies must be managed via Bun (`bun.lockb`).
- **Type Safety**: No `any` types allowed in core models; all data structures must use defined interfaces.
- **Error Consistency**: All unhandled exceptions must result in a `500 Internal Server Error` with a `message: 'internal_server_error'` response body.
