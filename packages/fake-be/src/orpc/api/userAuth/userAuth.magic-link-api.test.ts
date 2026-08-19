/* oxlint-disable jest/prefer-importing-jest-globals, vitest/no-importing-vitest-globals */
import { describe, expect, it } from "vitest";

import { UserAuthApi } from "@/openapi/userAuth/userAuth.api";
import { mailService } from "~/mail/mail.service";
import { setupFakeBackendTestFile } from "~/test/api-test-context";

setupFakeBackendTestFile();

function extractMagicCode(html: string): string {
  const href = /href="([^"]+)"/.exec(html)?.[1];
  expect(href).toBeDefined();
  const url = new URL(href!, "http://localhost");
  expect(url.pathname).toBe("/api/user/auth/magic-link/callback");
  expect(url.searchParams.get("type")).toBe("magic");
  return url.searchParams.get("code")!;
}

describe("user auth magic link", () => {
  it("sends the real-backend-compatible magic email and consumes its code once", async () => {
    await expect(UserAuthApi.generate("USER@EXAMPLE.COM")).resolves.toStrictEqual({
      status: "ok",
      code: "ok",
      message: "If you entered a valid email, you'll receive an email shortly",
    });

    const mail = (await mailService.list()).at(-1);
    expect(mail).toMatchObject({
      to: [{ email: "user@example.com" }],
      subject: "Magic Link",
      text: "Click here to log in",
    });
    const code = extractMagicCode(mail!.html!);

    await expect(UserAuthApi.consume(code)).resolves.toStrictEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    await expect(UserAuthApi.consume(code)).rejects.toMatchObject({
      serverMessage: "Invalid or expired code",
    });
  });

  it("uses the same response and sends no email for an unknown identity", async () => {
    const mailCount = (await mailService.list()).length;

    await expect(UserAuthApi.generate("missing@example.com")).resolves.toStrictEqual({
      status: "ok",
      code: "ok",
      message: "If you entered a valid email, you'll receive an email shortly",
    });
    await expect(mailService.list()).resolves.toHaveLength(mailCount);
  });

  it("rejects an invalid code", async () => {
    await expect(UserAuthApi.consume("invalid-code")).rejects.toMatchObject({
      serverMessage: "Invalid or expired code",
    });
  });
});
