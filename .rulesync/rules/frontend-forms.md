---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Frontend form patterns with Povio UI useForm, generated schemas, and formControl wiring."
globs: ["apps/fe/src/**/*.{ts,tsx}"]
cursor:
  alwaysApply: false
  description: "Apply when building or changing frontend forms, modals, edit pages, or input components."
  globs: ["apps/fe/src/**/*.{ts,tsx}"]
---

# Frontend Forms

Use `useForm` and form-aware inputs from `@povio/ui/tanstack` with generated OpenAPI Zod schemas for API-backed forms. The planets feature is the reference example while the template is still a prototype:

- Create form: `apps/fe/src/components/features/planets/list/PlanetCreateModal.tsx`
- Edit form: `apps/fe/src/components/features/planets/details/PlanetEditPage.tsx`

Prefer this shape:

```tsx
const form = useForm({
  zodSchema: PlanetsModels.PlanetsCreateInputSchema,
  defaultValues: { name: "" },
});
```

Pass form state into Povio UI inputs with `field={{ form, name: "fieldName" }}`. Use `form.handleSubmit`, `form.reset`, and `form.setFieldValue` for form actions, and `useFormValue(form, selector)` for reactive field reads.

Avoid local `useState`, custom `value`, and custom `onChange` plumbing for fields that belong to the form. Use TanStack Form's `form.Field` adapter only when a component cannot accept the Povio UI `field` binding.

Use generated OpenAPI queries and mutations for submit handlers. Keep toast feedback and navigation close to the feature interaction that owns them.
