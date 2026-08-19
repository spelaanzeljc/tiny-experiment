---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Frontend notification inbox, preferences, push permission, service worker, and token registration boundaries."
globs: ["apps/fe/src/**/*.{ts,tsx}", "apps/fe/public/**/*.{js,ts}"]
cursor:
  alwaysApply: false
  description: "Apply when frontend work handles notifications, push permission, service workers, push tokens, unread counts, or notification preferences."
  globs: ["apps/fe/src/**/*.{ts,tsx}", "apps/fe/public/**/*.{js,ts}"]
---

# Frontend Notifications

Use generated `@/openapi` queries, mutations, and models for notification history, preferences, and push-token registration. Do not import fake-backend repositories, tables, services, or oRPC contracts into frontend feature code.

Request push permission only after an explanatory UI and explicit user gesture. Never request it automatically during initial application load. Handle unsupported, default, denied, granted, registered, expired, and failed-registration states.

Register the service worker and provider subscription through a small browser integration, then persist the token/subscription through the generated authenticated user API. Clean up or detach the current device registration on logout when required by the security model.

Keep push payloads minimal and privacy-safe. Validate internal deep links before navigation. Never depend on push as the only record of an important event; provide a paginated in-app notification list and unread state.

Use generated mutation invalidation options for unread counts, mark-read actions, preferences, and token changes. Do not access the query client directly for generated API state.

Use `@povio/ui` for permission prompts, notification lists, menus/popovers, tags, forms, confirmations, and toasts. Use the `notification-feature` skill for the full workflow and `povio-ui-styling` for styling-layer decisions.
