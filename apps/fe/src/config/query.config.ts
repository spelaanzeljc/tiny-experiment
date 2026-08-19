import type { ApplicationException, GeneralErrorCodes } from "@povio/openapi-codegen-cli";
import { QueryClient, type QueryClientConfig } from "@tanstack/react-query";

export const QueryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
    },
  },
};

export const queryClient = new QueryClient(QueryConfig);

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApplicationException<GeneralErrorCodes> | null;
  }
}
