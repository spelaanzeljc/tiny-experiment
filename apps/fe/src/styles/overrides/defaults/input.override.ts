import { UIOverrides, uiOutlineClass } from "@povio/ui";

export const inputBaseOverride = UIOverrides.defineOverride("input.baseCva", {
  mode: "overrideCva",
  base: [uiOutlineClass, "flex w-full not-[textarea]:truncate"],
  config: {
    variants: {
      variant: {
        outlined: "",
        filled: "",
      },
      as: {
        default: "rounded-input-rounding-default",
        floating: "rounded-input-rounding-default",
        filter: "rounded-input-rounding-default",
        inline: [
          "h-full",
          "border-transparent border-b-0 bg-transparent text-text-default-1",
          "hover:border-input-outlined-outline-hover",
          "focus-within:border-input-outlined-outline-active",
          "invalid:border-input-outlined-outline-error",
          "has-invalid:border-input-outlined-outline-error",
          "disabled:hover:border-transparent",
          "has-disabled:hover:border-transparent",
        ],
      },
    },
    compoundVariants: [
      {
        variant: "outlined",
        as: "default",
        className: [
          "border border-input-outlined-outline-idle border-solid bg-input-outlined-idle text-text-default-1",
          "hover:border-input-outlined-outline-hover hover:border-solid hover:bg-input-outlined-hover hover:text-text-default-1",
          "focus-within:border-input-outlined-outline-active focus-within:border-solid focus-within:bg-input-outlined-active focus-within:text-text-default-1",
          "invalid:border-input-outlined-outline-error invalid:border-solid invalid:bg-input-outlined-error invalid:text-text-default-1",
          "has-invalid:border-input-outlined-outline-error has-invalid:border-solid has-invalid:bg-input-outlined-error has-invalid:text-text-default-1",
          "disabled:border-input-outlined-outline-disabled disabled:border-solid disabled:bg-input-outlined-disabled disabled:text-text-default-3",
          "has-disabled:border-input-outlined-outline-disabled has-disabled:border-solid has-disabled:bg-input-outlined-disabled has-disabled:text-text-default-3",
          "disabled:hover:border-input-outlined-outline-disabled disabled:hover:bg-input-outlined-disabled disabled:hover:text-text-default-3",
          "has-disabled:hover:border-input-outlined-outline-disabled has-disabled:hover:bg-input-outlined-disabled has-disabled:hover:text-text-default-3",
          "[&_input]:placeholder:text-text-default-3",
          "disabled:placeholder:text-interactive-text-secondary-disabled",
          "has-disabled:placeholder:text-interactive-text-secondary-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
          "has-focus-visible:outline-interactive-contained-primary-focus",
        ],
      },
      {
        variant: "filled",
        as: "default",
        className: [
          "border border-transparent border-solid bg-input-filled-idle text-text-default-1",
          "hover:border-input-filled-outline-hover hover:border-solid hover:bg-input-filled-hover hover:text-text-default-1",
          "focus-within:border-input-filled-outline-active focus-within:border-solid focus-within:bg-input-filled-active focus-within:text-text-default-1",
          "invalid:border-input-filled-outline-error invalid:border-solid invalid:bg-input-filled-error invalid:text-text-default-1",
          "has-invalid:border-input-filled-outline-error has-invalid:border-solid has-invalid:bg-input-filled-error has-invalid:text-text-default-1",
          "disabled:bg-input-filled-disabled disabled:text-text-default-3",
          "has-disabled:bg-input-filled-disabled has-disabled:text-text-default-3",
          "disabled:hover:border-transparent disabled:hover:bg-input-filled-disabled disabled:hover:text-text-default-3",
          "has-disabled:hover:border-transparent has-disabled:hover:bg-input-filled-disabled has-disabled:hover:text-text-default-3",
          "[&_input]:placeholder:text-text-default-3",
          "disabled:placeholder:text-interactive-text-secondary-disabled",
          "has-disabled:placeholder:text-interactive-text-secondary-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
          "has-focus-visible:outline-interactive-contained-primary-focus",
        ],
      },
      {
        variant: "outlined",
        as: "floating",
        className: [
          "border border-input-outlined-outline-idle border-solid bg-input-outlined-idle text-text-default-1",
          "hover:border-input-outlined-outline-hover hover:border-solid hover:bg-input-outlined-hover hover:text-text-default-1",
          "focus-within:border-input-outlined-outline-active focus-within:border-solid focus-within:bg-input-outlined-active focus-within:text-text-default-1",
          "invalid:border-input-outlined-outline-error invalid:border-solid invalid:bg-input-outlined-error invalid:text-text-default-1",
          "has-invalid:border-input-outlined-outline-error has-invalid:border-solid has-invalid:bg-input-outlined-error has-invalid:text-text-default-1",
          "disabled:border-input-outlined-outline-disabled disabled:border-solid disabled:bg-input-outlined-disabled disabled:text-text-default-3",
          "has-disabled:border-input-outlined-outline-disabled has-disabled:border-solid has-disabled:bg-input-outlined-disabled has-disabled:text-text-default-3",
          "disabled:hover:border-input-outlined-outline-disabled disabled:hover:bg-input-outlined-disabled disabled:hover:text-text-default-3",
          "has-disabled:hover:border-input-outlined-outline-disabled has-disabled:hover:bg-input-outlined-disabled has-disabled:hover:text-text-default-3",
          "[&_input]:placeholder:text-text-default-3",
          "disabled:placeholder:text-interactive-text-secondary-disabled",
          "has-disabled:placeholder:text-interactive-text-secondary-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
          "has-focus-visible:outline-interactive-contained-primary-focus",
        ],
      },
      {
        variant: "filled",
        as: "floating",
        className: [
          "border border-transparent border-solid bg-input-filled-idle text-text-default-1",
          "hover:border-input-filled-outline-hover hover:border-solid hover:bg-input-filled-hover hover:text-text-default-1",
          "focus-within:border-input-outlined-outline-active focus-within:border-solid focus-within:bg-input-outlined-idle focus-within:text-text-default-1",
          "invalid:border-input-filled-outline-error invalid:border-solid invalid:bg-input-filled-error invalid:text-text-default-1",
          "has-invalid:border-input-filled-outline-error has-invalid:border-solid has-invalid:bg-input-filled-error has-invalid:text-text-default-1",
          "disabled:bg-input-filled-disabled disabled:text-text-default-3",
          "has-disabled:bg-input-filled-disabled has-disabled:text-text-default-3",
          "disabled:hover:border-transparent disabled:hover:bg-input-filled-disabled disabled:hover:text-text-default-3",
          "has-disabled:hover:border-transparent has-disabled:hover:bg-input-filled-disabled has-disabled:hover:text-text-default-3",
          "[&_input]:placeholder:text-text-default-3",
          "disabled:placeholder:text-interactive-text-secondary-disabled",
          "has-disabled:placeholder:text-interactive-text-secondary-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
          "has-focus-visible:outline-interactive-contained-primary-focus",
        ],
      },
      {
        variant: "outlined",
        as: "filter",
        className: [
          "border border-input-outlined-outline-idle border-solid bg-input-outlined-idle text-text-default-1",
          "hover:border-input-outlined-outline-hover hover:border-solid hover:bg-input-outlined-hover hover:text-text-default-1",
          "focus-within:border-input-outlined-outline-active focus-within:border-solid focus-within:bg-input-outlined-active focus-within:text-text-default-1",
          "invalid:border-input-outlined-outline-error invalid:border-solid invalid:bg-input-outlined-error invalid:text-text-default-1",
          "has-invalid:border-input-outlined-outline-error has-invalid:border-solid has-invalid:bg-input-outlined-error has-invalid:text-text-default-1",
          "disabled:border-input-outlined-outline-disabled disabled:border-solid disabled:bg-input-outlined-disabled disabled:text-text-default-3",
          "has-disabled:border-input-outlined-outline-disabled has-disabled:border-solid has-disabled:bg-input-outlined-disabled has-disabled:text-text-default-3",
          "disabled:hover:border-input-outlined-outline-disabled disabled:hover:bg-input-outlined-disabled disabled:hover:text-text-default-3",
          "has-disabled:hover:border-input-outlined-outline-disabled has-disabled:hover:bg-input-outlined-disabled has-disabled:hover:text-text-default-3",
          "[&_input]:placeholder:text-text-default-3",
          "disabled:placeholder:text-interactive-text-secondary-disabled",
          "has-disabled:placeholder:text-interactive-text-secondary-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
          "has-focus-visible:outline-interactive-contained-primary-focus",
        ],
      },
      {
        variant: "filled",
        as: "filter",
        className: [
          "border border-transparent border-solid bg-input-filled-idle text-text-default-1",
          "hover:border-input-filled-outline-hover hover:border-solid hover:bg-input-filled-hover hover:text-text-default-1",
          "focus-within:border-input-filled-outline-active focus-within:border-solid focus-within:bg-input-filled-active focus-within:text-text-default-1",
          "has-invalid:border-input-filled-outline-error has-invalid:border-solid has-invalid:bg-input-filled-error has-invalid:text-text-default-1",
          "invalid:border-input-filled-outline-error invalid:border-solid invalid:bg-input-filled-error invalid:text-text-default-1",
          "disabled:bg-input-filled-disabled disabled:text-text-default-3",
          "has-disabled:bg-input-filled-disabled has-disabled:text-text-default-3",
          "disabled:hover:border-transparent disabled:hover:bg-input-filled-disabled disabled:hover:text-text-default-3",
          "has-disabled:hover:border-transparent has-disabled:hover:bg-input-filled-disabled has-disabled:hover:text-text-default-3",
          "[&_input]:placeholder:text-text-default-3",
          "disabled:placeholder:text-interactive-text-secondary-disabled",
          "has-disabled:placeholder:text-interactive-text-secondary-disabled",
          "focus-visible:outline-interactive-contained-primary-focus",
          "has-focus-visible:outline-interactive-contained-primary-focus",
        ],
      },
    ],
    defaultVariants: {
      variant: "outlined",
      as: "default",
    },
  },
});

export const inputSizeOverride = UIOverrides.defineOverride("input.sizeCva", {
  mode: "overrideCva",
  base: [""],
  config: {
    compoundVariants: [
      {
        as: ["default", "filter", "inline"],
        className: "px-input-side-xs py-input-height-xs text-label-2! [&>button>p]:text-label-2! ",
        size: "extra-small",
      },
      {
        as: ["default", "filter", "inline"],
        className: "px-input-side-s py-input-height-s",
        size: "small",
      },
      {
        as: ["default", "filter", "inline"],
        className: "px-input-side-m py-input-height-m",
        size: "default",
      },
      {
        as: ["default", "filter", "inline"],
        className: "px-input-side-l py-input-height-l",
        size: "large",
      },
      {
        as: ["filter"],
        className:
          "text-label-2! [&_[data-type=select-trigger]]:text-left [&>button]:text-left [&>button>p]:text-left [&>label]:text-text-default-2! pr-0",
        size: "extra-small",
      },
    ],
    defaultVariants: {
      as: "default",
      size: "default",
    },
    variants: {
      as: {
        default: "",
        filter: "",
        floating: [
          "px-input-side-m",
          "py-floating-label-input-height-empty",

          // "input-filled" selector defined in tw-ui-plugin.ts in @povio/ui as a Tailwind Plugin
          "input-filled:pb-[calc(var(--spacing-floating-label-input-height-filled)+var(--spacing-floating-label-input-offset-bottom))]",
          "input-filled:pt-[calc(var(--spacing-floating-label-input-height-filled)+var(--spacing-floating-label-input-offset-top)+var(--text-label-3--line-height)*var(--text-label-3))]",
        ],
        inline: "",
      },
      size: {
        default: "text-label-1",
        "extra-small": "text-label-1",
        large: "text-label-1",
        small: "text-label-1",
      },
    },
  },
});

export const inputSideOverride = UIOverrides.defineOverride("input.sideCva", {
  mode: "overrideCva",
  base: [""],
  config: {
    compoundVariants: [
      { className: "left-input-side-xs", size: "extra-small", type: "left" },
      { className: "right-input-side-xs", size: "extra-small", type: "right" },
      { className: "--spacing-input-side-xs", size: "extra-small", type: "var" },
      { className: "left-input-side-s", size: "small", type: "left" },
      { className: "right-input-side-s", size: "small", type: "right" },
      { className: "--spacing-input-side-s", size: "small", type: "var" },
      { className: "left-input-side-m", size: "default", type: "left" },
      { className: "right-input-side-m", size: "default", type: "right" },
      { className: "--spacing-input-side-m", size: "default", type: "var" },
      { className: "left-input-side-l", size: "large", type: "left" },
      { className: "right-input-side-l", size: "large", type: "right" },
      { className: "--spacing-input-side-l", size: "large", type: "var" },
    ],
    defaultVariants: {
      size: "default",
    },
    variants: {
      size: {
        default: "",
        "extra-small": "",
        large: "",
        small: "",
      },
      type: {
        left: "",
        right: "",
        var: "",
      },
    },
  },
});
