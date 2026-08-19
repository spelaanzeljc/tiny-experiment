import { z } from "zod";
import { defineTable } from "~/db/table";
export const AuthnIdentitySchema = z.object({ id: z.string(), namespace: z.string(), provider: z.string(), providerId: z.string(), userId: z.string(), providerData: z.unknown(), disabledAt: z.string().nullable(), validatedAt: z.string().nullable(), createdAt: z.string(), updatedAt: z.string() });
export type AuthnIdentity = z.infer<typeof AuthnIdentitySchema>;
export const authnIdentityTable = defineTable<"AuthnIdentity", AuthnIdentity, typeof AuthnIdentitySchema>({ name: "AuthnIdentity", schema: AuthnIdentitySchema, primaryKey: "id", columns: [
  { name: "id", type: "varchar", primaryKey: true }, { name: "namespace", type: "varchar" }, { name: "provider", type: "varchar" }, { name: "providerId", type: "varchar" }, { name: "userId", type: "varchar" }, { name: "providerData", type: "text" }, { name: "disabledAt", type: "datetime", nullable: true }, { name: "validatedAt", type: "datetime", nullable: true }, { name: "createdAt", type: "datetime" }, { name: "updatedAt", type: "datetime" },
], relations: [{ column: "userId", references: { table: "User", column: "id" } }] });
