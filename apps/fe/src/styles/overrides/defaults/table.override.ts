import { UIOverrides } from "@povio/ui";

export const tableHeadDataOverride = UIOverrides.defineOverride("table.headDataCva", {
  mode: "overrideCva",
  base: [
    "border-b border-b-elevation-outline-default-1 border-solid text-left",
    "px-[calc(var(--container-table-header-cell-container-side-default)+var(--container-table-cell-content-side-m))]",
    "py-[calc(var(--container-table-header-cell-container-height-xs)+var(--container-table-cell-content-height-m))]",
    "group-data-[is-sticky=true]/table-head:bg-elevation-fill-default-1",
  ],
  config: {
    defaultVariants: {
      hasRightBorder: false,
    },
    variants: {
      hasRightBorder: {
        false: "",
        true: "border-l border-l-elevation-outline-default-1 border-solid",
      },
    },
  },
});

export interface TableHeadDataVariantProps extends UIOverrides.OverrideVariantProps<typeof tableHeadDataOverride> {}

export const tableRowOverride = UIOverrides.defineOverride("table.rowCva", {
  mode: "overrideCva",
  base: [
    "h-9 max-h-12",
    "data-clickable:hover:bg-elevation-fill-default-2-5",
    "disabled:opacity-50",
    "selected:bg-elevation-fill-default-4",
    "data-clickable:hover:selected:bg-elevation-fill-3",
    "data-clickable:cursor-pointer",
    "focus-within:bg-elevation-fill-default-4",
  ],
  config: {
    defaultVariants: {
      actionsOnHover: false,
      disableInteractions: false,
    },
    variants: {
      actionsOnHover: {
        false: "",
        true: "group/actions-on-hover actions-on-hover",
      },
      alternatingBackground: {
        even: "even:bg-elevation-fill-inverted-4/5",
        odd: "odd:bg-elevation-fill-inverted-4/5",
      },
      disableInteractions: {
        false: "",
        true: [
          "hover:!bg-transparent",
          "focus-within:!bg-transparent",
          "selected:!bg-transparent",
          "hover:selected:!bg-transparent",
          "data-clickable:!cursor-default",
        ],
      },
    },
  },
});

export interface TableRowVariantProps extends UIOverrides.OverrideVariantProps<typeof tableRowOverride> {}

export const tableDataOverride = UIOverrides.defineOverride("table.dataCva", {
  mode: "overrideCva",
  base: [
    "relative h-0-5 overflow-hidden text-ellipsis whitespace-nowrap border-t border-t-transparent px-2",
    "px-[calc(var(--container-table-cell-container-side-default)+var(--container-table-cell-content-side-m))]",
    "py-[calc(var(--container-table-cell-container-height-xs)+var(--container-table-cell-content-height-s))]",
    "border-b border-b-elevation-outline-default-1",
    "has-[*>[data-invalid]]:border-b-input-outlined-outline-error!",
    "outline-none focus:outline-none focus-visible:outline-none",
  ],
  config: {
    defaultVariants: {
      hasRightBorder: false,
    },
    variants: {
      hasRightBorder: {
        false: "",
        true: "border-l border-l-elevation-outline-default-1",
      },
    },
  },
});

export interface TableDataVariantProps extends UIOverrides.OverrideVariantProps<typeof tableDataOverride> {}

export const tableHeaderTextOverride = UIOverrides.defineOverride("table.headerTextCva", {
  mode: "overrideCva",
  base: ["whitespace-nowrap"],
});

export interface TableHeaderTextVariantProps extends UIOverrides.OverrideVariantProps<typeof tableHeaderTextOverride> {}

export const tableCellTextOverride = UIOverrides.defineOverride("table.cellTextCva", {
  mode: "overrideCva",
  base: ["block overflow-hidden text-ellipsis text-text-default-2"],
});

export interface TableCellTextVariantProps extends UIOverrides.OverrideVariantProps<typeof tableCellTextOverride> {}
