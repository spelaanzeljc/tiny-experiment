---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Fake backend generated-client API business-logic test structure, isolation, authentication, fixtures, coverage, and verification."
globs: ["packages/fake-be/src/**/*.test.ts", "packages/fake-be/src/test/**/*.ts", "packages/fake-be/vitest.config.ts"]
cursor:
  alwaysApply: false
  description: "Apply when writing fake backend API tests, test helpers, fixtures, authentication setup, or Vitest configuration."
  globs: ["packages/fake-be/src/**/*.test.ts", "packages/fake-be/src/test/**/*.ts", "packages/fake-be/vitest.config.ts"]
---

# Fake Backend API Tests

Test fake-backend business logic through generated OpenAPI API functions from `apps/fe/src/openapi`, not through routers or repositories. Fake mode must use the in-process Axios-to-oRPC adapter without starting a server or making network requests. Keep feature assertions compatible with a future real-API test context.

Call `setupFakeBackendTestFile()` once at module scope in every `*.api.test.ts` file. It registers `beforeAll(resetStore)`, so each file receives one deterministic seed and tests within that file intentionally share state. Do not replace this with `beforeEach`. Keep tests sequential and use unique fixtures when shared file state is mutated.

Use `testContext.authConfig(userId?)` to mint an authenticated request config without calling login. Use `createTestUser()` for multi-user ownership cases. Direct repository access is allowed only for test arrangement that the domain API cannot express; endpoint behavior and assertions must still go through the generated client.

For every current endpoint, cover its relevant happy path, authentication, generated response validation, input validation, not-found behavior, ownership/forbidden behavior, nullable normalization, enrichment, filtering, sorting, pagination, limits, idempotency, user isolation, and side effects. Assert normalized generated-client errors such as `serverMessage`. Remember that generated request-schema validation may throw synchronously before reaching the fake backend.

The shared harness must fail if `fetch` is called, proving fake tests remain in-process. Disable simulated fake API delay in Vitest because latency is not business logic.

Run `bun --filter fake-be test`, `bun --filter fake-be ts:check`, `bun --filter fe lint:check`, and `bun run test`. Test-only changes do not require OpenAPI regeneration; contract or model changes do.
