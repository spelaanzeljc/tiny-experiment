import { getStore, persistStore } from "~/db/store";
import type { DbRow, DbTableDefinition } from "~/db/table";

export function createTableRepository<const TName extends string, TRow extends DbRow>(
  table: DbTableDefinition<TName, TRow>,
) {
  type Row = TRow;

  async function rows(): Promise<Row[]> {
    const store = await getStore();
    return store[table.name as keyof typeof store] as unknown as Row[];
  }

  function getPrimaryKey(row: Row): string {
    return String(row[table.primaryKey]);
  }

  return {
    async list(): Promise<Row[]> {
      return rows();
    },

    async findById(id: string): Promise<Row | undefined> {
      return (await rows()).find((row) => getPrimaryKey(row) === id);
    },

    async findFirst(predicate: (row: Row) => boolean): Promise<Row | undefined> {
      return (await rows()).find(predicate);
    },

    async create(row: Row): Promise<Row> {
      const parsed = table.schema.parse(row) as Row;
      (await rows()).push(parsed);
      return parsed;
    },

    async update(id: string, patch: Partial<Row>): Promise<Row | undefined> {
      const row = (await rows()).find((item) => getPrimaryKey(item) === id);
      if (!row) {
        return undefined;
      }

      const parsed = table.schema.parse({ ...row, ...patch }) as Row;
      Object.assign(row, parsed);
      persistStore();
      return row;
    },

    async remove(id: string): Promise<Row | undefined> {
      const tableRows = await rows();
      const index = tableRows.findIndex((row) => getPrimaryKey(row) === id);
      if (index === -1) {
        return undefined;
      }

      const [removed] = tableRows.splice(index, 1);
      return removed;
    },
  };
}
