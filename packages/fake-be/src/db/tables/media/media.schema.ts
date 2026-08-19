import { z } from "zod";

import { defineTable } from "~/db/table";

export const MediaSchema = z.object({
  id: z.string(),
  key: z.string(),
  provider: z.string(),
  resourceName: z.string(),
  meta: z.unknown().nullable(),
  fileName: z.string(),
  fileSize: z.number().int(),
  mimeType: z.string(),
  uploaded: z.string().nullable(),
  validated: z.string().nullable(),
  deleted: z.string().nullable(),
  loOid: z.number().int().nullable(),
  module: z.string().nullable(),
  type: z.string().nullable(),
  resourceId: z.string().nullable(),
  userId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Media = z.infer<typeof MediaSchema>;

export const mediaTable = defineTable<"Media", Media, typeof MediaSchema>({
  name: "Media",
  schema: MediaSchema,
  primaryKey: "id",
  columns: [
    { name: "id", type: "varchar", primaryKey: true },
    { name: "key", type: "varchar" },
    { name: "provider", type: "varchar" },
    { name: "resourceName", type: "varchar" },
    { name: "meta", type: "text", nullable: true },
    { name: "fileName", type: "varchar" },
    { name: "fileSize", type: "decimal" },
    { name: "mimeType", type: "varchar" },
    { name: "uploaded", type: "datetime", nullable: true },
    { name: "validated", type: "datetime", nullable: true },
    { name: "deleted", type: "datetime", nullable: true },
    { name: "loOid", type: "decimal", nullable: true },
    { name: "module", type: "varchar", nullable: true },
    { name: "type", type: "varchar", nullable: true },
    { name: "resourceId", type: "varchar", nullable: true },
    { name: "userId", type: "varchar", nullable: true },
    { name: "createdAt", type: "datetime" },
    { name: "updatedAt", type: "datetime" },
  ],
  relations: [
    {
      column: "userId",
      references: {
        table: "User",
        column: "id",
      },
    },
  ],
});
