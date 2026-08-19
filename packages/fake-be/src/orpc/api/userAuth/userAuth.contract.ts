import { oc } from "@orpc/contract";

import {
  AuthnTokenRequestSchema,
  AuthnTokenResponseSchema,
  StatusResponseSchema,
  UserAuthEmailGenerateRequestSchema,
  UserAuthMagicConsumeRequestSchema,
  UserAuthPasswordLoginRequestSchema,
  UserAuthPasswordRegisterRequestSchema,
} from "~/orpc/api/userAuth/userAuth.models";

export const userAuthContract = oc.tag("User Auth").router({
  magicLink: {
    generate: oc
      .route({
        method: "GET",
        path: "/api/user/auth/magic-link",
      })
      .input(UserAuthEmailGenerateRequestSchema)
      .output(StatusResponseSchema)
      .meta({
        bl: "For an existing local user, creates a short-lived single-use magic login code and emails a callback link containing type=magic and the code. Returns the same generic success message regardless of whether an identity exists to prevent account enumeration.",
      }),

    consume: oc
      .route({
        method: "GET",
        path: "/api/user/auth/magic-link/callback",
      })
      .input(UserAuthMagicConsumeRequestSchema)
      .output(AuthnTokenResponseSchema)
      .meta({
        bl: "Consumes a valid, unexpired, previously unused magic login code for an existing local user, permanently marks the code used, and returns access and refresh tokens. Rejects invalid, expired, or reused codes.",
      }),
  },

  localPassword: {
    login: oc
      .route({
        method: "POST",
        path: "/api/user/auth/login",
      })
      .input(UserAuthPasswordLoginRequestSchema)
      .output(AuthnTokenResponseSchema)
      .meta({
        bl: "Validates local user credentials and returns access and refresh tokens for authenticated API requests.",
      }),

    register: oc
      .route({
        method: "POST",
        path: "/api/user/auth/register",
        successStatus: 201,
      })
      .input(UserAuthPasswordRegisterRequestSchema)
      .output(AuthnTokenResponseSchema)
      .meta({
        bl: "Validates registration input, enforces unique email, creates a local user, sends a welcome email to the registered address, and returns access and refresh tokens.",
      }),
  },

  jwt: {
    accessToken: oc
      .route({
        method: "POST",
        path: "/api/user/auth/refresh",
      })
      .input(AuthnTokenRequestSchema)
      .output(AuthnTokenResponseSchema)
      .meta({
        bl: "Validates a refresh token for an existing user and returns a new access and refresh token pair.",
      }),
  },

  google: {
    login: oc
      .route({
        method: "GET",
        path: "/api/user/auth/google/callback",
      })
      .output(AuthnTokenResponseSchema)
      .meta({
        bl: "Completes Google authentication and returns access and refresh tokens.",
      }),
  },
  apple: {
    login: oc.route({ method: "GET", path: "/api/user/auth/apple/callback" }).output(AuthnTokenResponseSchema).meta({ bl: "Completes deterministic fake Apple authentication and returns access and refresh tokens." }),
  },
  forgotPassword: {
    requestReset: oc.route({ method: "POST", path: "/api/user/auth/forgot-password" }).input(UserAuthEmailGenerateRequestSchema).output(StatusResponseSchema).meta({ bl: "For an existing user, creates a short-lived password reset code and emails it while preventing account enumeration." }),
    consumeReset: oc.route({ method: "POST", path: "/api/user/auth/forgot-password/callback" }).input(UserAuthMagicConsumeRequestSchema).output(StatusResponseSchema).meta({ bl: "Consumes a valid unused password reset code." }),
  },
});
