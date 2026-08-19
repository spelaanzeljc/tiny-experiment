import { UIOverrides, uiOutlineClass } from "@povio/ui";

export const tagOverride = UIOverrides.defineOverride("tag.cva", {
  mode: "overrideCva",
  base: [
    uiOutlineClass,
    "inline-flex items-center gap-list-gap-icon-to-label",
    "p-pill-height-s px-1-5",
    "rounded-pill-rounding-default",
    "overflow-hidden",
    "disabled:cursor-default",
    "border",
  ],
  config: {
    defaultVariants: {
      color: "primary",
    },
    variants: {
      color: {
        error: [
          "border-interactive-subtle-error-idle bg-interactive-subtle-error-idle text-interactive-subtle-error-on-idle",
          "hover:bg-interactive-subtle-error-hover hover:text-interactive-subtle-error-on-hover",
          "pressed:bg-interactive-subtle-error-pressed pressed:text-interactive-subtle-error-on-pressed",
          "disabled:bg-interactive-subtle-error-disabled disabled:text-interactive-subtle-error-on-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
        ],
        primary: [
          "border-interactive-subtle-primary-idle bg-interactive-subtle-primary-idle text-interactive-subtle-primary-on-idle",
          "hover:bg-interactive-subtle-primary-hover hover:text-interactive-subtle-primary-on-hover",
          "pressed:bg-interactive-subtle-primary-pressed pressed:text-interactive-subtle-primary-on-pressed",
          "disabled:bg-interactive-subtle-primary-disabled disabled:text-interactive-subtle-primary-on-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
        ],
        purple: ["border-support-status-purple-bg bg-support-status-purple-bg text-support-status-purple-on"],
        secondary: [
          "border-interactive-subtle-secondary-idle bg-interactive-subtle-secondary-idle text-interactive-subtle-secondary-on-idle",
          "hover:bg-interactive-subtle-secondary-hover hover:text-interactive-subtle-secondary-on-hover",
          "pressed:bg-interactive-subtle-secondary-pressed pressed:text-interactive-subtle-secondary-on-pressed",
          "disabled:bg-interactive-subtle-secondary-disabled disabled:text-interactive-subtle-secondary-on-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
        ],
        success: [
          "border-interactive-subtle-success-idle bg-interactive-subtle-success-idle text-interactive-subtle-success-on-idle",
          "hover:bg-interactive-subtle-success-hover hover:text-interactive-subtle-success-on-hover",
          "pressed:bg-interactive-subtle-success-pressed pressed:text-interactive-subtle-success-on-pressed",
          "disabled:bg-interactive-subtle-success-disabled disabled:text-interactive-subtle-success-on-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
        ],
        teal: ["border-support-status-teal-bg bg-support-status-teal-bg text-support-status-teal-on"],
        warning: [
          "border-interactive-subtle-warning-idle bg-interactive-subtle-warning-idle text-interactive-subtle-warning-on-idle",
          "hover:bg-interactive-subtle-warning-hover hover:text-interactive-subtle-warning-on-hover",
          "pressed:bg-interactive-subtle-warning-pressed pressed:text-interactive-subtle-warning-on-pressed",
          "disabled:bg-interactive-subtle-warning-disabled disabled:text-interactive-subtle-warning-on-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
        ],
        white: [
          "border-interactive-subtle-secondary-idle bg-support-status-white-bg text-interactive-subtle-secondary-on-idle",
        ],
        yellow: ["border-support-status-yellow-bg bg-support-status-yellow-bg text-support-status-yellow-on"],
      },
    },
  },
});

export interface TagVariantProps extends UIOverrides.OverrideVariantProps<typeof tagOverride> {}
