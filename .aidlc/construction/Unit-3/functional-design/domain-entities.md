# Domain Entities - Unit 3: Controllers

This document defines the data structures and request/response models for the Controller layer.

## Request Models (Input Schemas)

### AuthenticateRequest
- **grant_type**: string (Enum: password, refresh_token, authorization_code, client_credentials)
- **email**: string (Optional)
- **password**: string (Optional)
- **refresh_token**: string (Optional)
- **client_id**: string (Optional)
- **client_secret**: string (Optional)

### SignupRequest
- **email**: string (Required, format: email)
- **password**: string (Required, minLength: 8)

## Response Models (Output Schemas)

### AuthSuccessResponse
- **access_token**: string
- **token_type**: "Bearer"
- **expires_in**: number (default: 900)
- **refresh_token**: string (Optional)

### PKCEResponse
- **code_challenge**: string
- **code_verifier**: string

### ResourceResponse
- **content**: string

## Renamed Elements Summary
- **Controller File**: `ressources.ts` -> `resources.ts`
- **Functions**: `getUnrestrictedContent` -> `getUnrestrictedResources`, `getRestrictedContent` -> `getRestrictedResources`
