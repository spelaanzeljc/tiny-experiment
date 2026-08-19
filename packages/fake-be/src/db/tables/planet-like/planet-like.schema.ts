import { z } from "zod";

import { defineTable } from "~/db/table";

export const PlanetLikeSchema = z.object({
  id: z.string(),
  planetId: z.string(),
  userId: z.string(),
  createdAt: z.string(),
});

export type PlanetLike = z.infer<typeof PlanetLikeSchema>;

export const planetLikeTable = defineTable<"PlanetLike", PlanetLike, typeof PlanetLikeSchema>({
  name: "PlanetLike",
  schema: PlanetLikeSchema,
  primaryKey: "id",
  columns: [
    { name: "id", type: "varchar", primaryKey: true },
    { name: "planetId", type: "varchar" },
    { name: "userId", type: "varchar" },
    { name: "createdAt", type: "datetime" },
  ],
  relations: [
    {
      column: "planetId",
      references: {
        table: "Planet",
        column: "id",
      },
    },
    {
      column: "userId",
      references: {
        table: "User",
        column: "id",
      },
    },
  ],
  dbml: { hidden: true },
});
