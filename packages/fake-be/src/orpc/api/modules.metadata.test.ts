/* oxlint-disable vitest/no-importing-vitest-globals, jest/prefer-importing-jest-globals, vitest/prefer-to-be-falsy */
import { describe, expect, it } from "vitest";

import { dbTables } from "~/db/schema-registry";
import { apiModules } from "~/orpc/api/modules";
import { apiSpecModules } from "~/orpc/api/spec-modules";

const infrastructureTablesWithoutApiLifecycle: ReadonlySet<string> = new Set([
  "Activity",
  "EmailTemplate",
  "PushNotificationTemplate",
  "QueueJob",
]);

describe("robodev module metadata", () => {
  it("keeps spec contracts aligned with runtime router modules", () => {
    expect(Object.keys(apiSpecModules)).toStrictEqual(Object.keys(apiModules));
    for (const name of Object.keys(apiSpecModules) as (keyof typeof apiSpecModules)[]) {
      expect(apiModules[name].contract).toBe(apiSpecModules[name].contract);
    }
  });

  it("hides every registered API module", () => {
    expect(Object.entries(apiModules).filter(([, module]) => module.robodevHidden !== true)).toStrictEqual([]);
  });

  it("assigns every API-managed database table to a hidden module", () => {
    const ownedTables: ReadonlySet<string> = new Set(
      Object.values(apiModules).flatMap((module) =>
        "robodevOwnedTables" in module ? [...(module.robodevOwnedTables ?? [])] : [],
      ),
    );

    expect(
      dbTables
        .map((table) => table.name)
        .filter((name) => !infrastructureTablesWithoutApiLifecycle.has(name))
        .filter((name) => !ownedTables.has(name)),
    ).toStrictEqual([]);
  });

  it("does not register the rocket domain", () => {
    expect(Object.keys(apiModules).some((name) => name.toLowerCase().includes("rocket"))).toBe(false);
    expect(dbTables.some((table) => table.name.toLowerCase().includes("rocket"))).toBe(false);
  });
});
