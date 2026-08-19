import { type TypographyVariantProps, UIOverrides, compoundMapper } from "@povio/ui";

export const radioOverride = UIOverrides.defineOverride("radio.cva", {
  mode: "overrideCva",
  base: [
    "flex items-center justify-center border-2",
    "relative size-3-5 rounded-full p-1-5",
    "before:absolute before:hidden before:size-1 before:rounded-full",
  ],
  config: {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: [
          "border-interactive-outlined-secondary-on-idle",
          "group-disabled:border-interactive-outlined-secondary-on-disabled",
          "group-hover:border-interactive-outlined-secondary-on-hover",
          "group-pressed:border-interactive-outlined-secondary-on-pressed",
          "group-selected:border-interactive-contained-primary-idle",
          "group-selected:bg-interactive-contained-primary-idle",
          "group-selected:group-disabled:bg-interactive-contained-primary-disabled",
          "group-selected:group-disabled:border-interactive-contained-primary-disabled",
          "group-invalid:border-interactive-outlined-error-on-idle",
          "group-focus-visible:outline-interactive-contained-primary-focus",
          "before:bg-interactive-contained-primary-on-idle",
          "group-hover:before:bg-interactive-contained-primary-on-hover",
          "group-selected:before:block",
        ],
      },
    },
  },
});

export interface RadioVariantProps extends UIOverrides.OverrideVariantProps<typeof radioOverride> {}

export const radioIndicatorClass = "group flex items-center gap-2";

export const radioTypography = compoundMapper<TypographyVariantProps, RadioVariantProps>({
  default: {
    size: "label-2",
    sizeMobile: "label-2",
    variant: "default",
  },
});
