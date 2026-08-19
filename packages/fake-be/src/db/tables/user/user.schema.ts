import { z } from "zod";

import { defineTable } from "~/db/table";

export const UserSchema = z.object({
  id: z.string(),
  email: z.email().nullable(),
  name: z.string().nullable(),
  roles: z.string().array(),
  password: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const userTable = defineTable<"User", User, typeof UserSchema>({
  name: "User",
  schema: UserSchema,
  primaryKey: "id",
  columns: [
    { name: "id", type: "varchar", primaryKey: true },
    { name: "email", type: "varchar", nullable: true },
    { name: "name", type: "varchar", nullable: true },
    { name: "roles", type: "text" },
    { name: "password", type: "varchar", nullable: true },
    { name: "createdAt", type: "datetime" },
    { name: "updatedAt", type: "datetime" },
  ],
});
