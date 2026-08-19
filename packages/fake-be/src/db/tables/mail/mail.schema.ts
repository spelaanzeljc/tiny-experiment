import { z } from "zod";

import { defineTable } from "~/db/table";

export const MailAddressSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email(),
});

export const MailSchema = z.object({
  id: z.string(),
  from: MailAddressSchema,
  to: MailAddressSchema.array().min(1),
  cc: MailAddressSchema.array(),
  bcc: MailAddressSchema.array(),
  replyTo: MailAddressSchema.nullable(),
  subject: z.string().min(1),
  text: z.string().min(1),
  html: z.string().nullable(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});

export type MailAddress = z.infer<typeof MailAddressSchema>;
export type Mail = z.infer<typeof MailSchema>;

export const mailTable = defineTable<"Mail", Mail, typeof MailSchema>({
  name: "Mail",
  schema: MailSchema,
  primaryKey: "id",
  columns: [
    { name: "id", type: "varchar", primaryKey: true },
    { name: "from", type: "text" },
    { name: "to", type: "text" },
    { name: "cc", type: "text" },
    { name: "bcc", type: "text" },
    { name: "replyTo", type: "text", nullable: true },
    { name: "subject", type: "varchar" },
    { name: "text", type: "text" },
    { name: "html", type: "text", nullable: true },
    { name: "readAt", type: "datetime", nullable: true },
    { name: "createdAt", type: "datetime" },
  ],
  dbml: { hidden: true },
});
