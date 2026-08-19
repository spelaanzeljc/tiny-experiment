import type { Node } from "@xyflow/react";
import { Position } from "@xyflow/react";

import { NODE_WIDTH, getNodeHeight } from "../constants";
import type { TableNodeData } from "../TableNode";

export function getGridLayout(nodes: Node<TableNodeData>[]): Node<TableNodeData>[] {
  const COLS = 4;
  const GAP_X = 80;
  const GAP_Y = 60;
  const rowHeights: number[] = [];
  for (let r = 0; r < Math.ceil(nodes.length / COLS); r++) {
    let maxH = 0;
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      if (i >= nodes.length) {
        break;
      }
      const h = getNodeHeight((nodes[i].data as TableNodeData).columns?.length ?? 0);
      maxH = Math.max(maxH, h);
    }
    rowHeights.push(maxH + GAP_Y);
  }
  return nodes.map((node, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const yOffset = rowHeights.slice(0, row).reduce((a, b) => a + b, 0);
    return {
      ...node,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      position: {
        x: col * (NODE_WIDTH + GAP_X),
        y: yOffset,
      },
    };
  });
}
