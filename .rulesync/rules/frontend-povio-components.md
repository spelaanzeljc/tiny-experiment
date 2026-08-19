---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Frontend interactive controls and typography must use Povio UI primitives instead of native replacements."
globs: ["apps/fe/src/**/*.{ts,tsx}"]
cursor:
  alwaysApply: false
  description: "Apply when creating or editing React components, controls, forms, tables, overlays, or user-facing text."
  globs: ["apps/fe/src/**/*.{ts,tsx}"]
---

# Use Povio UI Components

Use a component from `@povio/ui` whenever it provides the required primitive. Do not recreate an available Povio component with a native element plus Tailwind or custom CSS.

Required replacements include:

- `Button`, `TextButton`, or the appropriate Povio action component instead of a styled `<button>`.
- `TextInput`, `PasswordInput`, `TextArea`, checkbox, radio, select, autocomplete, and other Povio form controls instead of native form controls.
- `Typography` instead of directly styling user-facing headings, paragraphs, labels, or spans.
- `Table` or `InfiniteTable` instead of a hand-built native data table.
- `Modal`, `Confirmation`, `Drawer`, `BottomSheet`, `Menu`, `Tooltip`, or `ResponsivePopover` instead of custom overlay primitives.
- `FileUpload` instead of a directly exposed file input.
- Povio hooks such as `useForm` and `useToast` instead of parallel custom infrastructure.

Before creating a control:

1. Search `@povio/ui` usage in the repository.
2. Inspect the relevant example under `apps/fe/src/pages/(public)/code-examples`.
3. Use the existing Povio props and variants.
4. Apply the `povio-ui-styling` skill when choosing between local Tailwind, `UIConfig`, `UIOverrides`, a shared wrapper, or scoped CSS.

Native semantic and structural elements such as `<main>`, `<section>`, `<article>`, `<nav>`, `<form>`, `<div>`, and list elements remain appropriate for document structure and layout. Use TanStack Router navigation primitives for routing. This rule prohibits native replacements for available Povio UI behavior; it does not prohibit semantic HTML.

If Povio UI has no suitable primitive:

- Compose existing Povio components first.
- Put a reusable project-specific primitive under `apps/fe/src/components/shared/ui`.
- Preserve keyboard behavior, focus visibility, accessible names, disabled state, validation state, and loading state.
- Keep the exception narrow; do not introduce another general-purpose UI library.

When touching an existing native control that has a Povio equivalent, migrate it when the change is safely within scope. Do not expand a narrowly requested fix into a broad unrelated rewrite.
