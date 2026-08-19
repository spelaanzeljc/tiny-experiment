import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  type EdgeTypes,
  MiniMap,
  type Node,
  type NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button, Segment, Typography } from "@povio/ui/tanstack";
import { Maximize, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { STORAGE_KEY } from "./constants";
import { layoutNodes } from "./layouts";
import { pickSourceHandle, pickTargetHandle } from "./layoutUtils";
import { RelationEdge, type RelationEdgeData } from "./RelationEdge";
import { Stat } from "./Stat";
import { TableNode, type TableNodeData } from "./TableNode";
import type { ErDiagramData, LayoutAlgorithm, RelationVisibility } from "./types";
import { LAYOUT_OPTIONS, RELATION_VISIBILITY_OPTIONS } from "./types";

type RelationEdgeType = Edge<RelationEdgeData>;

const LAYOUT_LABELS: Record<LayoutAlgorithm, string> = {
  schema: "Schema",
  "dagre-lr": "Left to right",
  "dagre-tb": "Top down",
  grid: "Grid",
};

const RELATION_VISIBILITY_LABELS: Record<RelationVisibility, string> = {
  all: "All relations",
  focused: "Focus",
  hidden: "Tables only",
};

function getFkColumns(data: ErDiagramData) {
  const fkByTable = new Map<string, string[]>();

  for (const relationship of data.relationships) {
    const list = fkByTable.get(relationship.from) ?? [];

    if (!list.includes(relationship.col)) {
      list.push(relationship.col);
    }

    fkByTable.set(relationship.from, list);
  }

  return fkByTable;
}

function hydrateStoredNodes(data: ErDiagramData, storedNodes: Node[]): Node<TableNodeData>[] | null {
  const tableIds = new Set(data.tables.map((table) => table.id));
  const restored = storedNodes.filter((node) => tableIds.has(node.id));
  const restoredIds = new Set(restored.map((node) => node.id));
  const hasEveryTable = data.tables.every((table) => restoredIds.has(table.id));

  if (!restored.length || !hasEveryTable) {
    return null;
  }

  const fkByTable = getFkColumns(data);
  const tablesById = new Map(data.tables.map((table) => [table.id, table]));

  return restored
    .map((node) => {
      const table = tablesById.get(node.id);

      if (!table) {
        return null;
      }

      return {
        ...node,
        type: "table" as const,
        data: {
          tableName: table.tableName,
          columns: table.columns,
          fkColumns: fkByTable.get(node.id) ?? [],
        },
      };
    })
    .filter(Boolean) as Node<TableNodeData>[];
}

function getStoredNodes(data: ErDiagramData) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as { nodes?: Node[] };

    if (!Array.isArray(parsed.nodes)) {
      return null;
    }

    return hydrateStoredNodes(data, parsed.nodes);
  } catch {
    return null;
  }
}

export function ErDiagramCanvas() {
  const [data, setData] = useState<ErDiagramData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [layoutAlgorithm, setLayoutAlgorithm] = useState<LayoutAlgorithm>("schema");
  const [relationVisibility, setRelationVisibility] = useState<RelationVisibility>("focused");
  const initialLayout = useRef<Node<TableNodeData>[] | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api-docs/er/data.json");
        const json = (await response.json()) as ErDiagramData;
        setData(json);
      } catch (error) {
        setError(String(error));
      }
    }

    load();
  }, []);

  const initialNodes = useMemo(() => {
    if (!data) {
      return [];
    }

    return getStoredNodes(data) ?? layoutNodes(data.tables, data.relationships, "schema");
  }, [data]);

  const baseEdges = useMemo((): RelationEdgeType[] => {
    if (!data) {
      return [];
    }

    return data.relationships.map((relationship, index) => ({
      id: `e-${relationship.from}-${relationship.to}-${relationship.col}-${index}`,
      source: relationship.from,
      target: relationship.to,
      type: "relation",
      data: {
        column: relationship.col,
        targetColumn: relationship.toCol,
      },
    }));
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RelationEdgeType>([]);

  useEffect(() => {
    if (initialNodes.length > 0 && !initialLayout.current) {
      setNodes(initialNodes);
      initialLayout.current = initialNodes;
    }
  }, [initialNodes, setNodes]);

  useEffect(() => {
    if (nodes.length === 0 || baseEdges.length === 0) {
      return;
    }

    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    setEdges(
      baseEdges.map((edge) => {
        const sourceNode = nodeMap.get(edge.source);
        const targetNode = nodeMap.get(edge.target);
        const column = edge.data?.column ?? "";

        if (!sourceNode || !targetNode) {
          return {
            ...edge,
            markerEnd: "er-arrow",
            markerStart: "er-crowsfoot",
            sourceHandle: `${column}-right`,
            targetHandle: "top",
          };
        }

        return {
          ...edge,
          markerEnd: "er-arrow",
          markerStart: "er-crowsfoot",
          sourceHandle: `${column}-${pickSourceHandle(sourceNode, targetNode)}`,
          targetHandle: pickTargetHandle(sourceNode, targetNode),
        };
      }),
    );
  }, [nodes, baseEdges, setEdges]);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistLayout = useCallback(() => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes }));
      } catch {
        // Browser storage may be unavailable in private contexts.
      }

      saveTimeout.current = null;
    }, 300);
  }, [nodes]);

  useEffect(() => {
    if (nodes.length > 0) {
      persistLayout();
    }

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [nodes, persistLayout]);

  const nodeTypes: NodeTypes = useMemo(() => ({ table: TableNode }), []);
  const edgeTypes: EdgeTypes = useMemo(() => ({ relation: RelationEdge }), []);
  const { fitView } = useReactFlow();

  const selectedIds = useMemo(() => new Set(nodes.filter((node) => node.selected).map((node) => node.id)), [nodes]);

  const related = useMemo(() => {
    const nodeIds = new Set<string>();
    const edgeIds = new Set<string>();

    if (selectedIds.size === 0) {
      return { nodeIds, edgeIds };
    }

    for (const edge of edges) {
      if (selectedIds.has(edge.source) || selectedIds.has(edge.target)) {
        edgeIds.add(edge.id);
        nodeIds.add(edge.source);
        nodeIds.add(edge.target);
      }
    }

    return { nodeIds, edgeIds };
  }, [edges, selectedIds]);

  const displayNodes = useMemo(
    () =>
      nodes.map((node) => {
        const hasSelection = selectedIds.size > 0;
        const isSelected = selectedIds.has(node.id);
        const isConnected = hasSelection && related.nodeIds.has(node.id) && !isSelected;

        return {
          ...node,
          data: {
            ...node.data,
            isConnected,
            isMuted: hasSelection && !isSelected && !isConnected,
          },
        };
      }),
    [nodes, related.nodeIds, selectedIds],
  );

  const displayEdges = useMemo(() => {
    if (relationVisibility === "hidden") {
      return [];
    }

    const hasSelection = selectedIds.size > 0;

    return edges
      .filter((edge) => relationVisibility !== "focused" || !hasSelection || related.edgeIds.has(edge.id))
      .map((edge) => {
        const isHighlighted = hasSelection && related.edgeIds.has(edge.id);
        const edgeData = edge.data ?? { column: "" };

        return {
          ...edge,
          markerEnd: isHighlighted ? "er-arrow-highlight" : "er-arrow",
          markerStart: isHighlighted ? "er-crowsfoot-highlight" : "er-crowsfoot",
          data: {
            column: edgeData.column,
            targetColumn: edgeData.targetColumn,
            isHighlighted,
            isDimmed: hasSelection && !isHighlighted,
            showLabel: isHighlighted,
          },
        };
      });
  }, [edges, related.edgeIds, relationVisibility, selectedIds]);

  const stats = useMemo(() => {
    if (!data) {
      return null;
    }

    return {
      tables: data.tables.length,
      columns: data.tables.reduce((count, table) => count + table.columns.length, 0),
      relationships: data.relationships.length,
    };
  }, [data]);

  const handleResetLayout = useCallback(
    (algorithm: LayoutAlgorithm = layoutAlgorithm) => {
      if (!data) {
        return;
      }

      const resetNodes = layoutNodes(data.tables, data.relationships, algorithm);
      setLayoutAlgorithm(algorithm);
      setNodes(resetNodes);
      localStorage.removeItem(STORAGE_KEY);
      window.setTimeout(() => fitView({ padding: 0.18, duration: 300 }), 50);
    },
    [data, fitView, layoutAlgorithm, setNodes],
  );

  const layoutItems = useMemo(
    () =>
      LAYOUT_OPTIONS.map((option) => ({
        id: option,
        label: LAYOUT_LABELS[option],
      })),
    [],
  );

  const relationItems = useMemo(
    () =>
      RELATION_VISIBILITY_OPTIONS.map((option) => ({
        id: option,
        label: RELATION_VISIBILITY_LABELS[option],
      })),
    [],
  );

  if (error) {
    return (
      <div className="flex min-h-[30rem] items-center justify-center border border-elevation-outline-default-1 bg-elevation-fill-default-1 p-8">
        <Typography
          as="p"
          size="body-2"
          className="text-text-error-1"
        >
          Failed to load ER diagram: {error}
        </Typography>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[30rem] items-center justify-center border border-elevation-outline-default-1 bg-elevation-fill-default-1 p-8">
        <Typography
          as="p"
          size="body-2"
          className="text-text-default-2"
        >
          Loading ER diagram...
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <div className="flex flex-col gap-3 border border-elevation-outline-default-1 bg-elevation-fill-default-1 p-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {stats && (
            <>
              <Stat
                label="tables"
                value={stats.tables}
              />
              <Stat
                label="columns"
                value={stats.columns}
              />
              <Stat
                label="relations"
                value={stats.relationships}
              />
            </>
          )}
        </div>

        <div className="flex flex-1 justify-end gap-2 *:w-fit! flex-wrap">
          <Segment
            value={layoutAlgorithm}
            onChange={(value: any) => handleResetLayout((value ?? "schema") as LayoutAlgorithm)}
            items={layoutItems}
          />
          <Segment
            value={relationVisibility}
            onChange={(value: any) => setRelationVisibility((value ?? "focused") as RelationVisibility)}
            items={relationItems}
          />
        </div>
      </div>

      <div className="relative h-[calc(100vh-12rem)] min-h-[36rem] w-full overflow-hidden border border-elevation-outline-default-1 bg-elevation-fill-default-2 shadow-inner">
        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.15}
          maxZoom={1.6}
          defaultEdgeOptions={{
            type: "relation",
            markerEnd: "er-arrow",
            markerStart: "er-crowsfoot",
          }}
          proOptions={{ hideAttribution: true }}
        >
          <svg
            className="absolute top-0 left-0"
            width={1}
            height={1}
            style={{ overflow: "visible" }}
          >
            <defs>
              <marker
                id="er-crowsfoot"
                markerWidth="14"
                markerHeight="14"
                refX="7"
                refY="7"
                orient="auto"
              >
                <path
                  d="M 1 4 L 7 7 L 1 10 M 7 1 L 7 13"
                  fill="none"
                  stroke="rgb(var(--text-default-3-base))"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </marker>
              <marker
                id="er-arrow"
                markerWidth="14"
                markerHeight="14"
                refX="12"
                refY="7"
                orient="auto"
              >
                <path
                  d="M 3 2 L 12 7 L 3 12 Z"
                  fill="rgb(var(--text-default-3-base))"
                  stroke="rgb(var(--text-default-3-base))"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
              <marker
                id="er-crowsfoot-highlight"
                markerWidth="14"
                markerHeight="14"
                refX="7"
                refY="7"
                orient="auto"
              >
                <path
                  d="M 1 4 L 7 7 L 1 10 M 7 1 L 7 13"
                  fill="none"
                  stroke="rgb(var(--interactive-contained-primary-idle-base))"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </marker>
              <marker
                id="er-arrow-highlight"
                markerWidth="14"
                markerHeight="14"
                refX="12"
                refY="7"
                orient="auto"
              >
                <path
                  d="M 3 2 L 12 7 L 3 12 Z"
                  fill="rgb(var(--interactive-contained-primary-idle-base))"
                  stroke="rgb(var(--interactive-contained-primary-idle-base))"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>
          </svg>

          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgb(var(--elevation-outline-default-2-base))"
          />
          <MiniMap
            pannable
            zoomable
            nodeColor="rgb(var(--elevation-fill-default-1-base))"
            nodeStrokeColor="rgb(var(--elevation-outline-default-2-base))"
            maskColor="rgb(var(--elevation-fill-default-2-base) / 0.72)"
          />
          <Controls showInteractive={false} />

          <div
            className="absolute bottom-3 z-10 flex items-center gap-2"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            <Button
              width="hug"
              size="s"
              variant="outlined"
              color="secondary"
              icon={RefreshCcw}
              onPress={() => handleResetLayout()}
            >
              Reset layout
            </Button>
            <Button
              width="hug"
              size="s"
              variant="outlined"
              color="secondary"
              icon={Maximize}
              onPress={() => fitView({ padding: 0.18, duration: 300 })}
            >
              Fit view
            </Button>
          </div>
        </ReactFlow>
      </div>
    </div>
  );
}
