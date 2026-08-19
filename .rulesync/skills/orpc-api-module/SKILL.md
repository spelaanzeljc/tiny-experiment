---
name: orpc-api-module
description: "Use when adding or changing an oRPC API domain, endpoint, contract, router handler, OpenAPI metadata, or generated frontend API usage."
targets: ["claudecode", "codexcli", "cursor"]
codexcli:
  short-description: Add or update oRPC API modules.
---

# oRPC API Module Skill

Use this workflow for API work in `packages/fake-be/src/orpc`.

1. Inspect a nearby domain.
2. Use camelCase for multiword API domain folder and file basenames, such as `managerProjects/managerProjects.models.ts`.
3. Define API schemas in `<domain>.models.ts`. Reuse DB Zod schemas for persisted entity fields with `.pick()`, `.omit()`, or `.extend()` instead of redefining the same base shape. Keep request bodies API-specific when they need validation or input normalization.
   - Keep exported Zod constants suffixed with `Schema` in code. Robospec removes that suffix for OpenAPI component names, such as `PlanetsGetResponseDtoSchema` becoming `PlanetsGetResponseDto`. Name schemas deliberately because generated web/mobile clients and real-backend handoff use those names.
   - When a frontend form or filter needs a dropdown/search picker of database entities, use the `QueryAutocomplete` + labels endpoint pattern. Define lightweight labels input/output schemas in the selected entity's domain. Labels outputs should use shared `LabelSchema` and return `{ id, label }[]`. Labels inputs must define `search`, usually as `search: z.string().optional()`, because `QueryAutocomplete` passes search text through that parameter. Inputs can also include optional extra parameters that frontend `queryParams` can pass.
   - For database-backed collections, prefer paginated endpoints by default. Reuse `PaginationInputSchema` or `createPaginateInputSchema(FiltersSchema)` and extend `PaginationDtoSchema` with the endpoint item type.
   - Use plain list endpoints only for result sets guaranteed to stay short, such as enums, compact option lists, labels, or bounded configuration data.
   - For filtered collections, define a reusable filters schema. For sortable collections, define a Zod enum of supported sortable keys and validate order strings with `isValidOrder`.
4. Define routes in `<domain>.contract.ts` with `oc`.
   - Add `.route({ method, path, successStatus?, spec? })`.
   - Add `authSpec` to authenticated routes
   - Add `.input(...)` and `.output(...)` as needed.
   - Add `.meta({ bl, acl? })` to every route.
5. Write `meta.bl` for a real backend generator:
   - Describe business behavior precisely.
   - Mention auth, ownership, validation, sorting, enrichment, side effects, and failure behavior when relevant.
   - Do not mention localStorage, fake stores, repositories, browser persistence, Zod, or implementation helper names.
6. Implement handlers in `<domain>.router.ts`.
   - Use `requireAuth` for authenticated routes.
   - Use repositories from `packages/fake-be/src/db/tables`.
   - Use shared errors such as `notFound` and `forbidden`.
   - Use `storeHelpers.uuid()` and `storeHelpers.now()` for new IDs and timestamps.
   - Keep label endpoints capped and predictably sorted.
   - Share filter/sort logic when both normal list and paginated list endpoints exist.
   - Sort and filter before slicing paginated responses.
7. Wire the domain with `<domain>.module.ts` and add it to `packages/fake-be/src/orpc/api/modules.ts`.
   - Use `robodevHidden: true` for internal modules that should not appear in Robodev request output.
   - Use `robodevOwnedTables: [tableNames.example]` for modules that own DB tables, importing `tableNames` from `packages/fake-be/src/db/schema-registry.ts`.
   - User roles live in `packages/fake-be/src/roles`; mark default roles with `isDefault: true`.
   - Use `robodevRoles: ["ROLE_A", "ROLE_B"]` when a module is explicitly available to one or more roles. Omit `robodevRoles` only when the module should use the default role set.
   - For generated app/spec JSON, map enum types only to DB columns that actually store enum values. Mark DTO-only enums as `derived response-only value, not stored in DB`, and never describe `Id` or `Ids` foreign-key fields as enum-backed.
   - For DB-backed enums that will map to real backend/Prisma enums, use the same wire values the real backend will return, typically PascalCase or UPPER_SNAKE enum members from the Prisma schema. Do not use lowercase fake-only enum values unless the real backend is explicitly expected to return lowercase values.
8. Do not manually list route input/output schemas or their exported nested model schemas in `extraSchemas`; OpenAPI generation derives those from the contract and model files and names components from exported model schema names after removing the `Schema` suffix. Use `extraSchemas` only for schemas not directly used or nested by a route.
9. Run `bun openapi:gen`.
10. Update frontend code to import only generated web `@/openapi` queries, models, and modules from `apps/fe/src/openapi`, or generated mobile API modules from `apps/mobile/api`. For generated mutations, use mutation options for invalidation: the current module invalidates by default, and dependent modules should be passed through `invalidateModules`.
11. Add or update generated-client business-logic tests for changed routes using the `fake-backend-api-tests` skill and run `bun --filter fake-be test`.
12. Run `bun ts:check`.

If generated frontend files do not reflect a route change, inspect `packages/fake-be/openapi.generated.json` first, then the generated web files in `apps/fe/src/openapi` or mobile files in `apps/mobile/api`.
