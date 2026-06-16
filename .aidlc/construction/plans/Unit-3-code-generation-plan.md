# Unit 3: Controllers - Code Generation Plan

This plan outlines the implementation of the refactored Controller layer.

## Unit Context
- **Unit**: Unit 3: Controllers
- **Stories**:
    - [x] TS Migration and refactor of controllers
    - [x] Rename `ressources.ts` to `resources.ts`
    - [x] Rename functions (`getUnrestrictedResources`, `getRestrictedResources`)
    - [x] Implement Fastify input validation schemas
    - [x] Implement centralized error handling (throwing errors)
    - [x] Cleanup legacy JS controllers
- **Dependencies**: Unit 1 (Models), Unit 2 (Middlewares)

## Step-by-Step Generation

### Step 1: Resource Controller Refactor
1.  [x] **Rename**: `src/controllers/ressources.ts` -> `src/controllers/resources.ts`.
2.  [x] **Modify `src/controllers/resources.ts`**: 
    - Rename functions to `getUnrestrictedResources` and `getRestrictedResources`.
    - Ensure strong typing for `FastifyReply`.
3.  [x] **Unit Summary**: Resource controller refactored and renamed.

### Step 2: Helper Controller Refactor
1.  [x] **Modify `src/controllers/helpers.ts`**: 
    - Ensure strong typing and use of Bun's `crypto` if applicable (already using standard crypto).
2.  [x] **Unit Summary**: Helper controller refactored.

### Step 3: Auth Controller Refactor
1.  [x] **Modify `src/controllers/auth.ts`**: 
    - Implement centralized error handling (throw errors).
    - Ensure all grant handlers are fully typed.
    - Validate that input bodies are typed correctly.
2.  [x] **Unit Summary**: Auth controller refactored.

### Step 4: Verification
1.  [x] **Run Tests**: Execute `bun test` to ensure controller logic remains correct.
2.  [x] **Unit Summary**: Verified controller functionality.

### Step 5: Cleanup
1.  [x] **Delete JS Controllers**: Remove legacy JS files.
2.  [x] **Unit Summary**: Legacy files removed.

---

## Story Traceability
- [x] TS Migration and refactor -> Step 1, 2, 3
- [x] Rename ressources to resources -> Step 1
- [x] Rename functions -> Step 1
- [x] Centralized error handling -> Step 3
- [x] Cleanup legacy JS -> Step 5
