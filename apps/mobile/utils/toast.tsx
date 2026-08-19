import React from "react";
import { Platform } from "react-native";
import { hideToastable, showToastable } from "react-native-toastable";

import { ToastContent, type ToastContentProps } from "@povio/rn-ui";

export const showToast = ({
  primaryActionLabel,
  secondaryActionLabel,
  onPrimaryActionPress,
  onSecondaryActionPress,
  message,
  variant,
  offset = 10,
  showCloseButton,
}: ToastContentProps) => {
  const parsedOffset = Platform.OS === "ios" ? offset : offset + 30;

  const handleClose = () => {
    hideToastable();
  };

  showToastable({
    message: "",
    position: "bottom",
    swipeDirection: "left",
    offset: parsedOffset,
    renderContent: () => (
      <ToastContent
        variant={variant}
        message={message}
        primaryActionLabel={primaryActionLabel}
        secondaryActionLabel={secondaryActionLabel}
        onPrimaryActionPress={onPrimaryActionPress}
        onSecondaryActionPress={onSecondaryActionPress}
        showCloseButton={showCloseButton}
        onClosePress={handleClose}
      />
    ),
  });
};
