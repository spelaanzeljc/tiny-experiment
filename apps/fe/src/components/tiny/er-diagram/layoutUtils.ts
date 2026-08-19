import type { Node } from "@xyflow/react";

import { NODE_WIDTH, getNodeHeight } from "./constants";
import type { TableNodeData } from "./TableNode";

export { getNodeHeight };

/** Pick source handle (left/right) based on source position relative to target */
export function pickSourceHandle(sourceNode: Node<TableNodeData>, targetNode: Node<TableNodeData>): "left" | "right" {
  const sourceCenterX = (sourceNode.position?.x ?? 0) + NODE_WIDTH / 2;
  const targetCenterX = (targetNode.position?.x ?? 0) + NODE_WIDTH / 2;
  return targetCenterX > sourceCenterX ? "right" : "left";
}

/** Pick target handle (top/left/right/bottom) based on source position relative to target */
export function pickTargetHandle(
  sourceNode: Node<TableNodeData>,
  targetNode: Node<TableNodeData>,
): "top" | "left" | "right" | "bottom" {
  const sourceH = getNodeHeight((sourceNode.data as TableNodeData).columns?.length ?? 0);
  const sourceCenterX = (sourceNode.position?.x ?? 0) + NODE_WIDTH / 2;
  const sourceCenterY = (sourceNode.position?.y ?? 0) + sourceH / 2;

  const targetH = getNodeHeight((targetNode.data as TableNodeData).columns?.length ?? 0);
  const targetLeft = targetNode.position?.x ?? 0;
  const targetTop = targetNode.position?.y ?? 0;

  const dx = sourceCenterX - (targetLeft + NODE_WIDTH / 2);
  const dy = sourceCenterY - (targetTop + targetH / 2);

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  return dy > 0 ? "bottom" : "top";
}
