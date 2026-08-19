import type { TableNodeData } from "./TableNode";

export type LayoutAlgorithm = "schema" | "dagre-lr" | "dagre-tb" | "grid";

export type RelationVisibility = "all" | "focused" | "hidden";

export const LAYOUT_OPTIONS: LayoutAlgorithm[] = ["schema", "dagre-lr", "dagre-tb", "grid"];

export const RELATION_VISIBILITY_OPTIONS: RelationVisibility[] = ["all", "focused", "hidden"];

export interface ErDiagramData {
  tables: { id: string; tableName: string; columns: TableNodeData["columns"] }[];
  relationships: { from: string; to: string; col: string; toCol?: string }[];
}
