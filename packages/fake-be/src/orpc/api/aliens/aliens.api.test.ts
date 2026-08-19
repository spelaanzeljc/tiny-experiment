/* oxlint-disable jest/prefer-importing-jest-globals, vitest/no-importing-vitest-globals */
import { describe, expect, it } from "vitest";

import { AlienApi } from "@/openapi/alien/alien.api";
import { alienRepository } from "~/db/tables/alien/alien.repository";
import { storeHelpers } from "~/db/store";
import { setupFakeBackendTestFile } from "~/test/api-test-context";

const testContext = setupFakeBackendTestFile();

describe("alien API", () => {
  it("requires authentication", async () => {
    await expect(AlienApi.getLabels("")).rejects.toMatchObject({
      serverMessage: "Authentication is required",
    });
  });

  it("returns alphabetically sorted labels", async () => {
    const labels = await AlienApi.getLabels("", testContext.authConfig());

    expect(labels).toHaveLength(12);
    expect(labels.map(({ label }) => label)).toStrictEqual(labels.map(({ label }) => label).sort());
  });

  it("trims search and matches case-insensitively", async () => {
    const allLabels = await AlienApi.getLabels("", testContext.authConfig());
    const [target] = allLabels;
    const search = `  ${target.label.slice(1, -1).toUpperCase()}  `;

    await expect(AlienApi.getLabels(search, testContext.authConfig())).resolves.toContainEqual(target);
  });

  it("returns an empty list when no labels match", async () => {
    await expect(AlienApi.getLabels("does-not-exist", testContext.authConfig())).resolves.toStrictEqual([]);
  });

  it("limits results to 50 labels", async () => {
    const now = storeHelpers.now();
    await Promise.all(
      Array.from({ length: 55 }, (_, index) =>
        alienRepository.create({
          id: `alien-limit-${index}`,
          name: `Limit Alien ${String(index).padStart(2, "0")}`,
          createdAt: now,
          updatedAt: now,
        }),
      ),
    );

    const labels = await AlienApi.getLabels("Limit Alien", testContext.authConfig());
    expect(labels).toHaveLength(50);
    expect(labels.at(-1)?.label).toBe("Limit Alien 49");
  });
});
