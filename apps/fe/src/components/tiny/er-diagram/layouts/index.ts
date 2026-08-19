import type { Edge, Node } from "@xyflow/react";

import type { TableNodeData } from "../TableNode";
import type { LayoutAlgorithm } from "../types";
import { getDagreLayout } from "./dagre";
import { getGridLayout } from "./grid";
import { getSchemaLayout } from "./schema";

type DagreDirection = "TB" | "LR" | "RL" | "BT";

export function layoutNodes(
  tables: { id: string; tableName: string; columns: TableNodeData["columns"] }[],
  relationships: { from: string; to: string; col: string }[],
  algorithm: LayoutAlgorithm = "schema",
): Node<TableNodeData>[] {
  const fkByTable = new Map<string, string[]>();
  for (const r of relationships) {
    const list = fkByTable.get(r.from) ?? [];
    if (!list.includes(r.col)) {
      list.push(r.col);
    }
    fkByTable.set(r.from, list);
  }

  const nodes: Node<TableNodeData>[] = tables.map((t) => ({
    id: t.id,
    type: "table",
    position: { x: 0, y: 0 },
    data: {
      tableName: t.tableName,
      columns: t.columns,
      fkColumns: fkByTable.get(t.id) ?? [],
    },
    draggable: true,
  }));

  if (algorithm === "schema") {
    return getSchemaLayout(nodes, relationships);
  }
  if (algorithm === "grid") {
    return getGridLayout(nodes);
  }

  const layoutEdges: Edge[] = relationships.map((r, i) => ({
    id: `e-${r.from}-${r.to}-${r.col}-${i}`,
    source: r.to,
    target: r.from,
  }));

  const direction = algorithm.replace("dagre-", "") as DagreDirection;
  return getDagreLayout(nodes, layoutEdges, direction);
}
