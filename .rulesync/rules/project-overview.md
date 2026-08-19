---
root: true
targets: ["claudecode", "codexcli", "cursor"]
description: "Project overview and Rulesync source-of-truth guidance."
globs: ["**/*"]
cursor:
  alwaysApply: true
  description: "Project overview and Rulesync source-of-truth guidance."
  globs: ["**/*"]
---

# Tiny Template AI Rules

This project is a Vite React frontend template with an in-browser fake backend.

Shared AI rules and skills are authored in `.rulesync/`. Generated files for Codex, Claude Code, and Cursor are local outputs and should be regenerated with `bun rules:gen`.

`apps/fe/src/pages/(public)/code-examples/*` contains temporary Povio UI showcase pages for template authors and AI agents. They demonstrate component usage patterns with simple literal example copy.

The demo planets and aliens features are also reference examples. When implementing a real app, remove their links from app navigation such as `apps/fe/src/components/layout/AppHeader.tsx` so they are not directly accessible in the product UI, but keep the example implementation available as a reference unless the team intentionally deletes the demo layer.

For mobile apps, Expo Router file routes are bundled even when a tab is hidden. When replacing the demo with a real app, remove demo route files from `apps/mobile/app/**`, including routes such as `apps/mobile/app/(app)/(tabs)/planets/*` and `apps/mobile/app/(app)/planets/*`, and remove matching Stack/Tab registrations. Keep non-route reference implementation files such as `apps/mobile/modules/planets/*` only if they are still useful as examples.

When an app has multiple user roles with distinct UI or business workflows, use the conditional role-based app structure rule. Do not apply role splitting to simple single-role apps or small permission differences.

Use the more specific generated rules for:

- Fake backend DB tables in `packages/fake-be/src/db`.
- oRPC API contracts, routers, OpenAPI metadata, labels endpoints, list endpoints, pagination, filtering, and sorting.
- Media upload resources, feature associations, and frontend FileUpload integration.
- Fake-backend mail sending, persisted mailbox behavior, browser popups, and the fake-mail demo.
- Notification templates, push tokens, queue jobs, delivery tracking, preferences, service workers, and frontend push registration.
- Frontend API boundaries around generated `@/openapi` queries and models.
- Povio UI and semantic Tailwind token usage.
- Frontend forms, tables/lists, `QueryAutocomplete`, translations, and component structure.
- Role-based frontend and oRPC structure when the app has multiple distinct user roles.
