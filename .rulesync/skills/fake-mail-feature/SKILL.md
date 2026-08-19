---
name: fake-mail-feature
description: "Use when adding or changing fake-backend email sending, persisted mail fields, business-logic mail side effects, fake-mail demo variants, browser popup behavior, or the web fake mailbox."
targets: ["claudecode", "codexcli", "cursor"]
codexcli:
  short-description: Add or update fake mail workflows.
---

# Fake Mail Feature Skill

Use this workflow for application flows that send email while running against the in-browser fake backend.

## Sending Mail

1. Call `mailService.send()` from fake-backend business logic. Do not create `Mail` rows directly.
2. Always provide `to`, `subject`, and a plain-text `text` fallback. Add `html` only when the message benefits from formatting.
3. Use an address string for ordinary recipients or `{ name, email }` when a display name matters. The service also accepts arrays plus `cc`, `bcc`, and `replyTo`.
4. Keep feature-specific email composition next to the business operation that owns the side effect. Keep generic delivery, normalization, persistence, and notification behavior in `packages/fake-be/src/mail`.
5. Describe the email side effect in the owning oRPC route's `meta.bl` so real-backend generation preserves it.

Use the `userAuth` registration handler and its mail integration test as the reference for calling the shared service from another API module.

## Changing Mail Infrastructure

- Persist mail metadata through `packages/fake-be/src/db/tables/mail`; update its schema, registry, seed state, and tests together.
- Keep `mailService` framework-neutral and browser-independent. Publish new-mail notifications only after persistence succeeds.
- Keep frontend feature code on generated OpenAPI APIs. Direct fake-backend imports are allowed only in the root fake-mailbox developer integration.
- Enable the mailbox only when `AppConfig.api.useFakeBackend` is true.
- Render email HTML only in an iframe with an empty `sandbox`; never use `dangerouslySetInnerHTML` or enable scripts.
- Treat `window.open()` failure as normal browser behavior. Keep the email unread and offer a user-gesture fallback.
- Keep the fake-mail demo API module `robodevHidden: true`; it is developer tooling, not a real product endpoint.

## Demo And Validation

- Add reusable demo variants to the hidden `fakeMail` API and call them from `/code-examples/fake-mailbox` through generated queries.
- Run `bun openapi:gen` after demo contract changes.
- Test service validation, persistence, event publication, read state, popup success/failure, and sandboxing.
- Run `bun run test`, `bun ts:check`, `bun lint:check`, `bun format:check`, and manually exercise the code-example page in a real browser.
