import React from "react";

import type { IconButtonProps } from "@povio/rn-ui";
import type { TopNavVariant } from "@/types";

import { CenterNavContent, SideNavContent } from "./TopNavContent";

/*
  Info: if you need access to the TopNav action event handlers,
    you can use navigation.setOptions to render the header inside
    of the screen component:

  useLayoutEffect(() => {
    navigation.setOptions({
      header: ...;
  }, [navigation]);
*/

export interface TopNavProps {
  variant: TopNavVariant;
  actions?: {
    icon: IconButtonProps["icon"];
    onPress: () => void;
  }[];
  title: string;
}

const TopNav = ({ variant, actions, title }: TopNavProps) => {
  if (variant === "center") {
    return (
      <CenterNavContent
        routeName={title}
        actions={actions}
      />
    );
  }
  return (
    <SideNavContent
      routeName={title}
      actions={actions}
    />
  );
};

export default TopNav;
