---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Fake-backend mail service, persisted mailbox, popup integration, and demo conventions."
globs: ["packages/fake-be/src/{mail,db/tables/mail,orpc/api/fakeMail}/**/*.ts", "apps/fe/src/components/tiny/fake-mailbox/**/*.tsx", "apps/fe/src/pages/(public)/code-examples/fake-mailbox.tsx"]
cursor:
  alwaysApply: false
  description: "Apply when implementing email side effects or changing the fake web mailbox."
  globs: ["packages/fake-be/src/{mail,db/tables/mail,orpc/api/fakeMail}/**/*.ts", "apps/fe/src/components/tiny/fake-mailbox/**/*.tsx", "apps/fe/src/pages/(public)/code-examples/fake-mailbox.tsx"]
---

# Fake Mail Feature

Application business logic sends development email through `mailService.send()` in `packages/fake-be/src/mail`. The service validates and normalizes addresses, persists the message, and only then notifies browser subscribers. Do not write mail repository rows from feature handlers.

Every message requires recipients, a subject, and a non-empty plain-text body. HTML is optional and never replaces the text fallback. Attachments are not supported unless the mail schema, storage strategy, popup renderer, and real-backend contract are designed together.

`Mail` is an infrastructure table hidden from DBML and Robodev. The hidden `fakeMail` oRPC module exists only to drive the public code example; product features must expose their own business operations and document mail side effects in `meta.bl`.

Frontend feature code must continue to consume generated OpenAPI clients. The fake mailbox provider is the only direct fake-backend exception because it is root-level developer tooling. Install it only in fake-backend mode.

Each received message attempts its own browser popup. Popup blocking is expected: leave the message unread and offer an explicit user-gesture action. Render HTML in an iframe with an empty `sandbox`, without scripts or same-origin access. Plain text must use text content rather than HTML injection.

Keep the mailbox persisted, newest-first, and able to mark mail read. Resetting the fake store must clear it. Add service/API tests for mail behavior and manually verify allowed and blocked popups through `/code-examples/fake-mailbox`.
