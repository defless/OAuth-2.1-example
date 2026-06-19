# Business Logic Model - Unit 1: Core & Models

This document describes the core business logic and workflows for the foundational layer.

## Workflows

### 1. Database Initialization
- **Purpose**: Establish a connection to the MongoDB database using Mongoose.
- **Workflow**:
    1. Read MongoDB URI from environment variables (fallback to local).
    2. Invoke `mongoose.connect()`.
    3. Log success or handle connection errors.

### 2. Server Configuration
- **Purpose**: Configure the Fastify server instance with appropriate plugins and routes.
- **Workflow**:
    1. Initialize Fastify instance with logging options.
    2. Register standard plugins (CORS, Cookie).
    3. Register domain routes (Auth, Resources, Helpers).
    4. Set up a global error handler to return standardized "internal_server_error" messages.

### 3. Data Persistence (CRUD Basics)
- **Purpose**: Provide a typed interface for interacting with the database.
- **Workflow**:
    1. Define Mongoose Schemas with strict typing based on `UserItem` and `ClientItem`.
    2. Export typed Mongoose Models.
    3. Ensure automatic timestamping or specific field validations (defined in Business Rules).

## Data Transformations
- **JS to TS Migration**: Convert raw JavaScript objects to strongly typed TypeScript interfaces across all layers.
- **Naming Normalization**: Transform all `ressources` references to `resources` to ensure consistent English naming.
