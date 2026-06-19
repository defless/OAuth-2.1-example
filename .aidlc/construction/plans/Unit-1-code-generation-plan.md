# Unit 1: Core & Models - Code Generation Plan

This plan outlines the implementation of the foundational refactor for Unit 1.

## Unit Context
- **Unit**: Unit 1: Core & Models
- **Stories**:
    - [x] TS Migration of Models
    - [x] Transition to Bun
    - [x] Root file refactor (`index.ts`, `server.ts`)
- **Dependencies**: None
- **Database Entities**: `User`, `Client`

## Step-by-Step Generation

### Step 1: Bun Transition
1.  [x] **Modify `package.json`**: Update scripts to use `bun` and add `bun-types`.
2.  [x] **Generate `bun.lockb`**: Run `bun install` to generate the lockfile and remove `bun.lock`.
3.  [x] **Cleanup**: Remove `node_modules` and re-install with Bun.
4.  [x] **Unit Summary**: Transition to Bun completed.

### Step 2: Model Refactoring (JS to TS)
1.  [x] **Modify `src/core/models/user.ts`**: Ensure it is fully typed and follows the `UserItem` interface.
2.  [x] **Modify `src/core/models/client.ts`**: Ensure it is fully typed and follows the `ClientItem` interface.
3.  [x] **Delete JS Models**: Remove `src/core/models/user.js` and `src/core/models/client.js`.
4.  [x] **Unit Summary**: Models are now fully TypeScript.

### Step 3: Root File Refactoring
1.  [x] **Modify `index.ts`**: Ensure compatibility with Bun and typed Mongoose connection.
2.  [x] **Modify `server.ts`**: Update to use TypeScript best practices for Fastify and registered routes.
3.  [x] **Unit Summary**: Root files refactored.

### Step 4: Testing Migration (bun:test)
1.  [x] **Update `package.json`**: Set test script to `bun test`.
2.  [x] **Refactor `tests/index.test.ts`**: Migration from Jest to `bun:test` (Unit 1 relevant parts).
3.  [x] **Unit Summary**: Testing infrastructure switched to Bun.

---

## Story Traceability
- [x] TS Migration of Models -> Step 2
- [x] Transition to Bun -> Step 1, Step 4
- [x] Root file refactor -> Step 3
