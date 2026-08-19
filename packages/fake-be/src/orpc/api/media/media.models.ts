import { z } from "zod";

export const MEDIA_RESOURCE_NAMES = ["small-image", "large-image", "compressed-file", "document", "any"] as const;

export const MediaResourceNameSchema = z.string().min(1);
export const MediaUploadMethodSchema = z.string().min(1);

export const MediaUploadRequestSchema = z.object({
  resourceName: MediaResourceNameSchema.optional(),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  mimeType: z.string().min(1).optional(),
  method: MediaUploadMethodSchema.optional(),
});

export const MediaUploadInstructionsResponseSchema = z.object({
  id: z.string(),
  method: MediaUploadMethodSchema,
  url: z.string(),
  fields: z.array(z.tuple([z.string(), z.string()])),
  provider: z.string().optional(),
});

export type MediaResourceName = z.infer<typeof MediaResourceNameSchema>;
export type MediaUploadMethod = z.infer<typeof MediaUploadMethodSchema>;
