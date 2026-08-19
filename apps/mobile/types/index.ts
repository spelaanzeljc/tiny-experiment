export enum ButtonVariantEnum {
  primary = "primary",
  secondary = "secondary",
  outlined = "outlined",
}

export type ButtonVariant = keyof typeof ButtonVariantEnum;

export enum ButtonWidthEnum {
  s = "s",
  m = "m",
  l = "l",
  fit = "fit",
}
export type ButtonWidth = keyof typeof ButtonWidthEnum;

export enum ButtonSizeEnum {
  small = "small",
  default = "default",
  large = "large",
}

export type ButtonSize = keyof typeof ButtonSizeEnum;

export enum LoaderPositionEnum {
  left = "left",
  right = "right",
}

export enum IconButtonSizeEnum {
  s = "s",
  m = "m",
  l = "l",
}

export enum IconButtonVariantEnum {
  primary = "primary",
  secondary = "secondary",
  outlined = "outlined",
  transparent = "transparent",
}

export type IconButtonVariant = keyof typeof IconButtonVariantEnum;

export type IconButtonSize = keyof typeof IconButtonSizeEnum;

export type LoaderPosition = keyof typeof LoaderPositionEnum;

export enum PillButtonVariantEnum {
  primary = "primary",
  toggle = "toggle",
}

export type PillButtonVariant = keyof typeof PillButtonVariantEnum;

export enum TextButtonVariantEnum {
  primary = "primary",
  secondary = "secondary",
  dual = "dual",
  toast = "toast",
}

export type TextButtonVariant = keyof typeof TextButtonVariantEnum;

export enum InputVariantEnum {
  outlined = "outlined",
  filled = "filled",
}

export type InputVariant = keyof typeof InputVariantEnum;

export enum InputTypeEnum {
  input = "input",
  textArea = "textArea",
}

export type InputType = keyof typeof InputTypeEnum;

export enum SelectTypeEnum {
  single = "single",
  multiple = "multiple",
}

export type SelectType = keyof typeof SelectTypeEnum;

export type SelectVariant = "single" | "multi";

export enum ToastVariantEnum {
  neutral = "neutral",
  success = "success",
  warning = "warning",
  error = "error",
}

export type ToastVariant = keyof typeof ToastVariantEnum;

export enum ModalContentVariantEnum {
  textOnly = "textOnly",
  textImage = "textImage",
  input = "input",
  imageOkay = "imageOkay",
}

export type ModalContentVariant = keyof typeof ModalContentVariantEnum;

export enum DrawerContentVariantEnum {
  textOnly = "textOnly",
}

export type DrawerContentVariant = keyof typeof DrawerContentVariantEnum;

export enum ShadowIntensityEnum {
  "shadow-1" = "shadow-1",
  "shadow-2" = "shadow-2",
  "shadow-3" = "shadow-3",
  "shadow-4" = "shadow-4",
}

export type ShadowIntensity = keyof typeof ShadowIntensityEnum;

export enum BlurIntensityEnum {
  "bg-blur-0" = "bg-blur-0",
  "bg-blur-1" = "bg-blur-1",
  "bg-blur-2" = "bg-blur-2",
  "bg-blur-3" = "bg-blur-3",
  "bg-blur-4" = "bg-blur-4",
  "bg-blur-5" = "bg-blur-5",
  "bg-blur-6" = "bg-blur-6",
  "bg-blur-7" = "bg-blur-7",
}

export type BlurIntensity = keyof typeof BlurIntensityEnum;

export interface TabParamList {
  Discover: undefined;
  Hangout: undefined;
  Delivery: undefined;
  Request: undefined;
  Account: undefined;
}

export type TabScreenKey = keyof TabParamList;

export enum TopNavVariantEnum {
  center = "center",
  side = "side",
}

export type TopNavVariant = keyof typeof TopNavVariantEnum;

export enum FABVariantEnum {
  primary = "primary",
  secondary = "secondary",
}

export type FABVariant = keyof typeof FABVariantEnum;

export enum ListItemVariantEnum {
  single = "single",
  multiple = "multiple",
  action = "action",
}

export type ListItemVariant = keyof typeof ListItemVariantEnum;
