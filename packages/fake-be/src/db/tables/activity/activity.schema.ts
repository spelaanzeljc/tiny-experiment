import { z } from "zod";
import { defineTable } from "~/db/table";

export const ActivitySchema = z.object({
  id: z.string(), timestamp: z.string(), payload: z.unknown(), metadata: z.unknown().nullable(),
  module: z.string(), type: z.string(), userId: z.string().nullable(), resourceId: z.string().nullable(),
});
export type Activity = z.infer<typeof ActivitySchema>;
export const activityTable = defineTable<"Activity", Activity, typeof ActivitySchema>({
  name: "Activity", schema: ActivitySchema, primaryKey: "id",
  columns: [
    { name: "id", type: "varchar", primaryKey: true }, { name: "timestamp", type: "datetime" },
    { name: "payload", type: "text" }, { name: "metadata", type: "text", nullable: true },
    { name: "module", type: "varchar" }, { name: "type", type: "varchar" },
    { name: "userId", type: "varchar", nullable: true }, { name: "resourceId", type: "varchar", nullable: true },
  ],
  relations: [{ column: "userId", references: { table: "User", column: "id" } }],
});
