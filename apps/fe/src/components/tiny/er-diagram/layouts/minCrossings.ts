import type { Node } from "@xyflow/react";

import type { TableNodeData } from "../TableNode";
import { getCircularLayoutWithOrder } from "./circular";

/** Count edge crossings for circular layout. Two edges cross if endpoints alternate around circle. */
function countCrossings(edges: [number, number][], order: number[]): number {
  const pos = new Map<number, number>();
  order.forEach((v, i) => pos.set(v, i));
  let crossings = 0;
  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    const pa = pos.get(a) ?? 0;
    const pb = pos.get(b) ?? 0;
    const [p0, p1] = pa < pb ? [pa, pb] : [pb, pa];
    for (let j = i + 1; j < edges.length; j++) {
      const [c, d] = edges[j];
      const pc = pos.get(c) ?? 0;
      const pd = pos.get(d) ?? 0;
      const [p2, p3] = pc < pd ? [pc, pd] : [pd, pc];
      const in1 = p2 > p0 && p2 < p1;
      const in2 = p3 > p0 && p3 < p1;
      if (in1 !== in2) {
        crossings += 1;
      }
    }
  }
  return crossings;
}

/** Sifting heuristic: for each vertex, find best insert position to minimize crossings. */
function siftPass(edges: [number, number][], order: number[]): { order: number[]; crossings: number } {
  let current = [...order];
  for (const v of current) {
    const k = current.indexOf(v);
    current.splice(k, 1);
    let bestPos = 0;
    let bestCross = Infinity;
    for (let pos = 0; pos <= current.length; pos++) {
      const cand = [...current.slice(0, pos), v, ...current.slice(pos)];
      const c = countCrossings(edges, cand);
      if (c < bestCross) {
        bestCross = c;
        bestPos = pos;
      }
    }
    current = [...current.slice(0, bestPos), v, ...current.slice(bestPos)];
  }
  return { order: current, crossings: countCrossings(edges, current) };
}

/** Circular layout with crossing minimization. Uses radius scaled to prevent node overlap. */
export function getCircularLayoutMinCrossings(
  nodes: Node<TableNodeData>[],
  relationships: { from: string; to: string }[],
): Node<TableNodeData>[] {
  const idToIdx = new Map<string, number>();
  nodes.forEach((n, i) => idToIdx.set(n.id, i));
  const edges: [number, number][] = relationships
    .filter((r) => idToIdx.has(r.from) && idToIdx.has(r.to))
    .map((r) => [idToIdx.get(r.from)!, idToIdx.get(r.to)!]);

  const n = nodes.length;
  if (n === 0) {
    return nodes;
  }

  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    if (a !== b && !adj[a].includes(b)) {
      adj[a].push(b);
    }
    if (a !== b && !adj[b].includes(a)) {
      adj[b].push(a);
    }
  }
  const deg = adj.map((row) => row.length);

  const starts = [...Array(n).keys()].sort((i, j) => deg[j] - deg[i]);
  const K = Math.min(n, 10);
  let bestOrder: number[] = [...Array(n).keys()];
  let bestCross = countCrossings(edges, bestOrder);

  for (let t = 0; t < K; t++) {
    const placed = new Set<number>();
    const order: number[] = [];
    const score = Array.from({ length: n }, () => 0);
    const start = starts[t];
    placed.add(start);
    order.push(start);
    for (const nb of adj[start]) {
      score[nb]++;
    }

    while (order.length < n) {
      let best = -1;
      let bestScore = -1;
      let bestDeg = -1;
      for (let v = 0; v < n; v++) {
        if (placed.has(v)) {
          continue;
        }
        if (score[v] > bestScore || (score[v] === bestScore && deg[v] > bestDeg)) {
          best = v;
          bestScore = score[v];
          bestDeg = deg[v];
        }
      }
      if (best < 0) {
        for (let v = 0; v < n; v++) {
          if (!placed.has(v)) {
            order.push(v);
            placed.add(v);
            break;
          }
        }
        continue;
      }
      order.push(best);
      placed.add(best);
      for (const nb of adj[best]) {
        if (!placed.has(nb)) {
          score[nb]++;
        }
      }
    }

    const sifted = siftPass(edges, order);
    if (sifted.crossings < bestCross) {
      bestCross = sifted.crossings;
      bestOrder = sifted.order;
    }
  }

  const final = siftPass(edges, bestOrder);

  // Use getCircularLayoutWithOrder with auto-computed radius to prevent overlap
  return getCircularLayoutWithOrder(nodes, final.order);
}
