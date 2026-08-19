/* oxlint-disable jest/prefer-importing-jest-globals, vitest/no-importing-vitest-globals */
import { describe, expect, it } from "vitest";

import { FakeMailApi } from "@/openapi/fakeMail/fakeMail.api";
import { mailService } from "~/mail/mail.service";
import { setupFakeBackendTestFile } from "~/test/api-test-context";

setupFakeBackendTestFile();

describe("fake mail demo API", () => {
  it.each([
    ["text", 1],
    ["html", 1],
    ["recipients", 1],
    ["sequence", 3],
  ] as const)("sends the %s demo through the mail service", async (variant, count) => {
    const before = (await mailService.list()).length;
    const response = await FakeMailApi.sendDemo({ variant });

    expect(response.mailIds).toHaveLength(count);
    await expect(mailService.list()).resolves.toHaveLength(before + count);
  });
});
