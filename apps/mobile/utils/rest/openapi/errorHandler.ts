import { type ApplicationException, type ErrorEntry, ErrorHandler } from "@povio/openapi-codegen-cli";
import { captureException } from "@sentry/react-native";

type ErrorCodes = string;

const errorEntries: ErrorEntry<ErrorCodes>[] = [];

export const AppErrorHandler = new ErrorHandler({
  entries: errorEntries,
  onRethrowError: (_error, applicationException: ApplicationException<ErrorCodes>) => {
    captureException(applicationException.serverMessage ?? applicationException.code);
  },
});
