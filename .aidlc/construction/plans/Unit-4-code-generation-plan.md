# Unit 4: Routes - Code Generation Plan

This plan outlines the implementation of the refactored Routes layer.

## Unit Context
- **Unit**: Unit 4: Routes
- **Stories**:
    - [ ] Rename `src/routes/ressources.ts` to `src/routes/resources.ts`
    - [ ] Refactor all routes to use strong typing and corrected paths
    - [ ] Update `src/routes/index.ts` to reflect name changes
    - [ ] Cleanup legacy JS routes
- **Dependencies**: Unit 1 (Models), Unit 2 (Middlewares), Unit 3 (Controllers)

## Step-by-Step Generation

### Step 1: Resource Route Refactor
1.  **Rename**: `src/routes/ressources.ts` -> `src/routes/resources.ts`.
2.  **Modify `src/routes/resources.ts`**:
    - Update paths from `/ressources` to `/resources`.
    - Ensure correct imports from `../controllers/resources`.
    - Apply `FastifyInstance` typing.

### Step 2: Auth and Helper Routes Refactor
1.  **Modify `src/routes/auth.ts`**:
    - Ensure schemas are correctly typed.
2.  **Modify `src/routes/helpers.ts`**:
    - Ensure query parameters are typed.

### Step 3: Index Route Update
1.  **Modify `src/routes/index.ts`**:
    - Update import and export of `ressources` to `resources`.

### Step 4: Cleanup
1.  **Delete JS Routes**: Remove all `.js` files in `src/routes/`.

### Step 5: Final Verification
1.  **Run Tests**: Execute `bun test`.
2.  **Type Check**: Ensure `tsc` passes (if applicable, though we use Bun).
3.  **Manual Verification**: (Optional) Check key endpoints if possible.

---

## Story Traceability
- [ ] Rename ressources to resources -> Step 1, 3
- [ ] Refactor routes with typing -> Step 1, 2
- [ ] Correct paths -> Step 1
- [ ] Cleanup legacy JS -> Step 4
