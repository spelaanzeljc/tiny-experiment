---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Frontend list and table patterns for grids, Table, InfiniteTable, filters, and sorting."
globs: ["apps/fe/src/**/*.{ts,tsx}"]
cursor:
  alwaysApply: false
  description: "Apply when building or changing list pages, grids, tables, filters, sorting, pagination, or row actions."
  globs: ["apps/fe/src/**/*.{ts,tsx}"]
---

# Frontend Tables And Lists

The planets feature intentionally shows multiple list patterns while the template is still a prototype:

- Demo switcher: `apps/fe/src/components/features/planets/list/PlanetsPage.tsx`
- Grid list: `apps/fe/src/components/features/planets/list/PlanetsGridPage.tsx`
- Table list: `apps/fe/src/components/features/planets/list/PlanetsTablePage.tsx`
- Infinite table list: `apps/fe/src/components/features/planets/list/PlanetsInfiniteTablePage.tsx`
- Table wrappers and actions: `apps/fe/src/components/features/planets/list/table/*`

The `Segment` in `PlanetsPage` is demo-only. Real feature pages should usually choose one list pattern and use it consistently.

Prefer paginated API queries for database-backed collections. Use regular generated list queries only for data that is guaranteed to stay short, such as enums, compact option lists, or label-style endpoints.

Use `Table` from `@povio/ui` for small bounded table lists and `InfiniteTable` when incremental loading is useful for the feature. Infinite tables require a paginated backend endpoint and generated `use<Endpoint>Infinite` query. Even non-infinite collection views should normally be backed by a paginated endpoint unless the collection is intentionally bounded.

When a feature needs filters, define a filter schema on the API model, expose it through OpenAPI when useful, and use `useFilters` on the frontend. Put filter controls in a focused component such as `PlanetsFilters`. Use `as="filter"` on Povio UI filter controls.

When a feature needs sorting, expose an enum of sortable keys from the API layer and pass the generated enum schema into `dynamicColumns({ options: { sortable } })`. Use `useSorting` on the frontend and pass its `order` string to the generated query.

Use wrapper components around table primitives. A table wrapper should accept `TableWrapperProps<T>` or `InfiniteTableWrapperProps<T>` from `@povio/ui` and spread props into `Table` or `InfiniteTable`, while defining columns locally with a `getColumns` helper above the component.

Keep per-row actions in a small action component, such as `PlanetsTableActions`, and use a shared row-action wrapper when available so clicks do not accidentally trigger row navigation.
