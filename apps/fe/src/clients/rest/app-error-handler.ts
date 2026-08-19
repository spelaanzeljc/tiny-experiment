import { type ErrorEntry, ErrorHandler } from "@povio/openapi-codegen-cli";

export enum AuthErrorCodes {
  InvalidCredentials = "invalid-credentials",
  LocalAuthnIdentityExists = "identity-already-exists",
  IdentityNotFound = "identity-not-found",
  NotConfirmed = "identity-not-confirmed",
}

const authErrors: ErrorEntry<AuthErrorCodes>[] = [
  {
    code: AuthErrorCodes.InvalidCredentials,
    getMessage: (t) => t("auth.shared.errors.invalidCredentials"),
  },
  {
    code: AuthErrorCodes.LocalAuthnIdentityExists,
    getMessage: (t) => t("auth.shared.errors.userAlreadyExists"),
  },
  {
    code: AuthErrorCodes.IdentityNotFound,
    getMessage: (t) => t("auth.shared.errors.identityNotFound"),
  },
  {
    code: AuthErrorCodes.NotConfirmed,
    getMessage: (t) => t("auth.shared.errors.notConfirmed"),
  },
];

const entries = [...authErrors];

export const AppErrorHandler = new ErrorHandler({ entries });
