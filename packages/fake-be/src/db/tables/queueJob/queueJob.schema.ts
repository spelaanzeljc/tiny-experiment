import { z } from "zod";
import { defineTable } from "~/db/table";
export const QueueJobSchema = z.object({ id: z.string(), processor: z.string(), queue: z.string().nullable(), options: z.unknown().nullable(), payload: z.unknown().nullable(), status: z.string(), result: z.unknown().nullable(), createdAt: z.string(), updatedAt: z.string(), startAfter: z.string().nullable(), startedAt: z.string().nullable(), doneAt: z.string().nullable() });
export type QueueJob = z.infer<typeof QueueJobSchema>;
export const queueJobTable = defineTable<"QueueJob", QueueJob, typeof QueueJobSchema>({ name: "QueueJob", schema: QueueJobSchema, primaryKey: "id", columns: [
  { name: "id", type: "varchar", primaryKey: true }, { name: "processor", type: "varchar" }, { name: "queue", type: "varchar", nullable: true }, { name: "options", type: "text", nullable: true }, { name: "payload", type: "text", nullable: true }, { name: "status", type: "varchar" }, { name: "result", type: "text", nullable: true }, { name: "createdAt", type: "datetime" }, { name: "updatedAt", type: "datetime" }, { name: "startAfter", type: "datetime", nullable: true }, { name: "startedAt", type: "datetime", nullable: true }, { name: "doneAt", type: "datetime", nullable: true },
] });
