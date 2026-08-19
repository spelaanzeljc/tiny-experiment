import "@povio/ui";
import type { UIOverrides } from "@povio/ui";
import type { LinkProps } from "@tanstack/react-router";
import type { RowData } from "@tanstack/react-table";

import type { tableRowOverride } from "@/styles/overrides/defaults/table.override";
import type { typographyOverride } from "@/styles/overrides/defaults/typography.override";

declare module "@povio/ui" {
  interface LinkNavigationProps extends LinkProps {}

  interface TypographyVariantProps {
    size?: UIOverrides.VariantProps<typeof typographyOverride>["size"];
    sizeMobile?: UIOverrides.VariantProps<typeof typographyOverride>["sizeMobile"];
  }

  interface TableRowVariantProps {
    rowSize?: UIOverrides.VariantProps<typeof tableRowOverride>["rowSize"];
  }
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterKey?: string;
  }
}
