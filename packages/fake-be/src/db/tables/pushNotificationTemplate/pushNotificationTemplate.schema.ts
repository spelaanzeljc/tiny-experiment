import { z } from "zod";
import { defineTable } from "~/db/table";
export const PushNotificationTemplateSchema = z.object({ id: z.string(), name: z.string(), title: z.string().nullable(), body: z.string().nullable(), imageUrl: z.string().nullable(), data: z.unknown().nullable(), type: z.string(), module: z.string().nullable(), description: z.string().nullable(), createdAt: z.string(), updatedAt: z.string() });
export type PushNotificationTemplate = z.infer<typeof PushNotificationTemplateSchema>;
export const pushNotificationTemplateTable = defineTable<"PushNotificationTemplate", PushNotificationTemplate, typeof PushNotificationTemplateSchema>({ name: "PushNotificationTemplate", schema: PushNotificationTemplateSchema, primaryKey: "id", columns: [
  { name: "id", type: "varchar", primaryKey: true }, { name: "name", type: "varchar" }, { name: "title", type: "varchar", nullable: true }, { name: "body", type: "text", nullable: true }, { name: "imageUrl", type: "varchar", nullable: true }, { name: "data", type: "text", nullable: true }, { name: "type", type: "varchar" }, { name: "module", type: "varchar", nullable: true }, { name: "description", type: "text", nullable: true }, { name: "createdAt", type: "datetime" }, { name: "updatedAt", type: "datetime" },
] });
