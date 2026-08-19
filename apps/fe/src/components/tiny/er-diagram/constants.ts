export const STORAGE_KEY = "fake-be-er-diagram-layout-v2";
export const NODE_WIDTH = 220;
export const HEADER_HEIGHT = 38;
export const ROW_HEIGHT = 24;
export const ROWS_PADDING = 12;

export function getNodeHeight(columnCount: number): number {
  return HEADER_HEIGHT + ROW_HEIGHT * columnCount + ROWS_PADDING;
}
