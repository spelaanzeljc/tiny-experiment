/* oxlint-disable jest/prefer-ending-with-an-expect, vitest/no-importing-vitest-globals */
import { createSeedState } from "~/db/seed";
import { resetStore, setStore } from "~/db/store";
import { mailService } from "~/mail/mail.service";
import { describe, expect, it, vi } from "vitest";

describe("fake mail service", () => {
  it("normalizes, persists, sorts, and publishes outgoing mail", async () => {
    setStore(createSeedState());
    const received: string[] = [];
    const unsubscribe = mailService.subscribe((mail) => received.push(mail.id));

    const mail = await mailService.send({
      from: { name: "Support", email: "support@example.com" },
      to: ["user@example.com", { name: "Other", email: "other@example.com" }],
      cc: "copy@example.com",
      bcc: "hidden@example.com",
      replyTo: "reply@example.com",
      subject: "  Welcome  ",
      text: "  Hello there  ",
      html: "<strong>Hello there</strong>",
    });

    expect(mail).toMatchObject({
      from: { name: "Support", email: "support@example.com" },
      to: [{ email: "user@example.com" }, { name: "Other", email: "other@example.com" }],
      cc: [{ email: "copy@example.com" }],
      bcc: [{ email: "hidden@example.com" }],
      replyTo: { email: "reply@example.com" },
      subject: "Welcome",
      text: "Hello there",
      readAt: null,
    });
    expect((await mailService.list()).map((item) => item.id)).toStrictEqual([mail.id]);
    unsubscribe();
    expect(received).toStrictEqual([mail.id]);
  });

  it("marks mail read once", async () => {
    setStore(createSeedState());
    const mail = await mailService.send({ to: "user@example.com", subject: "Read me", text: "Body" });
    const first = await mailService.markRead(mail.id);
    const second = await mailService.markRead(mail.id);

    expect(first?.readAt).toMatch(/\S/);
    expect(second?.readAt).toBe(first?.readAt);
  });

  it("rejects invalid mail without persisting or publishing", async () => {
    setStore(createSeedState());
    const listener = vi.fn<() => void>();
    const unsubscribe = mailService.subscribe(listener);

    await expect(mailService.send({ to: "invalid", subject: "", text: "" })).rejects.toThrow("Invalid");
    await expect(mailService.list()).resolves.toStrictEqual([]);
    unsubscribe();
    expect(listener).not.toHaveBeenCalled();
  });

  it("clears persisted mail with the fake store reset", async () => {
    setStore(createSeedState());
    await mailService.send({ to: "user@example.com", subject: "Temporary", text: "Body" });

    resetStore();

    await expect(mailService.list()).resolves.toStrictEqual([]);
  });

  it("does not fail a persisted send when a developer subscriber throws", async () => {
    setStore(createSeedState());
    const unsubscribe = mailService.subscribe(() => {
      throw new Error("subscriber failed");
    });

    await expect(
      mailService.send({ to: "user@example.com", subject: "Still delivered", text: "Body" }),
    ).resolves.toMatchObject({ subject: "Still delivered" });
    unsubscribe();
    await expect(mailService.list()).resolves.toHaveLength(1);
  });
});
