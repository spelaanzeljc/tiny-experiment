import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import type { FC, PropsWithChildren } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AuthProvider from "./AuthProvider";
import GestureHandlerProvider from "./GestureHandlerProvider";
import OpenApiRuntimeProvider from "./OpenApiRuntimeProvider";
import RestyleThemeProvider from "./RestyleThemeProvider";
import TanstackQueryProvider from "./TanstackQueryProvider";

/* eslint-disable-next-line */
type AnyChildren = PropsWithChildren<any>;

export const combineProviders = <ComponentType extends FC>(...components: PropsWithChildren<ComponentType>[]) => {
  return components.reduce(
    (AccumulatedComponents: AnyChildren, CurrentComponent: AnyChildren) => {
      return ({ children }: AnyChildren) => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>,
  );
};

/**
 *  The order of the providers is significant
 *  NOTE: If you need to change the order, DO IT CAREFULLY!
 */
const providers = [
  SafeAreaProvider,
  RestyleThemeProvider,
  TanstackQueryProvider,
  OpenApiRuntimeProvider,
  GestureHandlerProvider,
  BottomSheetModalProvider,
  AuthProvider, // Not required if not using ACLs (user permission checking) with @povio/openapi-codegen-cli
] as const;

const AppContextProviders = combineProviders(...providers);

export default AppContextProviders;
