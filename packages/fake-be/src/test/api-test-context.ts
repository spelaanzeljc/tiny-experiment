/* oxlint-disable jest/no-hooks -- File-level database isolation is the intended test harness contract. */
/* oxlint-disable vitest/no-importing-vitest-globals */
import { afterAll, beforeAll, expect, vi } from "vitest";

import { resetStore, storeHelpers } from "~/db/store";
import { IDS } from "~/db/seed/ids";
import { userRepository } from "~/db/tables/user/user.repository";
import type { User } from "~/db/tables/user/user.schema";
import { createAuthTokens } from "~/orpc/helpers/tokens";

export interface FakeBackendTestContext {
  authConfig(userId?: string): { headers: { Authorization: string } };
  createTestUser(overrides?: Partial<User>): Promise<User>;
  seedIds: typeof IDS;
}

export function authConfig(userId: string = IDS.users.demo) {
  const { accessToken } = createAuthTokens(userId);
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export async function createTestUser(overrides: Partial<User> = {}): Promise<User> {
  const id = overrides.id ?? storeHelpers.uuid();
  const now = storeHelpers.now();
  return userRepository.create({
    id,
    email: overrides.email ?? `${id}@example.com`,
    name: overrides.name ?? `Test User ${id}`,
    roles: overrides.roles ?? ["CLIENT"],
    password: overrides.password ?? "test-password",
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  });
}

/** Resets once per test module and proves fake-mode API calls never use fetch. */
export function setupFakeBackendTestFile(): FakeBackendTestContext {
  const fetchSpy = vi.spyOn(globalThis, "fetch");

  beforeAll(() => {
    resetStore();
    fetchSpy.mockClear();
  });

  afterAll(() => {
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  return { authConfig, createTestUser, seedIds: IDS };
}
