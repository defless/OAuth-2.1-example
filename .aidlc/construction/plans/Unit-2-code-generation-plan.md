# Unit 2: Middlewares - Code Generation Plan

This plan outlines the implementation of the refactored middleware layer.

## Unit Context
- **Unit**: Unit 2: Middlewares
- **Stories**:
    - [x] TS Migration of authMiddleware
    - [x] Strong typing for JWT and Fastify requests
    - [x] Cleanup legacy JS middleware
- **Dependencies**: Unit 1 (Models)

## Step-by-Step Generation

### Step 1: Middleware Refactoring
1.  [x] **Modify `src/core/middlewares/authMiddleware.ts`**: 
    - Implement strong typing for `jwt.verify`.
    - Ensure `FastifyRequest` and `FastifyReply` are correctly used.
    - Validate that the User document is fetched and checked.
2.  [x] **Unit Summary**: Middleware is now fully TypeScript and typed.

### Step 2: Verification
1.  [x] **Run Tests**: Execute `bun test` to ensure authentication flow still works.
2.  [x] **Unit Summary**: Verified middleware functionality.

### Step 3: Cleanup
1.  [x] **Delete JS Middleware**: Remove `src/core/middlewares/authMiddleware.js`.
2.  [x] **Unit Summary**: Legacy file removed.

---

## Story Traceability
- [x] TS Migration of authMiddleware -> Step 1
- [x] Strong typing -> Step 1
- [x] Cleanup legacy JS -> Step 3
