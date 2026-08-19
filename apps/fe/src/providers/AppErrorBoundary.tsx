import { ErrorBoundary } from "@sentry/react";
import type { PropsWithChildren } from "react";

import { ErrorFallback, type ErrorFallbackProps } from "@/components/shared/error/ErrorFallback";

const Fallback = (props: ErrorFallbackProps) => <ErrorFallback {...props} />;

export const AppErrorBoundary = ({ children }: PropsWithChildren) => {
  return <ErrorBoundary fallback={Fallback}>{children}</ErrorBoundary>;
};
