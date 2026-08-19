import type { Edge, Node } from "@xyflow/react";

import type { TableNodeData } from "../TableNode";
import { getDagreLayout } from "./dagre";

interface Relationship {
  from: string;
  to: string;
  col: string;
}

function getTableWeight(tableId: string, relationships: Relationship[]): number {
  return relationships.reduce((weight, relationship) => {
    if (relationship.to === tableId) {
      return weight + 2;
    }

    if (relationship.from === tableId) {
      return weight + 1;
    }

    return weight;
  }, 0);
}

export function getSchemaLayout(nodes: Node<TableNodeData>[], relationships: Relationship[]): Node<TableNodeData>[] {
  const sortedNodes = [...nodes].sort((a, b) => {
    const weightDiff = getTableWeight(b.id, relationships) - getTableWeight(a.id, relationships);

    if (weightDiff !== 0) {
      return weightDiff;
    }

    return a.data.tableName.localeCompare(b.data.tableName);
  });

  const layoutEdges: Edge[] = relationships.map((relationship, index) => ({
    id: `layout-${relationship.to}-${relationship.from}-${relationship.col}-${index}`,
    source: relationship.to,
    target: relationship.from,
  }));

  return getDagreLayout(sortedNodes, layoutEdges, {
    direction: "LR",
    ranksep: 180,
    nodesep: 68,
    edgesep: 40,
  });
}
