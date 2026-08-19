---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "oRPC labels endpoint conventions for database-entity dropdowns and QueryAutocomplete."
globs: ["packages/fake-be/src/orpc/**/*.ts", "apps/fe/src/components/**/*.{ts,tsx}"]
cursor:
  alwaysApply: false
  description: "Apply when an entity needs a labels endpoint for frontend dropdown/search picker usage."
  globs: ["packages/fake-be/src/orpc/**/*.ts", "apps/fe/src/components/**/*.{ts,tsx}"]
---

# oRPC Labels Endpoints

When the frontend needs a dropdown/search picker of database entities, add a lightweight labels endpoint to that entity's oRPC domain and consume it with `QueryAutocomplete`.

Use this pattern for selecting related rows such as aliens, users, companies, projects, categories, or any other database entity in a form or filter.

Labels endpoints should return compact label rows instead of full records. The endpoint should return an array of objects with this shape:

```ts
{
  id: string;
  label: string;
}
```

Use the shared `LabelSchema` from `packages/fake-be/src/orpc/api/common/common.models.ts` when defining labels outputs.

The aliens labels endpoint is the reference example:

- `packages/fake-be/src/orpc/api/aliens/aliens.models.ts`
- `packages/fake-be/src/orpc/api/aliens/aliens.contract.ts`
- `packages/fake-be/src/orpc/api/aliens/aliens.router.ts`
- Frontend usage in `apps/fe/src/components/features/planets/list/PlanetCreateModal.tsx`, `PlanetEditPage.tsx`, and `PlanetsFilters.tsx`

Labels endpoint input schemas must include a `search` field because `QueryAutocomplete` passes the user's search text through that parameter. The `search` value should accept `undefined` or an empty value, for example `search: z.string().optional()`.

Labels input schemas may also include additional optional parameters. These can act as extra filters or can control which fields are mapped into `id` and `label`. The frontend can pass those values through `QueryAutocomplete` with its `queryParams` prop.

Keep labels endpoints capped to a practical number of results, commonly 50, and sort labels predictably.
