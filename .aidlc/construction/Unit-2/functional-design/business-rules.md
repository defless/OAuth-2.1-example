# Business Rules - Unit 2: Middlewares

This document defines the business rules and validation constraints for the middleware layer.

## Authentication Rules
- **Header Requirement**: The `Authorization` header MUST be present and follow the `Bearer <token>` format.
- **Token Validity**: The JWT MUST be signed by the system's private key and must not be expired.
- **Identity Enforcement**: A valid JWT is NOT sufficient; the user `id` contained within must correspond to a currently existing and valid record in the database.
- **Fail-Fast**: If authentication fails, the request must be terminated immediately with a relevant error message to prevent unauthorized access to business logic.

## Error Responses
- **Missing Header**: Return `400 Bad Request` with `message: 'missing_authorization_header'`.
- **Invalid/Expired Token**: Return `401 Unauthorized` with `message: 'unauthorized_client'` (or specific JWT error if desired).
- **User Not Found**: Return `401 Unauthorized` with `message: 'unauthorized_client'`.
- **System Failure**: Return `500 Internal Server Error` with `message: 'internal_server_error'`.
