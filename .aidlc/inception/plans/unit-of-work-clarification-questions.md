# Unit of Work Clarification Questions

I detected a slight contradiction between your answer for Question 1 and Question 3.

## Contradiction 1: Layer-by-Layer vs. Atomic Rename
You chose **Layer-by-Layer** (Option A for Q1), which means refactoring all Models, then all Middlewares, etc. 
However, you also chose **Atomic Rename** for "Resources" (Option A for Q3), which implies renaming everything related to resources (Model, Controller, Route) in a single unit of work.

### Clarification Question 1
How should we prioritize these two approaches for the "resources" renaming?

A) **Priority: Layer-by-Layer**. We refactor the "resources" model when we do the Models unit, the "resources" controller when we do the Controllers unit, etc.

B) **Priority: Atomic Resources**. We create a special unit just for the "resources" domain to rename everything (Model, Controller, Route) at once, and keep other refactors layer-by-layer.

C) Other (please describe after [Answer]: tag below)

[Answer]: 
 A is the best 