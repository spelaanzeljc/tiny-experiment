import type { Node } from "@xyflow/react";
import { Position } from "@xyflow/react";

import { NODE_WIDTH, getNodeHeight } from "../constants";
import type { TableNodeData } from "../TableNode";

export function getCircularLayout(nodes: Node<TableNodeData>[]): Node<TableNodeData>[] {
  return getCircularLayoutWithOrder(
    nodes,
    nodes.map((_, i) => i),
  );
}

/** Compute radius. Use NODE_WIDTH for chord (adjacent nodes side-by-side); height matters less on circle. */
function computeRadius(nodes: Node<TableNodeData>[]): number {
  const count = nodes.length;
  if (count === 0) {
    return 400;
  }
  // Chord between adjacent nodes: 2*R*sin(π/n) >= NODE_WIDTH => R >= NODE_WIDTH / (2*sin(π/n))
  const minRadius = NODE_WIDTH / (2 * Math.sin(Math.PI / count));
  return Math.max(400, minRadius * 1.05);
}

export function getCircularLayoutWithOrder(
  nodes: Node<TableNodeData>[],
  order: number[],
  radius?: number,
): Node<TableNodeData>[] {
  const count = nodes.length;
  if (count === 0) {
    return nodes;
  }

  const R = radius ?? computeRadius(nodes);

  const idxToPos = new Map<number, number>();
  order.forEach((idx, pos) => idxToPos.set(idx, pos));

  return nodes.map((node, idx) => {
    const pos = idxToPos.get(idx) ?? idx;
    const angle = (2 * Math.PI * pos) / count - Math.PI / 2;
    const height = getNodeHeight((node.data as TableNodeData).columns?.length ?? 0);
    return {
      ...node,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      position: {
        x: R + R * Math.cos(angle) - NODE_WIDTH / 2,
        y: R + R * Math.sin(angle) - height / 2,
      },
    };
  });
}
