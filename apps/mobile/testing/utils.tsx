import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render as rtlRender } from "@testing-library/react-native";
import React, { type PropsWithChildren, type ReactElement } from "react";

import RestyleThemeProvider from "../utils/providers/RestyleThemeProvider";

// Create test query client with defaultOptions.queries.staleTime set to Inifity. This will enable
// us to provide mock data when testing components using `useQuery` and/or `yseInfiniteQuery` without
// experience any flakiness. We also set the gcTime (garbage collection time) to 0 to avoid issues
// with open handles after test run
const testQueryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity, retry: false, gcTime: 0 } },
});

const TestQueryProvider = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
);

const TestProviders = ({ children }: PropsWithChildren) => (
  <RestyleThemeProvider>
    <TestQueryProvider>
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </TestQueryProvider>
  </RestyleThemeProvider>
);

const render = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => {
  return rtlRender(ui, { wrapper: (props) => <TestProviders {...props} />, ...options }) as unknown as ReturnType<
    typeof rtlRender
  > extends Promise<infer Result>
    ? Result
    : ReturnType<typeof rtlRender>;
};

// re-export everything from @testing-library/react-netive
export * from "@testing-library/react-native";
// override render method and export testQueryClient & TestQueryProvider
export { render, testQueryClient, TestQueryProvider };
