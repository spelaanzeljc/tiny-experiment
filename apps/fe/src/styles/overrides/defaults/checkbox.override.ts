import { type CheckboxVariantProps, compoundMapper, UIOverrides, type TypographyVariantProps } from "@povio/ui";

import { uiGroupOutlineClass } from "@/styles/overrides/outline.clsx";

export const checkboxOverride = UIOverrides.defineOverride("checkbox.cva", {
  mode: "overrideCva",
  base: ["flex items-center justify-center border-2", "relative size-4 shrink-0 rounded-xs p-1", uiGroupOutlineClass],
  config: {
    variants: {
      variant: {
        default: [
          "m-1 border-interactive-outlined-secondary-on-idle",
          "text-interactive-contained-primary-on-idle",
          "group-hover:text-interactive-contained-primary-on-hover",
          "group-pressed:text-interactive-contained-primary-on-pressed",
          "group-disabled:text-interactive-contained-primary-on-disabled",
          "group-disabled:border-interactive-outlined-secondary-on-disabled",
          "group-hover:border-interactive-outlined-secondary-on-hover",
          "group-pressed:border-interactive-outlined-secondary-on-pressed",
          "group-selected:border-interactive-contained-primary-idle",
          "group-selected:bg-interactive-contained-primary-idle",
          "group-selected:group-hover:bg-interactive-contained-primary-hover",
          "group-selected:group-hover:border-interactive-contained-primary-hover",
          "group-selected:group-pressed:bg-interactive-contained-primary-pressed",
          "group-selected:group-pressed:border-interactive-contained-primary-pressed",
          "group-selected:group-disabled:bg-interactive-contained-primary-disabled",
          "group-selected:group-disabled:border-interactive-contained-primary-disabled",
          "group-indeterminate:border-interactive-contained-primary-idle",
          "group-indeterminate:bg-interactive-contained-primary-idle",
          "group-indeterminate:group-hover:bg-interactive-contained-primary-hover",
          "group-indeterminate:group-hover:border-interactive-contained-primary-hover",
          "group-indeterminate:group-pressed:bg-interactive-contained-primary-pressed",
          "group-indeterminate:group-pressed:border-interactive-contained-primary-pressed",
          "group-indeterminate:group-disabled:bg-interactive-contained-primary-disabled",
          "group-indeterminate:group-disabled:border-interactive-contained-primary-disabled",
          "group-invalid:border-interactive-outlined-error-on-idle",
          "group-focus-visible:outline-interactive-contained-primary-focus",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

export const checkboxIndicatorClass = "group flex items-center gap-2";

export const checkboxTypography = compoundMapper<TypographyVariantProps, CheckboxVariantProps>({
  default: {
    size: "label-1",
    sizeMobile: "label-1",
    variant: "default",
  },
});

export const checkboxIconOverride = UIOverrides.defineOverride("checkbox.iconCva", {
  mode: "overrideCva",
  base: ["absolute hidden size-3"],
  config: {
    variants: {
      iconVariant: {
        selected: ["group-selected:block"],
        indeterminate: ["group-indeterminate:block"],
      },
    },
    defaultVariants: {
      iconVariant: "selected",
    },
  },
});
