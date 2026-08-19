/* oxlint-disable curly -- Authentication guard clauses terminate through typed error helpers. */
import { storeHelpers } from "~/db/store";
import { authnNonceRepository } from "~/db/tables/authnNonce/authnNonce.repository";
import { DEMO_LOGIN } from "~/db/tables/user/user.seed";
import { userRepository } from "~/db/tables/user/user.repository";
import type { User } from "~/db/tables/user/user.schema";
import { mailService } from "~/mail/mail.service";
import type { ORPCRouterBuilder } from "~/orpc/api/router";
import type { AuthTokens } from "~/orpc/api/userAuth/userAuth.models";
import {
  identityNotFound,
  invalidCredentials,
  invalidNonce,
  localAuthnIdentityExists,
} from "~/orpc/helpers/auth-errors";
import { createAuthTokens, verifyRefreshToken } from "~/orpc/helpers/tokens";

function toAuthTokens(userId: string): AuthTokens {
  return createAuthTokens(userId);
}

async function findLocalUser(email: string, password: string): Promise<User> {
  const user = await userRepository.findFirst((item) => item.email === email);
  if (!user || user.password !== password) {
    invalidCredentials("Invalid email or password");
  }

  return user;
}

export function createUserAuthRouter(os: ORPCRouterBuilder) {
  return {
    magicLink: {
      generate: os.userAuth.magicLink.generate.handler(async ({ input }) => {
        const user = await userRepository.findFirst((item) => item.email === input.email);
        if (user) {
          const createdAt = storeHelpers.now();
          const code = storeHelpers.uuid();
          const expiresAt = new Date(new Date(createdAt).getTime() + 30 * 60 * 1000).toISOString();
          await authnNonceRepository.create({
            id: storeHelpers.uuid(),
            code,
            type: "magic",
            userId: user.id,
            expiresAt,
            usedAt: null,
            createdAt,
          });

          const callbackUrl = `/api/user/auth/magic-link/callback?type=magic&code=${encodeURIComponent(code)}`;
          await mailService.send({
            to: user.email ?? input.email,
            subject: "Magic Link",
            text: "Click here to log in",
            html: `<p>Click <a href="${callbackUrl}">here</a> to log in.</p><p>This link will expire in 30 minutes</p>`,
          });
        }

        return {
          status: "ok",
          message: "If you entered a valid email, you'll receive an email shortly",
          code: "ok",
        };
      }),

      consume: os.userAuth.magicLink.consume.handler(async ({ input }) => {
        const nonce = await authnNonceRepository.findFirst((item) => item.code === input.code && item.type === "magic");
        if (!nonce || nonce.usedAt || new Date(nonce.expiresAt).getTime() <= Date.now()) {
          invalidNonce();
        }

        const user = await userRepository.findById(nonce.userId);
        if (!user) {
          invalidNonce();
        }

        await authnNonceRepository.update(nonce.id, { usedAt: storeHelpers.now() });
        return toAuthTokens(user.id);
      }),
    },

    localPassword: {
      login: os.userAuth.localPassword.login.handler(async ({ input }) => {
        const user = await findLocalUser(input.email, input.password);
        await userRepository.update(user.id, { updatedAt: storeHelpers.now() });

        return toAuthTokens(user.id);
      }),

      register: os.userAuth.localPassword.register.handler(async ({ input }) => {
        const existing = await userRepository.findFirst((item) => item.email === input.email);
        if (existing) {
          localAuthnIdentityExists();
        }

        const t = storeHelpers.now();
        const id = storeHelpers.uuid();
        await userRepository.create({
          id,
          email: input.email,
          name: input.name ?? "",
          roles: ["CLIENT"],
          password: input.password,
          createdAt: t,
          updatedAt: t,
        });
        await mailService.send({
          to: input.name ? { name: input.name, email: input.email } : input.email,
          subject: "Welcome to Tiny",
          text: `Welcome${input.name ? `, ${input.name}` : ""}! Your Tiny account is ready.`,
        });

        return toAuthTokens(id);
      }),
    },

    jwt: {
      accessToken: os.userAuth.jwt.accessToken.handler(async ({ input }) => {
        const payload = verifyRefreshToken(input.refreshToken);
        const user = await userRepository.findById(payload.uid);
        if (!user) {
          identityNotFound();
        }

        return toAuthTokens(user.id);
      }),
    },

    google: {
      login: os.userAuth.google.login.handler(async () => {
        const user = await userRepository.findFirst((item) => item.email === DEMO_LOGIN.email);
        if (!user) {
          identityNotFound();
        }

        return toAuthTokens(user.id);
      }),
    },
    apple: {
      login: os.userAuth.apple.login.handler(async () => {
        const user = await userRepository.findFirst((item) => item.email === DEMO_LOGIN.email);
        if (!user) identityNotFound();
        return toAuthTokens(user.id);
      }),
    },
    forgotPassword: {
      requestReset: os.userAuth.forgotPassword.requestReset.handler(async ({ input }) => {
        const user = await userRepository.findFirst((item) => item.email === input.email);
        if (user) {
          const createdAt = storeHelpers.now();
          const code = storeHelpers.uuid();
          await authnNonceRepository.create({ id: storeHelpers.uuid(), code, type: "forgot-password", userId: user.id, expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), usedAt: null, createdAt });
          await mailService.send({ to: input.email, subject: "Reset password", text: `Reset code: ${code}` });
        }
        return { status: "ok", message: "If you entered a valid email, you'll receive an email shortly", code: "ok" };
      }),
      consumeReset: os.userAuth.forgotPassword.consumeReset.handler(async ({ input }) => {
        const nonce = await authnNonceRepository.findFirst((item) => item.code === input.code && item.type === "forgot-password");
        if (!nonce || nonce.usedAt || new Date(nonce.expiresAt).getTime() <= Date.now()) invalidNonce();
        await authnNonceRepository.update(nonce.id, { usedAt: storeHelpers.now() });
        return { status: "ok", message: "Password reset code accepted", code: "ok" };
      }),
    },
  };
}
