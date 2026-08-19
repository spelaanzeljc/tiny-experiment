import { mailService, type SendMailInput } from "~/mail/mail.service";
import type { ORPCRouterBuilder } from "~/orpc/api/router";

const demos = {
  text: [
    {
      to: "user@example.com",
      subject: "Plain-text demo",
      text: "This message demonstrates the fake mailbox plain-text renderer.",
    },
  ],
  html: [
    {
      to: { name: "Demo User", email: "user@example.com" },
      subject: "HTML demo",
      text: "This message demonstrates the fake mailbox HTML renderer.",
      html: "<main style='font-family: sans-serif'><h1>HTML mail</h1><p>This content is rendered in a <strong>sandboxed iframe</strong>.</p></main>",
    },
  ],
  recipients: [
    {
      from: { name: "Tiny Support", email: "support@tiny.local" },
      to: ["user@example.com", { name: "Second Recipient", email: "second@example.com" }],
      cc: "copy@example.com",
      bcc: "audit@example.com",
      replyTo: "reply@tiny.local",
      subject: "Multiple-recipient demo",
      text: "This message demonstrates to, cc, bcc, and reply-to metadata.",
    },
  ],
  sequence: [
    { to: "first@example.com", subject: "Sequence 1 of 3", text: "First popup attempt." },
    { to: "second@example.com", subject: "Sequence 2 of 3", text: "Second popup attempt." },
    { to: "third@example.com", subject: "Sequence 3 of 3", text: "Third popup attempt." },
  ],
} as const satisfies Record<string, readonly SendMailInput[]>;

export function createFakeMailRouter(os: ORPCRouterBuilder) {
  return {
    sendDemo: os.fakeMail.sendDemo.handler(async ({ input }) => {
      const sent = await Promise.all(demos[input.variant].map((message) => mailService.send(message)));
      return { mailIds: sent.map((mail) => mail.id) };
    }),
  };
}
