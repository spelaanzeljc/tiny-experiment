import { z } from "zod";

import { defineTable } from "~/db/table";

export const AlienSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Alien = z.infer<typeof AlienSchema>;

export const alienTable = defineTable<"Alien", Alien, typeof AlienSchema>({
  name: "Alien",
  schema: AlienSchema,
  primaryKey: "id",
  columns: [
    { name: "id", type: "varchar", primaryKey: true },
    { name: "name", type: "varchar" },
    { name: "createdAt", type: "datetime" },
    { name: "updatedAt", type: "datetime" },
  ],
  dbml: { hidden: true },
});
