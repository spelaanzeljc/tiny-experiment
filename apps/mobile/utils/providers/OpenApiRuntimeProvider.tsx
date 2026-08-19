import { ErrorHandler, OpenApiQueryConfig } from "@povio/openapi-codegen-cli";
import type { PropsWithChildren } from "react";
import { Alert } from "react-native";

export default function OpenApiRuntimeProvider({ children }: PropsWithChildren) {
  return (
    <OpenApiQueryConfig.Provider
      allowInvalidResponseData={__DEV__}
      onError={(error) => {
        console.error(error);
        Alert.alert("Request failed", ErrorHandler.getErrorMessage(error) ?? "An unknown error occurred.");
      }}
    >
      {children}
    </OpenApiQueryConfig.Provider>
  );
}
