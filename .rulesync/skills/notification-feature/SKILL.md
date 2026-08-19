---
name: notification-feature
description: "Use when adding or changing product notifications, in-app notification inboxes, email or push templates, push tokens or Web Push subscriptions, notification preferences, delivery tracking, scheduled reminders, queue jobs, notification side effects, or frontend push registration in Tiny Template."
targets: ["claudecode", "codexcli", "cursor"]
codexcli:
  short-description: Build notification and delivery workflows.
---

# Notification Feature

Reuse Tiny's notification infrastructure before adding tables or services. Treat templates, recipient notifications, delivery attempts, queue jobs, transport artifacts, and audit activities as different concerns.

The existing infrastructure tables are also reserved migration specifications for the real monorepo. Keep them registered even when the fake app exposes no route for their lifecycle. Their presence prevents agents from creating same-named or semantically duplicate tables that would collide during migration.

## Inspect Existing Infrastructure

Read the relevant current implementations before designing or editing:

- `packages/fake-be/src/db/tables/pushNotificationTemplate`
- `packages/fake-be/src/db/tables/pushNotificationToken`
- `packages/fake-be/src/db/tables/emailTemplate`
- `packages/fake-be/src/db/tables/queueJob`
- `packages/fake-be/src/db/tables/activity`
- `packages/fake-be/src/db/tables/mail`
- `packages/fake-be/src/mail`
- `packages/fake-be/src/orpc/api/user` push-token routes

Also use `fake-backend-table`, `orpc-api-module`, `fake-backend-api-tests`, and `fake-mail-feature` when their trigger conditions apply.

## Reuse Each Existing Capability

### Templates

Use `PushNotificationTemplate` for reusable push title, body, image, default data, type, module, and description. Use `EmailTemplate` for reusable subject, text, HTML, recipients, and rendering-engine configuration.

Do not create a second push or email template table for a product feature. Add deterministic system templates through seed data and identify them with stable unique names such as `walk_offer_received`.

Keep feature-owned template names and variables explicit. Validate required variables before rendering. Keep a plain-text email fallback. Add locale or version fields only when the product genuinely requires localized or versioned templates.

### Recipient Tokens

Use `PushNotificationToken` and the authenticated `user.pushTokens` routes for device-token registration and removal. Do not add a duplicate `PushSubscription` table merely to rename the same concept.

Extend the existing token model only when the selected transport needs more persisted data. Full Web Push may require `endpoint`, `p256dh`, and `auth`; Expo, FCM, or APNs may only require provider and token. Keep credentials private and deactivate or remove permanently invalid tokens.

### Queues And Scheduling

Use `QueueJob` for deferred sending, fan-out, retries, and reminders. Store a processor name, safe payload, retry options, and `startAfter`. Make processors idempotent so retries do not create duplicate user notifications or send the same delivery twice.

Do not rely on an open browser for real scheduled delivery. The fake backend may simulate due work deterministically, but `meta.bl` must describe real server-side queue behavior.

### Email Transport

Use `mailService.send()` for fake-backend email delivery. Never insert `Mail` rows directly. Treat `Mail` as hidden local transport/mailbox infrastructure, not product notification history.

### Audit

Use `Activity` for administrative or operational audit events such as template changes and manual sends. Do not use it as a recipient notification inbox or delivery-attempt table.

## Add Product Tables Only For Missing Responsibilities

Add these only when the product requires them:

- `Notification`: one immutable recipient-facing event with recipient, event type, related resource, rendered title/body, safe action URL, read state, and timestamps.
- `NotificationDelivery`: one channel/device delivery attempt with status, attempts, provider ID, retry time, error, and delivery timestamps.
- `NotificationPreference`: per-user event/channel opt-in state, with mandatory transactional/security exceptions defined by business rules.
- `NotificationSchedule`: only when pending reminders need a first-class lifecycle beyond `QueueJob`.

Store rendered content on `Notification` as a snapshot when historical notifications must not change after a template edit. A template defines future rendering; it is not the delivered record.

Use foreign keys for concrete relations. Use a deliberate `resourceType` plus `resourceId` polymorphic reference only when notifications must link to many unrelated domain tables.

## Implement A Business Notification

1. Complete and persist the owning business operation.
2. Resolve recipients and enforce privacy.
3. Check event/channel preferences, except mandatory security or transactional messages.
4. Resolve the existing email and/or push template by stable name.
5. Validate and render template variables.
6. Create the recipient `Notification` when an in-app record is required.
7. Create delivery records or idempotent queue jobs.
8. Send email through `mailService` and push through the shared push transport/processor.
9. Record sanitized success or failure metadata.
10. Keep delivery failure from rolling back the completed business operation.

Describe recipients, template, channel, timing, privacy, idempotency, and failure behavior in the owning route's `meta.bl`.

Keep generic rendering, token management, queue mechanics, and transports shared without inventing a route-less API module solely for table ownership metadata. An infrastructure table may remain registered and seeded without a fake API lifecycle because it reserves the canonical schema for monorepo migration. Keep event selection and variables next to the business operation that owns them.

## Push Payload Safety

- Put only safe preview text, identifiers, and internal deep-link data in push payloads.
- Do not expose private addresses, access instructions, authentication secrets, or sensitive medical information.
- Treat action URLs as internal routes and validate them before navigation.
- Fan out to every active token owned by the recipient.
- Record or skip expired tokens and deactivate provider-rejected tokens.

## Frontend Workflow

- Consume only generated `@/openapi` queries and models.
- Request browser notification permission after a clear user gesture and explanation, never automatically on initial page load.
- Detect unsupported, denied, granted-but-unregistered, and registered states.
- Register the service worker and provider subscription, then call the generated user push-token mutation.
- Remove or detach the current device token during logout as required by the security model.
- Use generated notification queries for unread count, inbox pagination, mark-read actions, and preferences.
- Invalidate generated notification/user modules through mutation options rather than direct query-client access.
- Keep a normal list/inbox available; push is a delivery convenience, not the only way to receive important information.

Real background Web Push requires HTTPS, a service worker, server-held provider credentials or VAPID keys, and a real delivery worker. Do not claim that local fake-backend persistence can notify a closed browser.

## Tests And Verification

Test the changed responsibilities:

- Unique template names and deterministic system seeds
- Missing or invalid template variables
- Token ownership, refresh, removal, expiry, and invalidation
- Recipient and preference resolution
- Idempotent event and queue processing
- Template rendering and rendered-content snapshots
- Multi-device fan-out
- Retryable versus permanent delivery failure
- Mail persistence through `mailService`
- Privacy-safe payloads
- Notification read state and authorization
- Permission and unsupported-browser frontend states

Run `bun openapi:gen` after API changes, the relevant fake-backend tests, `bun ts:check`, and relevant frontend checks.
