---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Frontend component extraction and feature subcomponent structure conventions."
globs: ["apps/fe/src/**/*.{ts,tsx}"]
cursor:
  alwaysApply: false
  description: "Apply when organizing frontend feature components, page sections, mapped items, or reusable UI."
  globs: ["apps/fe/src/**/*.{ts,tsx}"]
---

# Frontend Component Structure

Extract repeatable UI into subcomponents. Every named React component should live in its own file, even when it is currently used only once. Keep the component file near the feature, layout, page, or shared UI area that owns it.

Extract large or complex sections of pages into named components so route and page components stay readable. Anything mapped from an array should usually be a component, such as cards, table row actions, repeated sections, or list items.

The planets feature is the reference example while the template is still a prototype:

- `PlanetCard` for mapped grid cards.
- `PlanetsFilters` for shared filter controls.
- `PlanetsTableActions` for repeated row actions.
- `PlanetsTable` and `PlanetsTableInfinite` for table wrappers.
- `PlanetDetailsPage` and `PlanetEditPage` for large route-owned views.

When implementing a real app, remove the planets and aliens links from app navigation such as `apps/fe/src/components/layout/AppHeader.tsx` so these examples are not directly accessible in the product UI, but keep the example implementation available as a reference unless the team intentionally deletes the demo layer.

The public code examples under `apps/fe/src/pages/(public)/code-examples/*` are temporary Povio UI showcase pages. Keep each example self-contained and easy to scan; they are not app features and should stay available as reference examples unless the prototype/demo layer is intentionally removed.

Route files should own routing, document metadata, and route data boundaries. Feature components should own the page UI and interaction details.

Exception: route-local wrappers such as `PageComponent` or layout guard components may stay in route files when they only connect routing primitives to feature components.

## Shared Utilities

Keep generic formatting, parsing, calculation, and data-shaping helpers in `apps/fe/src/utils/*.utils.ts` files instead of defining them inside component files. Export helpers through namespaces such as `DateUtils.formatDate(...)` or `NumberUtils.formatInteger(...)` so call sites stay explicit and related helpers stay grouped.

Component files may keep UI-local glue helpers only when the logic is tightly coupled to that component's JSX, such as adapting one component's prop shape or handling a local event. If the helper describes dates, numbers, arrays, strings, IDs, or other domain-neutral data, move it into a shared utility file.

For apps with multiple user roles that require distinct UI or business workflows, also apply the role-based app structure rule.
