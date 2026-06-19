# Domain Entities - Unit 1: Core & Models

This document defines the core domain entities and their relationships.

## Entities

### UserItem
Represents a registered user in the system.
- **Attributes**:
    - `email`: string (Unique, primary identity)
    - `password`: string (Hashed)
    - `refresh_token`: string (Optional)
    - `authorization_code`: string (Optional)
    - `providerId`: string (Optional, for OAuth)
- **Relationships**: None in current scope.

### ClientItem
Represents an OAuth-like client application.
- **Attributes**:
    - `name`: string
    - `clientId`: string (Unique)
    - `clientSecret`: string
- **Relationships**: None in current scope.

## Relationships
The current system maintains a flat relationship model where Users and Clients are independent entities. Future expansions may link Users to specific Clients or Roles.

## Renaming Transition
- **Entity**: "Ressource" (Former)
- **Status**: Renamed to "Resource".
- **Implementation**: No dedicated database entity (Unit 1); handled as functional paths and controller logic in subsequent units.
