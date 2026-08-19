import { z } from "zod";

export const FakeMailDemoVariantSchema = z.enum(["text", "html", "recipients", "sequence"]);

export const FakeMailSendDemoBodySchema = z.object({
  variant: FakeMailDemoVariantSchema,
});

export const FakeMailSendDemoResponseSchema = z.object({
  mailIds: z.string().array().min(1),
});
