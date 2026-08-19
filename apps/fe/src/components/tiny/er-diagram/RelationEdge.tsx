import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath } from "@xyflow/react";

export interface RelationEdgeData extends Record<string, unknown> {
  column: string;
  targetColumn?: string;
  isDimmed?: boolean;
  isHighlighted?: boolean;
  showLabel?: boolean;
}

const relationColor = "rgb(var(--text-default-3-base))";
const relationMutedColor = "rgb(var(--elevation-outline-default-2-base))";
const relationHighlightColor = "rgb(var(--interactive-contained-primary-idle-base))";

function getRelationStroke(isHighlighted: boolean, isDimmed: boolean) {
  if (isHighlighted) {
    return relationHighlightColor;
  }

  if (isDimmed) {
    return relationMutedColor;
  }

  return relationColor;
}

export function RelationEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  markerStart,
  selected,
  data,
}: EdgeProps) {
  const edgeData = data as RelationEdgeData | undefined;
  const isHighlighted = Boolean(edgeData?.isHighlighted || selected);
  const isDimmed = Boolean(edgeData?.isDimmed && !isHighlighted);
  const shouldShowLabel = Boolean(edgeData?.showLabel || selected || isHighlighted);
  const stroke = getRelationStroke(isHighlighted, isDimmed);
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 12,
    offset: 28,
  });

  const label = edgeData?.targetColumn ? `${edgeData.column} -> ${edgeData.targetColumn}` : edgeData?.column;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
        interactionWidth={18}
        style={{
          stroke,
          strokeWidth: isHighlighted ? 2.5 : 1.5,
          opacity: isDimmed ? 0.35 : 1,
        }}
      />

      {shouldShowLabel && label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute rounded-xs border border-elevation-outline-default-1 bg-elevation-fill-default-1 px-1-5 py-0-5 font-mono text-label-3 text-text-default-2 shadow-1"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
