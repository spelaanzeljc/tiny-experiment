---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Fake backend DB table definitions, repositories, seed data, and registry patterns."
globs: ["packages/fake-be/src/db/**/*.ts"]
cursor:
  alwaysApply: false
  description: "Apply when editing fake backend database schemas, repositories, seed data, DBML, or storage."
  globs: ["packages/fake-be/src/db/**/*.ts"]
---

# Fake Backend DB

The fake backend database lives in `packages/fake-be/src/db`. It is persisted to browser `localStorage`, but code should model it like a small relational database so the API surface can later be replaced by a real backend.

## Table Shape

Tables live under `packages/fake-be/src/db/tables/<tableName>/` and use singular lower camelCase folder and file basenames. For example, use `packages/fake-be/src/db/tables/user/user.schema.ts`, `packages/fake-be/src/db/tables/planet/planet.repository.ts`, and `packages/fake-be/src/db/tables/userRole/userRole.seed.ts`.

- `<table>.schema.ts`: Zod row schema, exported row type, and `defineTable(...)` metadata.
- `<table>.repository.ts`: repository created with `createTableRepository(table)`.
- `<table>.seed.ts`: deterministic seed rows for local development.

Rows use camelCase field names. Keep DB row schemas focused on persisted columns only. API-only fields belong in oRPC model schemas, not table schemas.

Table metadata names use PascalCase singular names, such as `User`, `Project`, or `UserRole`. Local table folders, file basenames, table variables, repository variables, and table seed helper names should also be singular, such as `userTable`, `userRepository`, and `createUserSeed`.

Design tables as if they will become a relational database schema. Prefer scalar columns and foreign-key relations. Avoid document-style persisted shapes such as nested objects, arrays of objects, or denormalized embedded collections unless there is a deliberate relational escape hatch documented in the table schema.

Each table schema must:

- Export a Zod schema and `z.infer` row type.
- Call `defineTable<"TableName", Row, typeof RowSchema>({ ... })`.
- Set `name`, `schema`, `primaryKey`, and `columns`.
- Include one `columns` entry per persisted field.
- Mark nullable Zod fields with `nullable: true`.
- Mark optional Zod fields with `optional: true`.
- Mark the primary key column with `primaryKey: true`.
- Add `relations` for foreign keys using `{ column, references: { table, column } }`.
- Use `dbml: { hidden: true }` only for infrastructure tables that must remain in the local fake store but should not appear in generated DBML or ER diagrams, such as auth session storage.

Allowed column metadata types are `varchar`, `text`, `datetime`, `boolean`, and `decimal`. Add new column types only if `DbColumnType`, DBML generation, and ER diagram generation are updated together.

## Repository Pattern

Use `createTableRepository` for normal table access. oRPC handlers should call repositories rather than reading or writing the store directly.

Repository methods validate rows through the table Zod schema. `update` also persists nested row changes. If code mutates nested row objects directly, call `persistStore()` afterwards because the store proxy only persists top-level assignments and mutating array methods.

Use `storeHelpers.uuid()` and `storeHelpers.now()` when creating IDs and timestamps in handlers.

## Registry And Seed Data

When adding a table:

- Add the table to `dbTables` in `packages/fake-be/src/db/schema-registry.ts`.
- Add or reuse a stable `tableNames` alias in `schema-registry.ts` when API modules need Robodev ownership metadata for the table.
- Add seed IDs to `packages/fake-be/src/db/seed/ids.ts` when stable IDs are useful.
- Add the table seed function to `createSeedState()` in `packages/fake-be/src/db/seed/index.ts`.
- Keep table metadata accurate because DBML and ER diagram data are generated from `dbTables`.
