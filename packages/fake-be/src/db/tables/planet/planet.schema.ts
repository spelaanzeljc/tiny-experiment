import { z } from "zod";

import { defineTable } from "~/db/table";

export const PlanetSchema = z.object({
  id: z.string(),
  userId: z.string(),
  // Persist relation IDs as scalar columns; API routers can enrich rows with display labels.
  alienId: z.string().nullable().optional(),
  discoveryDate: z.iso.datetime({ offset: true }).nullable().optional(),
  name: z.string(),
  description: z.string().nullable(),
  imageId: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Planet = z.infer<typeof PlanetSchema>;

export const planetTable = defineTable<"Planet", Planet, typeof PlanetSchema>({
  name: "Planet",
  schema: PlanetSchema,
  primaryKey: "id",
  columns: [
    { name: "id", type: "varchar", primaryKey: true },
    { name: "userId", type: "varchar" },
    { name: "alienId", type: "varchar", nullable: true, optional: true },
    { name: "discoveryDate", type: "datetime", nullable: true, optional: true },
    { name: "name", type: "varchar" },
    { name: "description", type: "text", nullable: true },
    { name: "imageId", type: "varchar", nullable: true, optional: true },
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
    {
      column: "alienId",
      references: {
        table: "Alien",
        column: "id",
      },
    },
    {
      column: "imageId",
      references: {
        table: "Media",
        column: "id",
      },
    },
  ],
  dbml: { hidden: true },
});
