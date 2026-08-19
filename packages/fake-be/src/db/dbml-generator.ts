/**
 * Generates DBML and ER diagram data from the fake-be table registry.
 */

import { dbTables } from "~/db/schema-registry";
import type { DbTable } from "~/db/schema-registry";
import type { DbColumnType } from "~/db/table";

interface RelationshipDef {
  from: string;
  to: string;
  col: string;
  toCol: string;
}

const DBML_TYPE_BY_COLUMN_TYPE: Record<DbColumnType, string> = {
  boolean: "boolean",
  datetime: "datetime",
  decimal: "decimal",
  text: "text",
  varchar: "varchar",
};

const MERMAID_TYPE_BY_COLUMN_TYPE: Record<DbColumnType, string> = {
  boolean: "boolean",
  datetime: "datetime",
  decimal: "number",
  text: "string",
  varchar: "string",
};

function dbmlType(type: DbColumnType): string {
  return DBML_TYPE_BY_COLUMN_TYPE[type];
}

function dbmlColumnType(column: { type: DbColumnType; primaryKey?: boolean }): string {
  return column.primaryKey ? "String" : dbmlType(column.type);
}

function mermaidType(type: DbColumnType): string {
  return MERMAID_TYPE_BY_COLUMN_TYPE[type];
}

function relationships(): RelationshipDef[] {
  const visibleTableNames = new Set<string>(visibleTables().map((table) => table.name));

  return visibleTables().flatMap((table) =>
    (table.relations ?? [])
      .map((relation) => ({
        from: table.name,
        to: relation.references.table,
        col: relation.column,
        toCol: relation.references.column,
      }))
      .filter((relation) => visibleTableNames.has(relation.to)),
  );
}

function visibleTables(): DbTable[] {
  return dbTables.filter((table) => table.dbml?.hidden !== true);
}

export function generateDBML(): string {
  const lines: string[] = [
    "// DBML generated from fake-be table schemas (src/fake-be/db/tables)",
    "// Paste into dbdiagram.io or dbdocs.io to visualize",
    "",
  ];

  for (const table of visibleTables()) {
    lines.push(`Table ${table.name} {`);
    for (const column of table.columns) {
      const settings = [];
      if (column.primaryKey) {
        settings.push("pk");
      }
      if (!column.primaryKey && !column.nullable && !column.optional) {
        settings.push("not null");
      }
      if (column.nullable) {
        settings.push("note: 'nullable'");
      }

      const suffix = settings.length > 0 ? ` [${settings.join(", ")}]` : "";
      lines.push(`  ${column.name} ${dbmlColumnType(column)}${suffix}`);
    }
    lines.push("}");
    lines.push("");
  }

  lines.push("// Relationships (defined in table schemas)");
  for (const relation of relationships()) {
    lines.push(`Ref: ${relation.from}.${relation.col} > ${relation.to}.${relation.toCol}`);
  }

  return lines.join("\n");
}

export function generateMermaidEr(): string {
  const refs = relationships();
  const lines: string[] = ["erDiagram\n"];

  for (const table of visibleTables()) {
    const entityName = table.name.toUpperCase().replace(/-/g, "_");
    lines.push(`${entityName} {`);
    for (const column of table.columns) {
      const pk = column.primaryKey ? " PK" : "";
      const fk = refs.some((relation) => relation.from === table.name && relation.col === column.name) ? " FK" : "";
      lines.push(`    ${mermaidType(column.type)} ${column.name}${pk}${fk}`);
    }
    lines.push("}");
    lines.push("");
  }

  for (const relation of refs) {
    const parent = relation.to.toUpperCase().replace(/-/g, "_");
    const child = relation.from.toUpperCase().replace(/-/g, "_");
    lines.push(`${parent} ||--o{ ${child} : "${relation.col}"`);
  }

  return lines.join("\n");
}

export interface ErDiagramTable {
  id: string;
  tableName: string;
  columns: {
    name: string;
    type: string;
    isPk: boolean;
    isFk: boolean;
    isNullable: boolean;
    isOptional: boolean;
  }[];
}

export interface ErDiagramRelationship {
  from: string;
  to: string;
  col: string;
  toCol: string;
}

export interface ErDiagramData {
  tables: ErDiagramTable[];
  relationships: ErDiagramRelationship[];
}

export function generateErDiagramData(): ErDiagramData {
  const refs = relationships();

  const tables: ErDiagramTable[] = visibleTables().map((table) => ({
    id: table.name,
    tableName: table.name,
    columns: table.columns.map((column) => ({
      name: column.name,
      type: mermaidType(column.type),
      isPk: column.primaryKey === true,
      isFk: refs.some((relation) => relation.from === table.name && relation.col === column.name),
      isNullable: column.nullable === true,
      isOptional: column.optional === true,
    })),
  }));

  return { tables, relationships: refs };
}
