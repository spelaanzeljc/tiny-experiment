/**
 * In-memory fake backend with localStorage persistence.
 * State persists across reloads. On parse error, resets to seed.
 * All entities are stored with camelCase fields, matching the fake API surface.
 */

import type { StoreState } from "~/db/schema-registry";
import { createSeedState } from "~/db/seed";
import { loadFromStorage, persistToStorage } from "~/db/storage";
import { fakeApiDelay } from "~/delay";

export type { StoreState } from "~/db/schema-registry";
export type { Media } from "~/db/tables/media/media.schema";
export type { Mail } from "~/db/tables/mail/mail.schema";
export type { PlanetLike } from "~/db/tables/planet-like/planet-like.schema";
export type { Planet } from "~/db/tables/planet/planet.schema";
export type { User } from "~/db/tables/user/user.schema";

function uuid() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  // oxlint-disable-next-line unicorn/number-literal-case
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // oxlint-disable-next-line unicorn/number-literal-case
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex
    .slice(8, 10)
    .join("")}-${hex.slice(10, 16).join("")}`;
}
function now() {
  return new Date().toISOString();
}

const MUTATING_ARRAY_METHODS = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"] as const;

function createPersistableArray<T>(arr: T[], persist: () => void): T[] {
  return new Proxy(arr, {
    get(target, prop: string) {
      const value = (target as unknown as Record<string, unknown>)[prop];
      if (
        typeof value === "function" &&
        MUTATING_ARRAY_METHODS.includes(prop as (typeof MUTATING_ARRAY_METHODS)[number])
      ) {
        return (...args: unknown[]) => {
          const result = (value as (...a: unknown[]) => unknown).apply(target, args);
          persist();
          return result;
        };
      }
      return value;
    },
  }) as T[];
}

function createPersistableState(rawState: StoreState): StoreState {
  const persist = () => persistToStorage(rawState);
  return new Proxy(rawState, {
    get(target, prop: string) {
      const value = (target as unknown as Record<string, unknown>)[prop];
      if (Array.isArray(value)) {
        return createPersistableArray(value, persist);
      }
      return value;
    },
    set(target, prop: string, value: unknown) {
      (target as unknown as Record<string, unknown>)[prop] = value;
      persist();
      return true;
    },
  }) as StoreState;
}

let rawState: StoreState = loadFromStorage();
let state: StoreState = createPersistableState(rawState);

export async function getStore(): Promise<StoreState> {
  await fakeApiDelay();
  return state;
}

export function resetStore(): void {
  rawState = createSeedState();
  state = createPersistableState(rawState);
  persistToStorage(rawState);
}

/** Replace entire state (e.g. for tests). */
export function setStore(newState: StoreState): void {
  rawState = newState;
  state = createPersistableState(rawState);
  persistToStorage(rawState);
}

/** Force persist to localStorage. Call after mutating nested objects (e.g. row.field = x) since Proxy only detects top-level assignments and array mutations. */
export function persistStore(): void {
  persistToStorage(rawState);
}

export const storeHelpers = {
  uuid,
  now,
};
