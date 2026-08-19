/* oxlint-disable jest/no-hooks, vitest/no-importing-vitest-globals -- Browser storage globals must be isolated between tests. */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createSeedState, SEED_VERSION } from "~/db/seed";
import { loadFromStorage, persistToStorage } from "~/db/storage";

const STORAGE_KEY = "fake-be-state";

function createLocalStorage(): Storage {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

describe("fake-be storage seed versioning", () => {
  let localStorage: Storage = createLocalStorage();

  beforeEach(() => {
    localStorage = createLocalStorage();
    vi.stubGlobal("window", { localStorage });
    vi.stubGlobal("localStorage", localStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps valid user state written with the current seed version", () => {
    const state = createSeedState();
    state.Planet = [];

    persistToStorage(state);

    expect(loadFromStorage().Planet).toStrictEqual([]);
  });

  it("replaces state written with a stale seed version", () => {
    const state = createSeedState();
    state.Planet = [];
    persistToStorage(state);

    const stalePayload = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, unknown>;
    stalePayload.seedVersion = `${SEED_VERSION}-stale`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stalePayload));

    expect(loadFromStorage().Planet.length).toBeGreaterThan(0);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")).toMatchObject({
      seedVersion: SEED_VERSION,
    });
  });

  it("treats legacy payloads without a seed version as stale", () => {
    const state = createSeedState();
    state.Planet = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, state }));

    expect(loadFromStorage().Planet.length).toBeGreaterThan(0);
  });
});
