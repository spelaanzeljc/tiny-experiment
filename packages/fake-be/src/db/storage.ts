/**
 * localStorage persistence for fake-be.
 * On parse error (out-of-sync schema), resets to seed.
 */

import { type StoreState, parseStoreState } from "~/db/schema-registry";
import { createSeedState, SEED_VERSION } from "~/db/seed";

const STORAGE_KEY = "fake-be-state";
const STORAGE_VERSION = 1;

interface StoredState {
  version?: number;
  seedVersion?: string;
  state?: unknown;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function resetToSeed(): StoreState {
  const state = createSeedState();
  persistToStorage(state);
  return state;
}

export function loadFromStorage(): StoreState {
  if (!isBrowser()) {
    return createSeedState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return resetToSeed();
    }

    const parsed = JSON.parse(raw) as StoredState;
    if (parsed.version !== STORAGE_VERSION || parsed.seedVersion !== SEED_VERSION || !parsed.state) {
      return resetToSeed();
    }

    return parseStoreState(parsed.state) ?? resetToSeed();
  } catch {
    return resetToSeed();
  }
}

export function persistToStorage(state: StoreState): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const payload = { version: STORAGE_VERSION, seedVersion: SEED_VERSION, state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / security errors
  }
}
