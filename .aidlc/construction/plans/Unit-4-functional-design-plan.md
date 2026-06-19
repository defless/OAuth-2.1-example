# Unit 4: Routes - Functional Design Plan

This plan outlines the design for the Routes layer refactor and naming correction.

## Step 1: Mandatory Artifacts
- [x] Generate `.aidlc/construction/Unit-4/functional-design/business-logic-model.md`
- [x] Generate `.aidlc/construction/Unit-4/functional-design/business-rules.md`
- [x] Generate `.aidlc/construction/Unit-4/functional-design/domain-entities.md`

## Step 2: Design Strategy
- Refactor all remaining `.js` files in `src/routes/` to `.ts`.
- Standardize naming by renaming `ressources.ts` to `resources.ts`.
- Update all path definitions from `/ressources` to `/resources`.
- Ensure all route exports are correctly typed using `FastifyInstance`.
- Clean up unused `.js` files.

## Step 3: Validation Strategy
- Verify that all routes are accessible via their new paths.
- Ensure TypeScript compilation passes without errors.
- Run existing tests to ensure no regressions.
