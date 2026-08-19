import dagre from "@dagrejs/dagre";
import { type Edge, type Node, Position } from "@xyflow/react";

import { NODE_WIDTH, getNodeHeight } from "../constants";
import type { TableNodeData } from "../TableNode";

export { getNodeHeight };

type DagreDirection = "TB" | "LR" | "RL" | "BT";

interface DagreLayoutOptions {
  direction?: DagreDirection;
  ranksep?: number;
  nodesep?: number;
  edgesep?: number;
  marginx?: number;
  marginy?: number;
}

export function getDagreLayout(
  nodes: Node<TableNodeData>[],
  edges: Edge[],
  options: DagreDirection | DagreLayoutOptions = "LR",
): Node<TableNodeData>[] {
  const layoutOptions = typeof options === "string" ? { direction: options } : options;
  const direction = layoutOptions.direction ?? "LR";
  const isHorizontal = direction === "LR" || direction === "RL";
  const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: direction,
    ranker: "network-simplex",
    acyclicer: "greedy",
    align: isHorizontal ? "UL" : undefined,
    ranksep: layoutOptions.ranksep ?? (isHorizontal ? 160 : 96),
    nodesep: layoutOptions.nodesep ?? 64,
    edgesep: layoutOptions.edgesep ?? 36,
    marginx: layoutOptions.marginx ?? 48,
    marginy: layoutOptions.marginy ?? 48,
  });

  for (const node of nodes) {
    const colCount = node.data.columns?.length ?? 0;
    const height = getNodeHeight(colCount);
    graph.setNode(node.id, { width: NODE_WIDTH, height });
  }

  for (const edge of edges) {
    graph.setEdge(edge.source, edge.target, { weight: 2, minlen: 1 });
  }

  dagre.layout(graph);

  return nodes.map((node) => {
    const nodeWithPosition = graph.node(node.id);
    const colCount = node.data.columns?.length ?? 0;
    const height = getNodeHeight(colCount);

    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });
}
