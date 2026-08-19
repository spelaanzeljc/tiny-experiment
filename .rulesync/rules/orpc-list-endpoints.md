---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "oRPC list, filter, sort, paginate, and infinite table endpoint conventions."
globs: ["packages/fake-be/src/orpc/**/*.ts", "apps/fe/src/components/**/*.{ts,tsx}"]
cursor:
  alwaysApply: false
  description: "Apply when adding or changing list, filter, sort, paginate, Table, or InfiniteTable features."
  globs: ["packages/fake-be/src/orpc/**/*.ts", "apps/fe/src/components/**/*.{ts,tsx}"]
---

# oRPC List Endpoints

Paginate endpoints are the default choice for entity collections. Prefer a `paginate` endpoint that accepts `PaginationInputSchema` or a module input schema created with `createPaginateInputSchema(FiltersSchema)`, returns `PaginationDtoSchema.extend({ items: ItemSchema.array() })`, and can power generated `use<Endpoint>Infinite` queries. Add or keep a plain `list` endpoint only when the result set is guaranteed to stay short, such as enums, compact option lists, label endpoints, or other bounded configuration data.

If a feature exposes both `list` and `paginate` for demo or compatibility reasons, share filter and sorting logic so grid, table, and infinite table views produce consistent results. The planets module is the reference example:

- Filter schema and sortable enum: `packages/fake-be/src/orpc/api/planets/planets.models.ts`
- List and paginate contracts: `packages/fake-be/src/orpc/api/planets/planets.contract.ts`
- Shared filter/sort handler logic: `packages/fake-be/src/orpc/api/planets/planets.router.ts`

When exposing filters for generated frontend helpers, define and export a domain filter schema such as `PlanetsFiltersSchema`. The OpenAPI generator discovers exported nested schemas used by route schemas, so do not also list them in module `extraSchemas`.

When exposing sorting, define a Zod enum of sortable keys such as `PlanetsSortableKeySchema` and validate the compact order string with `isValidOrder` from `packages/fake-be/src/orpc/helpers/sorting.ts`. Include only fields the backend actually supports sorting by. Expose the sortable enum through OpenAPI when frontend `dynamicColumns` needs it.

When a feature displays a database-backed collection, add a paginated endpoint even if the first frontend view is not an infinite table yet. Use `createPaginatedResponse` from `packages/fake-be/src/orpc/helpers/pagination.ts` and extend `PaginationDtoSchema` for the endpoint output. The shared `PaginationDtoSchema` intentionally contains only pagination metadata; each endpoint adds its own `items` array, which OpenAPI later emits as an endpoint-specific `*PaginateItem` component.

Sort and filter before slicing paginated responses so every page follows one stable global order.
