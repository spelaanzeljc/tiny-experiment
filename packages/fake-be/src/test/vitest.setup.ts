/* oxlint-disable jest/prefer-ending-with-an-expect, vitest/no-importing-vitest-globals */
import { vi } from "vitest";
import "@/config/i18n";

vi.mock(import("~/delay"), () => ({
  FAKE_API_DELAY_MS: 50 as const,
  fakeApiDelay: () => Promise.resolve(),
}));
