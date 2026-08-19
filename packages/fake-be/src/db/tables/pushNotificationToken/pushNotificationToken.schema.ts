import { z } from "zod";
import { defineTable } from "~/db/table";
export const PushNotificationTokenSchema = z.object({ id: z.string(), resourceName: z.string(), resourceLabel: z.string().nullable(), module: z.string().nullable(), resourceId: z.string().nullable(), token: z.string(), provider: z.string(), expiresAt: z.string().nullable(), title: z.string().nullable(), createdAt: z.string(), updatedAt: z.string() });
export type PushNotificationToken = z.infer<typeof PushNotificationTokenSchema>;
export const pushNotificationTokenTable = defineTable<"PushNotificationToken", PushNotificationToken, typeof PushNotificationTokenSchema>({ name: "PushNotificationToken", schema: PushNotificationTokenSchema, primaryKey: "id", columns: [
  { name: "id", type: "varchar", primaryKey: true }, { name: "resourceName", type: "varchar" }, { name: "resourceLabel", type: "varchar", nullable: true }, { name: "module", type: "varchar", nullable: true }, { name: "resourceId", type: "varchar", nullable: true }, { name: "token", type: "text" }, { name: "provider", type: "varchar" }, { name: "expiresAt", type: "datetime", nullable: true }, { name: "title", type: "varchar", nullable: true }, { name: "createdAt", type: "datetime" }, { name: "updatedAt", type: "datetime" },
] });
