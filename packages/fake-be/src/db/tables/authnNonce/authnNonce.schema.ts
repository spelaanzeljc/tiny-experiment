import { z } from "zod";

import { defineTable } from "~/db/table";
import { userTable } from "~/db/tables/user/user.schema";

export const AuthnNonceSchema = z.object({
  id: z.string(),
  code: z.string(),
  type: z.string(),
  userId: z.string(),
  expiresAt: z.string(),
  usedAt: z.string().nullable(),
  createdAt: z.string(),
});

export type AuthnNonce = z.infer<typeof AuthnNonceSchema>;

export const authnNonceTable = defineTable<"AuthnNonce", AuthnNonce, typeof AuthnNonceSchema>({
  name: "AuthnNonce",
  schema: AuthnNonceSchema,
  primaryKey: "id",
  columns: [
    { name: "id", type: "varchar", primaryKey: true },
    { name: "code", type: "varchar" },
    { name: "type", type: "varchar" },
    { name: "userId", type: "varchar" },
    { name: "expiresAt", type: "datetime" },
    { name: "usedAt", type: "datetime", nullable: true },
    { name: "createdAt", type: "datetime" },
  ],
  relations: [{ column: "userId", references: { table: userTable.name, column: "id" } }],
  dbml: { hidden: true },
});
