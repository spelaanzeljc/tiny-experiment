---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "oRPC API module, contract, router, OpenAPI, and business-logic metadata conventions."
globs: ["packages/fake-be/src/orpc/**/*.ts"]
cursor:
  alwaysApply: false
  description: "Apply when editing oRPC contracts, routers, handlers, OpenAPI generation, or API modules."
  globs: ["packages/fake-be/src/orpc/**/*.ts"]
---

# oRPC API Layer

The API layer lives in `packages/fake-be/src/orpc`. It exposes an oRPC contract and router that the web and mobile apps call through generated OpenAPI clients.

## Module Layout

Each API domain lives under `packages/fake-be/src/orpc/api/<domain>/`. Use camelCase for multiword domain folder and file basenames, such as `managerProjects/managerProjects.models.ts`.

- `<domain>.models.ts`: API input and output Zod schemas plus exported API types. Exported schema names drive OpenAPI component names after the generator removes the `Schema` suffix.
- `<domain>.contract.ts`: public route definitions using `oc`.
- `<domain>.router.ts`: handler implementation.
- `<domain>.module.ts`: `defineApiModule({ contract, createRouter, extraSchemas?, robodevHidden?, robodevOwnedTables?, robodevRoles? })` wiring.

Add new modules to `packages/fake-be/src/orpc/api/modules.ts`. The root contract and router are collected from this registry.

Before implementing a new real feature, remove the demo `aliens` and `planets` registrations from `modules.ts`, including their imports and exported registry entries. Keep the `packages/fake-be/src/orpc/api/aliens` and `packages/fake-be/src/orpc/api/planets` folders in place as reference examples unless the team explicitly decides to delete the demo layer.

API models are not raw DB models, but they should reuse DB Zod schemas for persisted entity fields instead of redefining the same shape. Compose response schemas from `packages/fake-be/src/db/tables/*/*.schema.ts` with `.pick()`, `.omit()`, or `.extend()` when omitting sensitive fields such as `password` or adding computed API fields such as `creatorUsername`. Keep request body schemas API-specific when they need form validation, nullable input normalization with `.nullish()`, or fields that are not persisted exactly as submitted.

The OpenAPI generator registers route input/output schemas and nested exported Zod schemas from API model files as `components.schemas`. Keep exported Zod constants suffixed with `Schema` in code; Robospec removes that suffix when naming OpenAPI components. For example, `PlanetsGetResponseDtoSchema` becomes `PlanetsGetResponseDto`, and `PlanetImageDtoSchema` becomes `PlanetImageDto`. Choose model schema names deliberately because they become the public OpenAPI schema names used by generated clients and real-backend handoff. Use module `extraSchemas` only for schemas that are useful in OpenAPI but are not directly used or nested under a route input or output schema.

For Robodev request generation, modules can opt into OpenAPI tag metadata:

- `robodevHidden: true` hides internal modules such as auth, user, and media from Robodev output.
- `robodevOwnedTables: [tableNames.planet]` marks the DB tables owned by a module. Import `tableNames` from `packages/fake-be/src/db/schema-registry.ts` instead of hardcoding table names.
- User roles are defined in `packages/fake-be/src/roles`; mark default roles with `isDefault: true`.
- `robodevRoles: ["MANAGER", "ADMIN"]` explicitly assigns one or more roles to a module. Modules without `robodevRoles` use every role marked `isDefault`.

For generated app/spec JSON, distinguish DB-backed enums from derived or response-only enums:

- Map enum types only to DB columns that actually store enum values. DB-backed enum fields must have a real corresponding DBML enum-like column, not just a DTO enum name.
- For DB-backed enums that will map to real backend/Prisma enums, use the same wire values the real backend will return, typically PascalCase or UPPER_SNAKE enum members from the Prisma schema. Do not use lowercase fake-only enum values unless the real backend is explicitly expected to return lowercase values.
- Prefer semantic enum/status/type column names for persisted enums, such as `status`, `visibility`, `role`, `kind`, or `category`, and make the DTO field context clear that the value is persisted.
- For DTO-only enums, keep the enum in DTO definitions but mark the field context as `derived response-only value, not stored in DB`. Examples include friend direction, activity type, computed state labels, and UI grouping type.
- Never describe fields ending in `Id` or `Ids` as enum-backed. Columns such as `userId`, `authorId`, `requesterId`, `addresseeId`, `mediaId`, and `imageId` are string/UUID foreign keys, not enums.
- Do not map enums to foreign-key/id columns. For example, do not map a direction enum to `Friendship.requesterId` or `Friendship.addresseeId`, and do not map an activity-type enum to `Media.type` unless that DB column truly stores that feature's persisted enum.

For apps with multiple user roles that require distinct API surfaces or business workflows, also apply the role-based app structure rule.

## Contracts And Metadata

Every public route must define:

- `.route({ method, path, successStatus?, spec? })`
- `.input(...)` when the route accepts input
- `.output(...)`
- `.meta({ bl, acl? })`

Authenticated routes use `authSpec` in the route spec and `requireAuth` in the router.

The `meta.bl` string is exported into OpenAPI as `x-bl`. Write it for a future real backend generator:

- Describe the precise business behavior of the handler.
- Include validation, authorization, ownership checks, sorting, enrichment, side effects, and relevant not-found or forbidden behavior.
- Pretend the backing store is a real database.
- Do not mention `localStorage`, fake stores, repositories, Zod, oRPC, implementation helper names, or browser persistence.

Good: `Updates a planet only when the authenticated user owns it and returns the updated planet with creator information.`

Bad: `Updates a planet in localStorage using the fake repository.`

Use `acl` entries as `subject:action` strings, for example `planet:update`. These become OpenAPI `x-acl` metadata and add a `403` response.

## Router Handlers

Routers should implement business logic with repositories from `packages/fake-be/src/db/tables/*/*.repository.ts`. Keep direct store access out of oRPC handlers unless a cross-table operation cannot be expressed through repositories.

Use shared errors from `packages/fake-be/src/orpc/helpers/errors.ts` for API failures. Preserve existing behavior for authentication, not found, forbidden, and validation failures.

When contracts or models change, regenerate the API artifacts with `bun openapi:gen` so `packages/fake-be/openapi.generated.json`, `apps/fe/src/openapi`, and `apps/mobile/api` stay aligned.
