import type { InputVariant } from "@/types";

import type { Theme, ThemeColor } from "@povio/rn-ui";

export const getInputBackgroundColor = (
  theme: Theme,
  variant: InputVariant,
  disabled: boolean | undefined,
  active: boolean,
  error: string | undefined,
): ThemeColor => {
  if (!theme?.inputVariants[variant]) {
    return "transparent";
  }
  const { backgroundColor, backgroundColorActive, backgroundColorError, backgroundColorDisabled } =
    theme.inputVariants[variant];

  if (disabled) {
    return backgroundColorDisabled as ThemeColor;
  }
  if (error) {
    return backgroundColorError as ThemeColor;
  }
  if (active) {
    return backgroundColorActive as ThemeColor;
  }
  return backgroundColor as ThemeColor;
};

export const getInputBorderColor = (
  theme: Theme,
  variant: InputVariant,
  disabled: boolean | undefined,
  active: boolean,
  error: string | undefined,
): ThemeColor => {
  if (!theme?.inputVariants[variant]) {
    return "transparent";
  }
  const { borderColor, borderColorActive, borderColorError, borderColorDisabled } = theme.inputVariants[variant];

  if (disabled) {
    return borderColorDisabled as ThemeColor;
  }
  if (error) {
    return borderColorError as ThemeColor;
  }
  if (active) {
    return borderColorActive as ThemeColor;
  }
  return borderColor as ThemeColor;
};

export const getInputLabelColor = (
  theme: Theme,
  variant: InputVariant,
  disabled: boolean | undefined,
  active: boolean,
  error: string | undefined,
): ThemeColor => {
  if (!theme?.inputVariants[variant]) {
    return "transparent";
  }
  const { labelColor, labelColorActive, labelColorError, labelColorDisabled } = theme.inputVariants[variant];

  if (disabled) {
    return labelColorDisabled as ThemeColor;
  }
  if (error) {
    return labelColorError as ThemeColor;
  }
  if (active) {
    return labelColorActive as ThemeColor;
  }
  return labelColor as ThemeColor;
};

export const getInputInputColor = (
  theme: Theme,
  variant: InputVariant,
  disabled: boolean | undefined,
  active: boolean,
  error: string | undefined,
): ThemeColor => {
  if (!theme?.inputVariants[variant]) {
    return "transparent";
  }
  const { color, colorActive, colorError, colorDisabled } = theme.inputVariants[variant];

  if (disabled) {
    return colorDisabled as ThemeColor;
  }
  if (error) {
    return colorError as ThemeColor;
  }
  if (active) {
    return colorActive as ThemeColor;
  }
  return color as ThemeColor;
};
