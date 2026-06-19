# Requirements Clarification Questions

Please answer the following questions to help define the project's goal, tech stack, and scope.

## Question 1: Project Primary Goal
What is the primary goal of the current task?

A) Add new authentication features (e.g., social login, MFA, password reset)

B) Implement new resource endpoints or business logic

C) Refactor the existing codebase (e.g., fix typos, improve structure, complete TS migration)

D) Enhance security and validation (e.g., better error handling, stricter JWT policies)

E) Other (please describe after [Answer]: tag below)

[Answer]: C i have started a refactor from js to ts. I want to continue this work. Not: Use bun and not npm. 

## Question 2: Tech Stack Preferences
Are there any specific technologies or libraries you want to add or change?

A) Keep the current stack (Fastify, Mongoose, Jest)

B) Switch database (e.g., to PostgreSQL via Prisma/Drizzle)

C) Add new utilities (e.g., Zod for validation, Passport for auth strategies)

D) Change the testing framework

E) Other (please describe after [Answer]: tag below)

[Answer]: A get rid of js to ts, keep the current stack. I want to focus on refactoring and improving the existing codebase rather than introducing new technologies at this stage. use bun not npm.

## Question 3: Scope of Changes
What is the expected scope of the modifications?

A) Minor surgical changes to 1-2 files

B) Focused changes to a single component (e.g., only the auth flow)

C) Cross-cutting changes affecting multiple components (routes, controllers, and models)

D) Major overhaul of the entire system

E) Other (please describe after [Answer]: tag below)

[Answer]: D I want to do a major overhaul of the entire system, improving code quality, fixing typos, and ensuring consistency across all components. This includes refactoring existing code, enhancing error handling, and possibly restructuring some parts of the application for better maintainability, clarity and scalability.

## Question 4: "Ressources" Typo
Should I fix the "ressources" typo throughout the project (folders, files, URLs, variables)?

A) Yes, rename everything to "resources" (correct English spelling)

B) No, keep it as "ressources" for now

X) Other (please describe after [Answer]: tag below)

[Answer]: yes fix translations typo. 

## Question 5: Extension - Security Baseline
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: No not necessary it's just a sandbox. 

## Question 6: Extension - Property-Based Testing
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)

B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)

C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)

X) Other (please describe after [Answer]: tag below)

[Answer]: No not necessary it's just a sandbox.
