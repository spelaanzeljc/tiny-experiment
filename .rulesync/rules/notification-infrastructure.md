---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Notification features reuse Tiny push/email templates, tokens, queues, mail transport, and activity infrastructure."
globs: ["packages/fake-be/src/**/*.ts"]
cursor:
  alwaysApply: false
  description: "Apply when backend work sends, schedules, stores, templates, or audits email, push, or in-app notifications."
  globs: ["packages/fake-be/src/**/*.ts"]
---

# Notification Infrastructure

Before adding notification storage or delivery behavior, inspect and reuse:

- `PushNotificationTemplate` for reusable push content.
- `EmailTemplate` for reusable email content.
- `PushNotificationToken` and authenticated user token routes for device registrations.
- `QueueJob` for deferred delivery, reminders, fan-out, and retries.
- `mailService.send()` for fake-backend email transport; never create `Mail` rows directly.
- `Activity` for administrative and operational audit, not the user inbox.

These registered tables are reserved shared schema specifications for later monorepo migration, even when the fake app has no API module or route that manages them. Keep their canonical names and shapes so generated work does not introduce same-named or semantically duplicate tables that clash during migration.

Do not create duplicate template, token/subscription, queue, mail, or audit tables inside a product domain. Search the registry before proposing a new table. Extend an existing infrastructure model only when the selected provider requires information it cannot currently represent.

Keep responsibilities separate:

- A template defines reusable future content.
- A product `Notification`, when needed, records one recipient-facing event and read state.
- A `NotificationDelivery`, when needed, records a channel/device attempt, retry, provider result, and failure.
- A queue job schedules or processes work.
- A mail row is a fake transport artifact.
- An activity is an administrative audit record.

Keep feature-specific event selection, recipients, variables, privacy rules, and side effects in the owning business module. Keep generic rendering, queuing, provider delivery, and token handling shared. A reserved infrastructure table may intentionally have no API lifecycle owner; do not invent an API module solely to claim its ownership metadata, and do not add admin endpoints merely to expose it.

Persist the business operation before dispatching its notification. Make queue and delivery processing idempotent. A delivery failure must not roll back a successful business operation. Describe notification recipients, template/channel, timing, and failure behavior in route `meta.bl`.

Never include secrets, exact private locations, access instructions, or other sensitive fields in push payloads. Store rendered notification content as a snapshot when template edits must not rewrite history.

Use the `notification-feature` skill for implementation details and verification.
