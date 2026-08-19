---
name: fake-backend-api-tests
description: "Use when adding or changing fake-backend business-logic tests, generated OpenAPI client API tests, fake-be test fixtures, authentication helpers, per-file database isolation, or planets/aliens-style endpoint coverage."
---

# Fake Backend API Tests

Use this workflow for API business-logic tests in `packages/fake-be`.

1. Inspect the domain contract, router, models, seed IDs, and an existing `*.api.test.ts` suite. Derive coverage from every route's `meta.bl`, authentication, validation, ownership, enrichment, filtering, sorting, pagination, side effects, idempotency, and errors.
2. Test through generated API functions from `apps/fe/src/openapi`, such as `PlanetApi` or `AlienApi`. Do not call routers directly. This preserves generated schema validation and lets the same assertions move to a real HTTP backend later.
3. Use `setupFakeBackendTestFile()` from `~/test/api-test-context` once at module scope. It registers `beforeAll(resetStore)`, so the database resets once per test file, not before every test.
   - Tests in one file intentionally share state and must run sequentially.
   - Use separate files for independent seeded lifecycles.
   - Use unique fixture IDs when several tests mutate shared file state.
4. Authenticate with `testContext.authConfig(userId?)`. It mints a token directly and returns request config for the generated client; do not call the login endpoint unless authentication itself is under test.
5. Use `testContext.createTestUser()` for ownership and multi-user cases. Keep direct repositories limited to arranging fixtures that cannot be created through the domain under test, such as controlled media states or more than 50 label rows.
6. Cover every endpoint with its meaningful behavior:
   - Assert unauthenticated failure for authenticated routes.
   - Cover the happy path and returned enrichment.
   - Cover validation, not-found, forbidden/ownership, and nullable normalization branches.
   - Cover stable filtering, sorting, pagination boundaries, counts, and limits for collection endpoints.
   - Cover idempotency and user isolation for repeatable actions such as likes.
   - Assert generated-client errors using normalized properties such as `serverMessage`; client-side generated schema failures can throw synchronously.
7. Keep fake transport in-process. The shared harness spies on `fetch` and fails the file if a generated-client call reaches the network. `vitest.setup.ts` removes simulated API latency because latency is not business logic.
8. Add new test files under the corresponding API domain with a `*.api.test.ts` suffix. Use focused files such as read, write, and action suites when stateful scenarios benefit from separate file-level seeds.
9. When a contract gains or removes a route, update API tests in the same change and verify every current route is exercised through its generated API function.
10. Verify with:
    - `bun --filter fake-be test`
    - `bun --filter fake-be ts:check`
    - `bun --filter fe lint:check`
    - `bun run test`

Do not regenerate OpenAPI artifacts for test-only changes. Regenerate them when the contract or models change, then write tests against the updated generated client.
