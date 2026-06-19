# API Documentation

## REST APIs
### Authenticate
- **Method**: POST
- **Path**: `/auth/authenticate`
- **Purpose**: Authenticates a user and returns tokens.
- **Request**: JSON object with `email`, `password`, or `refresh_token`, `client_id`, `client_secret`, `grant_type`.
- **Response**: `200 OK` with `access_token`, `token_type`, `expires_in`, `refresh_token`.

### Register
- **Method**: POST
- **Path**: `/auth/register`
- **Purpose**: Registers a new user.
- **Request**: JSON object with `email`, `password`.
- **Response**: `201 Created` with `access_token`, `token_type`, `expires_in`, `refresh_token`.

### Unrestricted Resources
- **Method**: GET
- **Path**: `/ressources/unrestricted`
- **Purpose**: Returns public content.
- **Request**: None.
- **Response**: `200 OK` with public data.

### Restricted Resources
- **Method**: GET
- **Path**: `/ressources/restricted`
- **Purpose**: Returns restricted content (requires JWT).
- **Request**: Bearer token in `Authorization` header.
- **Response**: `200 OK` with restricted data or `401 Unauthorized`.

### Generate PKCE
- **Method**: GET
- **Path**: `/helpers/pkce`
- **Purpose**: Generates PKCE challenge and verifier.
- **Request**: None.
- **Response**: `200 OK` with PKCE parameters.

### Callback
- **Method**: GET
- **Path**: `/helpers/callback`
- **Purpose**: Handles OAuth callback.
- **Request**: Query parameter `code`.
- **Response**: `200 OK` with code or `400 Bad Request`.

## Data Models
### User
- **Fields**: `email`, `password`, `username`.
- **Relationships**: None.
- **Validation**: Email unique, password hashed.

### Client
- **Fields**: `clientId`, `clientSecret`.
- **Relationships**: None.
- **Validation**: `clientId` unique.
