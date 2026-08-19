import { ORPCError } from "@orpc/server";

export enum FakeAuthErrorCodes {
  InvalidCredentials = "invalid-credentials",
  LocalAuthnIdentityExists = "identity-already-exists",
  IdentityNotFound = "identity-not-found",
  NotConfirmed = "identity-not-confirmed",
  NonceInvalid = "nonce-invalid",
}

type AuthErrorStatus = "UNAUTHORIZED" | "CONFLICT" | "FORBIDDEN" | "BAD_REQUEST";

function authError(status: AuthErrorStatus, code: FakeAuthErrorCodes, message: string): never {
  throw new ORPCError(status, {
    message,
    data: { code },
  });
}

export function invalidCredentials(message = "Invalid credentials"): never {
  authError("UNAUTHORIZED", FakeAuthErrorCodes.InvalidCredentials, message);
}

export function localAuthnIdentityExists(message = "User with this email already exists"): never {
  authError("CONFLICT", FakeAuthErrorCodes.LocalAuthnIdentityExists, message);
}

export function identityNotFound(message = "Identity not found"): never {
  authError("UNAUTHORIZED", FakeAuthErrorCodes.IdentityNotFound, message);
}

export function identityNotConfirmed(message = "Identity is not confirmed"): never {
  authError("FORBIDDEN", FakeAuthErrorCodes.NotConfirmed, message);
}

export function invalidNonce(message = "Invalid or expired code"): never {
  authError("BAD_REQUEST", FakeAuthErrorCodes.NonceInvalid, message);
}
