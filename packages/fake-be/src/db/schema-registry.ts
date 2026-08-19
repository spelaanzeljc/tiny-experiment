import type { z } from "zod";

import type { DbTableRow } from "~/db/table";
import { activityTable } from "~/db/tables/activity/activity.schema";
import { authnIdentityTable } from "~/db/tables/authnIdentity/authnIdentity.schema";
import { authnNonceTable } from "~/db/tables/authnNonce/authnNonce.schema";
import { mediaTable } from "~/db/tables/media/media.schema";
import { mailTable } from "~/db/tables/mail/mail.schema";
import { alienTable } from "~/db/tables/alien/alien.schema";
import { planetLikeTable } from "~/db/tables/planet-like/planet-like.schema";
import { planetTable } from "~/db/tables/planet/planet.schema";
import { userTable } from "~/db/tables/user/user.schema";
import { emailTemplateTable } from "~/db/tables/emailTemplate/emailTemplate.schema";
import { pushNotificationTemplateTable } from "~/db/tables/pushNotificationTemplate/pushNotificationTemplate.schema";
import { pushNotificationTokenTable } from "~/db/tables/pushNotificationToken/pushNotificationToken.schema";
import { queueJobTable } from "~/db/tables/queueJob/queueJob.schema";

export const dbTables = [
  userTable,
  authnIdentityTable,
  authnNonceTable,
  activityTable,
  alienTable,
  mediaTable,
  mailTable,
  emailTemplateTable,
  pushNotificationTemplateTable,
  pushNotificationTokenTable,
  queueJobTable,
  planetTable,
  planetLikeTable,
] as const;

export type DbTable = (typeof dbTables)[number];
export type TableName = DbTable["name"];
export type TableByName<TName extends TableName> = Extract<DbTable, { name: TName }>;
export type TableRowByName<TName extends TableName> = DbTableRow<TableByName<TName>>;
export type StoreState = {
  [TName in TableName]: TableRowByName<TName>[];
};

export const dbTableByName = Object.fromEntries(dbTables.map((table) => [table.name, table])) as {
  [TName in TableName]: TableByName<TName>;
};

export const tableNames = {
  activity: activityTable.name,
  authnIdentity: authnIdentityTable.name,
  authnNonce: authnNonceTable.name,
  media: mediaTable.name,
  mail: mailTable.name,
  alien: alienTable.name,
  planet: planetTable.name,
  planetLike: planetLikeTable.name,
  user: userTable.name,
  emailTemplate: emailTemplateTable.name,
  pushNotificationTemplate: pushNotificationTemplateTable.name,
  pushNotificationToken: pushNotificationTokenTable.name,
  queueJob: queueJobTable.name,
} as const satisfies Record<string, TableName>;

export function getTableRows<TName extends TableName>(state: StoreState, tableName: TName): TableRowByName<TName>[] {
  return state[tableName];
}

export function parseStoreState(value: unknown): StoreState | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Partial<Record<TableName, unknown>>;
  const state: Partial<Record<TableName, unknown>> = {};

  for (const table of dbTables) {
    const rowsSchema = table.schema.array() as z.ZodType<TableRowByName<typeof table.name>[]>;
    const result = rowsSchema.safeParse(raw[table.name]);
    if (!result.success) {
      return null;
    }
    state[table.name] = result.data;
  }

  return state as StoreState;
}
