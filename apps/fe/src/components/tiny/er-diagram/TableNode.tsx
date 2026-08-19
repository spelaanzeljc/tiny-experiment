import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

import { ColumnBadge } from "./ColumnBadge";
import { HEADER_HEIGHT, NODE_WIDTH } from "./constants";

export interface TableNodeData extends Record<string, unknown> {
  tableName: string;
  columns: {
    name: string;
    type: string;
    isPk: boolean;
    isFk?: boolean;
    isNullable?: boolean;
    isOptional?: boolean;
  }[];
  fkColumns?: string[];
  isConnected?: boolean;
  isMuted?: boolean;
}

export function TableNode(props: NodeProps) {
  const { data, selected } = props;
  const tableData = data as TableNodeData;
  const fkSet = new Set(tableData.fkColumns);
  const headerCenterY = HEADER_HEIGHT / 2;
  const isMuted = tableData.isMuted && !selected;
  const isRelated = tableData.isConnected && !selected;
  let borderClassName = "border-elevation-outline-default-1";

  if (selected) {
    borderClassName = "border-interactive-outlined-primary-outline-idle shadow-2";
  } else if (isRelated) {
    borderClassName = "border-interactive-outlined-primary-outline-disabled";
  }

  return (
    <div
      className={[
        "relative overflow-hidden rounded-sm border bg-elevation-fill-default-1 shadow-1 transition-[border-color,box-shadow,opacity]",
        borderClassName,
        isMuted ? "opacity-35" : "opacity-100",
      ].join(" ")}
      style={{ minWidth: NODE_WIDTH, width: NODE_WIDTH }}
    >
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        className="opacity-0!"
      />
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        className="opacity-0!"
        style={{ top: headerCenterY, left: 0, right: "auto" }}
      />
      <Handle
        type="target"
        id="right"
        position={Position.Right}
        className="opacity-0!"
        style={{ top: headerCenterY, right: 0, left: "auto" }}
      />
      <Handle
        type="target"
        id="bottom"
        position={Position.Bottom}
        className="opacity-0!"
      />

      <div className="flex items-center justify-between gap-2 border-elevation-outline-default-1 border-b bg-elevation-fill-default-2 px-3 py-2">
        <span className="truncate font-semibold text-label-2 text-text-default-1">{tableData.tableName}</span>
        <span className="shrink-0 rounded-xs bg-elevation-fill-default-3 px-1-5 py-0-5 font-medium text-label-3 text-text-default-2">
          {tableData.columns.length}
        </span>
      </div>

      <div className="px-1 py-1-5">
        {tableData.columns.map((column) => (
          <div
            key={column.name}
            className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xs px-2 py-1-5 text-label-3 hover:bg-elevation-fill-default-2"
          >
            <span className="min-w-0 truncate font-mono text-text-default-1">{column.name}</span>

            <div className="flex min-w-0 items-center justify-end gap-1-5">
              <span className="max-w-24 truncate text-label-3 text-text-default-3">{column.type}</span>
              {column.isPk && <ColumnBadge tone="warning">PK</ColumnBadge>}
              {column.isFk && <ColumnBadge tone="primary">FK</ColumnBadge>}
              {column.isNullable && <ColumnBadge tone="secondary">NULL</ColumnBadge>}
              {!column.isNullable && column.isOptional === false && <ColumnBadge tone="success">NN</ColumnBadge>}
            </div>

            {fkSet.has(column.name) && (
              <>
                <div className="absolute inset-y-0 left-0 flex items-center justify-start">
                  <Handle
                    type="source"
                    id={`${column.name}-left`}
                    position={Position.Left}
                    className="opacity-0!"
                  />
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center justify-end">
                  <Handle
                    type="source"
                    id={`${column.name}-right`}
                    position={Position.Right}
                    className="opacity-0!"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
