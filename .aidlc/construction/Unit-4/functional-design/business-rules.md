# Business Rules - Unit 4: Routes

This document outlines the business rules governing the routing layer.

## BR-401: Path Consistency
- All API paths must use English terminology.
- The path `/ressources` is deprecated and must be replaced by `/resources`.
- Redirects are NOT implemented; the old path will return 404 to ensure clients migrate to the correct endpoint.

## BR-402: Validation Mandatory
- Every `POST` route must have a JSON Schema defined for its request body.
- Response schemas should be defined for the `200` (OK) or `201` (Created) status codes to ensure predictable API output.

## BR-403: Authorization Enforcement
- Routes requiring authentication must use the `preHandler` hook with `authMiddleware`.
- No controller logic for sensitive data should be executed before the middleware confirms identity.

## BR-404: Route Modularity
- Routes must be defined in separate files grouped by functional area.
- The `index.ts` in the routes directory must be the single entry point for all route registrations.
