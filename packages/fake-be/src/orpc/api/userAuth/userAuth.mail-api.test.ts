/* oxlint-disable jest/prefer-importing-jest-globals, vitest/no-importing-vitest-globals */
import { describe, expect, it } from "vitest";

import { UserAuthApi } from "@/openapi/userAuth/userAuth.api";
import { mailService } from "~/mail/mail.service";
import { setupFakeBackendTestFile } from "~/test/api-test-context";

setupFakeBackendTestFile();

describe("user auth mail integration", () => {
  it("lets another fake-backend module send through the shared mail service", async () => {
    await UserAuthApi.register({
      email: "mail-integration@example.com",
      name: "Mail Integration",
      password: "long-enough-password",
    });

    await expect(mailService.list()).resolves.toContainEqual(
      expect.objectContaining({
        to: [{ name: "Mail Integration", email: "mail-integration@example.com" }],
        subject: "Welcome to Tiny",
        text: "Welcome, Mail Integration! Your Tiny account is ready.",
      }),
    );
  });
});
