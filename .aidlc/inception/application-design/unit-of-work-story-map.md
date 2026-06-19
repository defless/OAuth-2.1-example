# Unit of Work Refactor Task Map

This document maps the refactoring requirements to the specific units of work.

| Task Category | Requirement | Unit of Work |
|---|---|---|
| **Infrastructure** | Switch from npm to Bun (`package.json`, `bun.lockb`) | Unit 1: Core & Models |
| **Infrastructure** | Update `index.ts` and `server.ts` for Bun/TS | Unit 1: Core & Models |
| **Data Layer** | Refactor `src/core/models/` to `.ts` | Unit 1: Core & Models |
| **Naming** | Rename `ressources` model to `resources` | Unit 1: Core & Models |
| **Logic Layer** | Refactor `src/core/middlewares/` to `.ts` | Unit 2: Middlewares |
| **Logic Layer** | Refactor `src/controllers/` to `.ts` | Unit 3: Controllers |
| **Naming** | Rename `ressources` controller to `resources` | Unit 3: Controllers |
| **Public API** | Refactor `src/routes/` to `.ts` | Unit 4: Routes |
| **Naming** | Rename `ressources` route to `resources` | Unit 4: Routes |
| **Public API** | Update URL paths from `/ressources` to `/resources` | Unit 4: Routes |
| **Verification** | Unit testing with Bun | Per Unit (Incremental) |
| **Verification** | Final system integration test | Unit 4: Routes |
