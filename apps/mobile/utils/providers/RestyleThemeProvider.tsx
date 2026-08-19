import { ThemeProvider } from "@shopify/restyle";
import { theme } from "@povio/rn-ui";
import type { PropsWithChildren } from "react";

function RestyleThemeProvider(props: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}

export default RestyleThemeProvider;
