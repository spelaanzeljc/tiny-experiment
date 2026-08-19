import { UIOverrides } from "@povio/ui";

export const modalContentOverride = UIOverrides.defineOverride("modal.contentCva", {
  mode: "overrideCva",
  base: [
    "relative flex flex-col items-center gap-modal-gap-content px-modal-side-mobile py-modal-height-mobile md:px-modal-side-desktop md:py-modal-height-desktop",
    "w-fit max-w-full [&>*]:max-w-full",
    "border-elevation-outline-default-1 bg-elevation-fill-default-1 outline-none",
    "pointer-events-auto",
  ],
  config: {
    defaultVariants: {
      aside: "center",
    },
    variants: {
      aside: {
        center: "rounded-modal-rounding-default border",
        left: "h-screen rounded-none border-r",
        right: "h-screen rounded-none border-l",
      },
    },
  },
});

export const modalOverlayOverride = UIOverrides.defineOverride("modal.overlayCva", {
  mode: "overrideCva",
  base: ["fixed inset-0 z-15 flex h-(--visual-viewport-height) w-screen overflow-y-auto bg-support-overlay"],
  config: {
    defaultVariants: {
      aside: "center",
    },
    variants: {
      aside: {
        center: "p-4",
        left: "p-0",
        right: "p-0",
      },
    },
  },
});

export const modalMainOverride = UIOverrides.defineOverride("modal.mainCva", {
  mode: "overrideCva",
  base: ["pointer-events-none my-auto flex w-full"],
  config: {
    defaultVariants: {
      aside: "center",
    },
    variants: {
      aside: {
        center: "justify-center",
        left: "entering:animate-drawer-enter-left exiting:animate-drawer-exit-left justify-start",
        right: "entering:animate-drawer-enter-right exiting:animate-drawer-exit-right justify-end",
      },
    },
  },
});
