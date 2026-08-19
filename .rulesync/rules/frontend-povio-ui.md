---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Frontend UI uses Povio UI primitives first and semantic Tailwind tokens."
globs: ["apps/fe/src/**/*.{ts,tsx,css}"]
cursor:
  alwaysApply: false
  description: "Apply when editing frontend UI, styling, layout, components, or CSS."
  globs: ["apps/fe/src/**/*.{ts,tsx,css}"]
---

# Frontend UI

## Use `@povio/ui` First

Always use components and hooks from `@povio/ui` when a suitable primitive exists, including `Button`, `Typography`, `Table`, `Modal`, `Confirmation`, `TextButton`, `TextInput`, `TextArea`, `PasswordInput`, `FileUpload`, `useForm`, `useToast`, and `Tag`.

Create project-specific UI only when `@povio/ui` does not provide the needed primitive. Shared custom primitives live under `apps/fe/src/components/shared/ui`.

Feature components should compose existing layout and shared primitives such as `PageHeader`, `BackHeader`, `LoadingState`, `ErrorText`, and `Card` before introducing new wrappers.

## Temporary Povio UI Examples

`apps/fe/src/pages/(public)/code-examples/*` is a temporary example sheet for `@povio/ui` usage. It exists to help template users and AI agents see small, isolated examples without needing a full feature flow.

Current example pages include:

- `apps/fe/src/pages/(public)/code-examples/buttons.tsx` for button variants and icon button patterns.
- `apps/fe/src/pages/(public)/code-examples/inputs.tsx` for standalone Povio UI input primitives.
- `apps/fe/src/pages/(public)/code-examples/overlays.tsx` for overlay-style components such as `Modal`, `Confirmation`, `Drawer`, `BottomSheet`, `ResponsivePopover`, `Tooltip`, and `Menu`.
- `apps/fe/src/pages/(public)/code-examples/query-autocomplete.tsx` for an isolated `QueryAutocomplete` example with a mocked query and `queryParams`.
- `apps/fe/src/pages/(public)/code-examples/text.tsx` for typography reference examples.
- `apps/fe/src/pages/(public)/code-examples/toasts.tsx` for toast usage examples.

Do not treat these pages as app features or production IA. When implementing a real app, remove the demo planets and aliens links from app navigation such as `apps/fe/src/components/layout/AppHeader.tsx` so the examples are not directly accessible in the product UI, but keep the example code available as a reference unless the team intentionally deletes the demo layer.

## Tailwind Tokens

The default Tailwind color palette is removed in `apps/fe/src/styles/base.css`. Do not use default color utilities such as:

- `text-red-500`
- `bg-blue-600`
- `border-gray-200`
- `ring-emerald-400`

Use semantic tokens exported from Figma in `apps/fe/src/styles/theme.css` and exposed through Tailwind, for example:

- Surface, fill, and outline: `bg-elevation-fill-default-1`, `border-elevation-outline-default-1`
- Text: `text-text-default-1`, `text-text-default-2`, `text-text-error-1`
- Interactive: `bg-interactive-contained-primary-idle`, `hover:bg-interactive-contained-primary-hover`

Do not manually edit `apps/fe/src/styles/theme.css`; it is exported from Figma. If a hand-written semantic token or Tailwind theme mapping is needed, add it only in `apps/fe/src/styles/base.css` before referencing it from JSX or CSS.

## Forms And API Data

For forms backed by API requests, prefer generated OpenAPI model schemas with `@povio/ui` `useForm`, for example `useForm({ zodSchema: UserModels.UpdateProfileBodySchema })`.

Use generated OpenAPI queries and mutations for all API state. Keep API side effects, toast feedback, loading states, and query invalidation close to the feature that owns the interaction. For mutation invalidation, pass generated mutation options such as `invalidateModules`; do not import `queryClient` into feature code for generated API queries.
