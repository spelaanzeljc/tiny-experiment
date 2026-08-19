import type { z } from "zod";

export type DbColumnType = "varchar" | "text" | "datetime" | "boolean" | "decimal";
export type DbRow = Record<string, unknown>;

export interface DbColumnDefinition<TRow extends DbRow> {
  name: Extract<keyof TRow, string>;
  type: DbColumnType;
  nullable?: boolean;
  optional?: boolean;
  primaryKey?: boolean;
}

export interface DbRelationDefinition<TRow extends DbRow> {
  column: Extract<keyof TRow, string>;
  references: {
    table: string;
    column: string;
  };
}

export interface DbTableDefinition<
  TName extends string,
  TRow extends DbRow,
  TSchema extends z.ZodType<TRow> = z.ZodType<TRow>,
> {
  name: TName;
  schema: TSchema;
  primaryKey: Extract<keyof TRow, string>;
  columns: DbColumnDefinition<TRow>[];
  relations?: DbRelationDefinition<TRow>[];
  dbml?: {
    hidden?: boolean;
  };
}

export function defineTable<
  const TName extends string,
  const TRow extends DbRow,
  const TSchema extends z.ZodType<TRow>,
>(definition: DbTableDefinition<TName, TRow, TSchema>): DbTableDefinition<TName, TRow, TSchema> {
  return definition;
}

export type DbTableRow<TTable extends { schema: z.ZodType }> = z.infer<TTable["schema"]>;
