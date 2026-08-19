import { ErrorHandler, OpenApiQueryConfig } from "@povio/openapi-codegen-cli";
import { useToast } from "@povio/ui";
import type { PropsWithChildren } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function OpenApiRuntimeProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { errorToast } = useToast();

  const handleError = useCallback(
    (error: unknown) => {
      console.error(error);
      errorToast({
        text: t(($) => $.shared.apiErrors.requestFailed, {
          error: ErrorHandler.getErrorMessage(error) ?? t(($) => $.shared.apiErrors.unknown),
        }),
      });
    },
    [errorToast, t],
  );

  return (
    <OpenApiQueryConfig.Provider
      allowInvalidResponseData={import.meta.env.DEV}
      onError={handleError}
    >
      {children}
    </OpenApiQueryConfig.Provider>
  );
}
