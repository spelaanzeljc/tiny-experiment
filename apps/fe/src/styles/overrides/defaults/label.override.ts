import { type TypographyVariantProps, UIOverrides, compoundMapper, type labelDefinition } from "@povio/ui";

export const labelBaseOverride = UIOverrides.defineOverride("label.cva", {
  mode: "overrideCva",
  base: [""],
  config: {
    defaultVariants: {
      as: "default",
    },
    variants: {
      as: {
        default: ["flex items-start gap-1 text-text-default-1"],
        filter: ["text-text-default-1"],
        floating: [
          "pointer-events-none",
          "absolute transition-all duration-75",
          "top-1/2 -translate-y-1/2",

          "text-text-default-3",

          // "input-disabled" selector defined in tw-ui-plugin.ts in @povio/ui as a Tailwind Plugin
          "input-disabled:text-interactive-text-secondary-disabled!",

          // "input-filled" selector defined in tw-ui-plugin.ts in @povio/ui as a Tailwind Plugin
          "input-filled:top-[calc(var(--spacing-floating-label-input-height-filled)+var(--spacing-floating-label-input-offset-top))]",
          "input-filled:translate-y-0",
          "input-filled:text-text-default-1",
          "input-filled:font-semibold!",
          "input-filled:text-label-3!",

          // TextArea
          "group-data-[text-area]/text-area:top-floating-label-input-height-empty group-data-[text-area]/text-area:translate-y-0",
          "group-has-[textarea:not(:placeholder-shown)]/text-area:hidden",

          // TextEditor
          "group-data-[text-editor]/text-editor:top-floating-label-input-height-empty group-data-[text-editor]/text-editor:left-input-side-default group-data-[text-editor]/text-editor:translate-y-0",
          "group-data-[is-filled=true]/text-editor:hidden",
        ],
        inline: ["flex items-start gap-1 text-text-default-1"],
      },
    },
  },
});

export type LabelConfig = NonNullable<typeof labelDefinition.config>;
export interface LabelBaseProps extends UIOverrides.VariantProps<LabelConfig> {}

export const labelTypography = compoundMapper<TypographyVariantProps, LabelBaseProps>({
  compoundVariants: [
    {
      as: "default",
      value: {
        size: "label-2",
        sizeMobile: "label-2",
        variant: "prominent-1",
      },
    },
    {
      as: "filter",
      value: {
        size: "label-2",
        sizeMobile: "label-2",
        variant: "default",
      },
    },
    {
      as: "inline",
      value: {
        size: "label-2",
        sizeMobile: "label-2",
        variant: "prominent-1",
      },
    },
    {
      as: "floating",
      value: {
        size: "label-1",
        sizeMobile: "label-1",
        variant: "default",
      },
    },
  ],
  default: {
    size: "label-2",
    sizeMobile: "label-2",
    variant: "prominent-1",
  },
  defaultVariants: {
    as: "default",
  },
});
