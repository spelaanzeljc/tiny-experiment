import { z } from "zod";

import { storeHelpers } from "~/db/store";
import { mailRepository } from "~/db/tables/mail/mail.repository";
import { MailAddressSchema, MailSchema, type Mail, type MailAddress } from "~/db/tables/mail/mail.schema";

export type MailRecipient = string | MailAddress;

export interface SendMailInput {
  from?: MailRecipient;
  to: MailRecipient | MailRecipient[];
  cc?: MailRecipient | MailRecipient[];
  bcc?: MailRecipient | MailRecipient[];
  replyTo?: MailRecipient;
  subject: string;
  text: string;
  html?: string;
}

type MailListener = (mail: Mail) => void;

const listeners = new Set<MailListener>();
const RecipientSchema = z.union([z.email(), MailAddressSchema]);
const SendMailInputSchema = z.object({
  from: RecipientSchema.optional(),
  to: z.union([RecipientSchema, RecipientSchema.array().min(1)]),
  cc: z.union([RecipientSchema, RecipientSchema.array()]).optional(),
  bcc: z.union([RecipientSchema, RecipientSchema.array()]).optional(),
  replyTo: RecipientSchema.optional(),
  subject: z.string().trim().min(1),
  text: z.string().trim().min(1),
  html: z.string().trim().min(1).optional(),
});

function normalizeAddress(recipient: MailRecipient): MailAddress {
  return typeof recipient === "string" ? { email: recipient } : recipient;
}

function normalizeAddresses(recipients?: MailRecipient | MailRecipient[]): MailAddress[] {
  if (!recipients) {
    return [];
  }
  return (Array.isArray(recipients) ? recipients : [recipients]).map(normalizeAddress);
}

async function send(input: SendMailInput): Promise<Mail> {
  const parsed = SendMailInputSchema.parse(input);
  const mail = MailSchema.parse({
    id: storeHelpers.uuid(),
    from: normalizeAddress(parsed.from ?? { name: "Tiny", email: "no-reply@tiny.local" }),
    to: normalizeAddresses(parsed.to),
    cc: normalizeAddresses(parsed.cc),
    bcc: normalizeAddresses(parsed.bcc),
    replyTo: parsed.replyTo ? normalizeAddress(parsed.replyTo) : null,
    subject: parsed.subject,
    text: parsed.text,
    html: parsed.html ?? null,
    readAt: null,
    createdAt: storeHelpers.now(),
  });

  await mailRepository.create(mail);
  for (const listener of listeners) {
    try {
      listener(mail);
    } catch {
      // A developer-tool subscriber must not turn a persisted email into a failed business operation.
    }
  }
  return mail;
}

async function list(): Promise<Mail[]> {
  return [...(await mailRepository.list())].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function markRead(id: string): Promise<Mail | undefined> {
  const existing = await mailRepository.findById(id);
  if (!existing || existing.readAt) {
    return existing;
  }
  return mailRepository.update(id, { readAt: storeHelpers.now() });
}

function subscribe(listener: MailListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const mailService = { send, list, markRead, subscribe };
