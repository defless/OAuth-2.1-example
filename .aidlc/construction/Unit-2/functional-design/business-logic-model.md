# Business Logic Model - Unit 2: Middlewares

This document describes the core business logic and workflows for the authentication middleware.

## Workflows

### 1. Authentication Interception (authMiddleware)
- **Purpose**: Protect restricted routes by verifying the requester's identity.
- **Workflow**:
    1. **Header Validation**: Check for the presence of the `Authorization` header.
    2. **Token Extraction**: Extract the Bearer token from the header.
    3. **Signature Verification**: Verify the JWT signature using the system's private key.
    4. **Payload Extraction**: Retrieve the user `id` from the validated JWT payload.
    5. **Identity Validation**: Fetch the full User document from the database to ensure the account is active and valid.
    6. **Context Enrichment**: (Optional) Attach the user object to the request context for downstream use.
    7. **Error Handling**: Immediately return specific error codes (400, 401, 500) if any step fails.

## Data Transformations
- **Header to Token**: String manipulation to isolate the JWT from the "Bearer " prefix.
- **JWT to Payload**: Decoding and verifying the signed string into a typed object.
