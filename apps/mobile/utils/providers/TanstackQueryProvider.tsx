import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export default function TanstackQueryProvider(props: PropsWithChildren) {
  useReactQueryDevTools(queryClient);

  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>;
}
