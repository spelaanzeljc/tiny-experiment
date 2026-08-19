/* oxlint-disable vitest/no-importing-vitest-globals */
import { describe, expect, it } from "vitest";

import { generateDBML } from "~/db/dbml-generator";

describe("dbml generator", () => {
  it("emits id primary keys as String pk fields", () => {
    expect(generateDBML().split("\n")).toStrictEqual(expect.arrayContaining(["  id String [pk]"]));
  });
});
