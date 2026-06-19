# Unit of Work Definitions

The major overhaul is decomposed into four sequential units of work following a Layer-by-Layer refactoring strategy.

## Unit 1: Core & Models
- **Scope**: Foundational infrastructure and data models.
- **Responsibilities**:
    - Transition from `npm` to `bun` (update `package.json`, generate `bun.lockb`).
    - Refactor `src/core/models/` from `.js` to `.ts`.
    - Rename `src/core/models/ressources.ts` to `src/core/models/resources.ts`.
    - Update `index.ts` and `server.ts` for Bun and TS compatibility.
- **Goal**: Establish the TypeScript and Bun foundation with a typed data layer.

## Unit 2: Middlewares
- **Scope**: Request interception and authentication logic.
- **Responsibilities**:
    - Refactor `src/core/middlewares/` from `.js` to `.ts`.
    - Implement strong typing for JWT payloads and Fastify requests.
- **Goal**: Secure and type-safe middleware layer.

## Unit 3: Controllers
- **Scope**: Business logic implementation.
- **Responsibilities**:
    - Refactor `src/controllers/` from `.js` to `.ts`.
    - Rename `src/controllers/ressources.ts` to `src/controllers/resources.ts`.
    - Fix all naming and logic within `auth.ts`, `helpers.ts`, and `resources.ts`.
- **Goal**: Fully type-safe business logic with corrected naming.

## Unit 4: Routes
- **Scope**: API endpoint definitions and URL paths.
- **Responsibilities**:
    - Refactor `src/routes/` from `.js` to `.ts`.
    - Rename `src/routes/ressources.ts` to `src/routes/resources.ts`.
    - Update all route definitions to use the corrected `/resources` path.
- **Goal**: Public API consistency and final system verification.
