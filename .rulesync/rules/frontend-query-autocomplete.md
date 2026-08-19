---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Frontend QueryAutocomplete usage for database-entity dropdowns with generated label queries and queryParams."
globs: ["apps/fe/src/**/*.{ts,tsx}"]
cursor:
  alwaysApply: false
  description: "Apply when a frontend form or filter needs a dropdown/search picker of database entities."
  globs: ["apps/fe/src/**/*.{ts,tsx}"]
---

# Frontend QueryAutocomplete

Use this pattern whenever the UI needs a dropdown/search picker of entities from the database, such as selecting a alien, company, project, user, category, or any other related row in a form or filter.

Use `QueryAutocomplete` for these database-entity dropdowns. It should call a generated labels endpoint such as `AliensQueries.useListLabels`, not load full related records into the form.

Reference examples:

- Create form: `apps/fe/src/components/features/planets/list/PlanetCreateModal.tsx`
- Edit form: `apps/fe/src/components/features/planets/details/PlanetEditPage.tsx`
- Filter control: `apps/fe/src/components/features/planets/list/PlanetsFilters.tsx`
- Isolated Povio UI showcase with mocked query and `queryParams`: `apps/fe/src/pages/(public)/code-examples/query-autocomplete.tsx`

The matching labels endpoint input schema must define `search`, usually as `search: z.string().optional()`, because `QueryAutocomplete` passes search text through that parameter.

If a labels endpoint needs extra context, pass it through `QueryAutocomplete` with `queryParams`. The matching labels endpoint input schema can include optional parameters beyond `search`, such as extra filters or flags that control how rows map into `{ id, label }`.

When the autocomplete belongs to a form, import it from `@povio/ui/tanstack` and prefer `field={{ form, name }}`. When it belongs to filters, read and write through the `useFilters` store.

The code-examples page is demo-only and may mock the query in the same file. Real app features should use generated labels queries from `@/openapi`.
