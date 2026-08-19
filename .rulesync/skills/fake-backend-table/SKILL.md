---
name: fake-backend-table
description: "Use when adding or changing a fake backend database table, schema, repository, registry entry, or seed data."
targets: ["claudecode", "codexcli", "cursor"]
codexcli:
  short-description: Add or update fake backend DB tables.
---

# Fake Backend Table Skill

Use this workflow for table work in `packages/fake-be/src/db`.

1. Inspect an existing singular table folder such as `packages/fake-be/src/db/tables/planet` and mirror its file shape.
2. Create or update `<table>.schema.ts` with:
   - Zod row schema using camelCase persisted fields.
   - Relational table shape: scalar columns plus foreign keys, not nested objects or arrays of objects.
   - Exported `z.infer` row type.
   - `defineTable(...)` metadata with a PascalCase singular `name`, such as `User`, `Project`, or `UserRole`, plus `schema`, `primaryKey`, `columns`, and optional `relations`.
3. Use singular lower camelCase table folder names, file basenames, table variables, repository variables, and table seed helper names, such as `user/user.schema.ts`, `userTable`, `userRepository`, and `createUserSeed`.
4. Create or update `<table>.repository.ts` with `createTableRepository(table)`.
5. Create or update `<table>.seed.ts` with deterministic seed rows. Put reusable stable IDs in `packages/fake-be/src/db/seed/ids.ts`.
6. Register the table in `packages/fake-be/src/db/schema-registry.ts` and add a stable `tableNames` alias when API modules need to reference ownership metadata.
7. Include the table in `createSeedState()` in `packages/fake-be/src/db/seed/index.ts`.
8. If relationships changed, verify `relations` metadata is correct so DBML and ER diagram output stay useful.
9. If oRPC endpoints expose the table, create API-specific models in `packages/fake-be/src/orpc/api/<domain>/<domain>.models.ts` instead of reusing DB row schemas directly on the frontend.

After changes, run the most relevant checks. Use `bun openapi:gen` if API contracts changed, then `bun ts:check`.
