/* oxlint-disable curly -- Guard clauses keep token ownership handlers concise. */
import { storeHelpers } from "~/db/store";
import { userRepository } from "~/db/tables/user/user.repository";
import { pushNotificationTokenRepository } from "~/db/tables/pushNotificationToken/pushNotificationToken.repository";
import type { User } from "~/db/tables/user/user.schema";
import type { ORPCRouterBuilder, RequireAuthMiddleware } from "~/orpc/api/router";
import { localAuthnIdentityExists } from "~/orpc/helpers/auth-errors";
import { notFound } from "~/orpc/helpers/errors";

function toUserMeResponse(row: User) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
  };
}

export function createUserRouter(os: ORPCRouterBuilder, requireAuth: RequireAuthMiddleware) {
  return {
    get: os.user.get.use(requireAuth).handler(async ({ context }) => {
      const user = await userRepository.findById(context.auth.user.id);
      if (!user) {
        notFound("User not found");
      }

      return toUserMeResponse(user);
    }),

    update: os.user.update.use(requireAuth).handler(async ({ input, context }) => {
      const user = await userRepository.findById(context.auth.user.id);
      if (!user) {
        notFound("User not found");
      }

      if (input.email) {
        const existingEmailOwner = await userRepository.findFirst((item) => item.email === input.email);
        if (existingEmailOwner && existingEmailOwner.id !== user.id) {
          localAuthnIdentityExists();
        }
      }

      const updatedUser = await userRepository.update(context.auth.user.id, {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.email !== undefined ? { email: input.email } : {}),
        updatedAt: storeHelpers.now(),
      });
      if (!updatedUser) {
        notFound("User not found");
      }

      return toUserMeResponse(updatedUser);
    }),
    pushTokens: {
      list: os.user.pushTokens.list.use(requireAuth).handler(async ({ context }) => (await pushNotificationTokenRepository.list()).filter((token) => token.resourceName === "User" && token.resourceId === context.auth.user.id)),
      create: os.user.pushTokens.create.use(requireAuth).handler(async ({ input, context }) => {
        const existing = await pushNotificationTokenRepository.findFirst((token) => token.token === input.token && token.provider === input.provider);
        const now = storeHelpers.now();
        if (existing) return (await pushNotificationTokenRepository.update(existing.id, { resourceName: "User", resourceLabel: context.auth.user.name ?? context.auth.user.email, resourceId: context.auth.user.id, module: "users", title: input.title ?? null, expiresAt: input.expiresAt ?? null, updatedAt: now }))!;
        return pushNotificationTokenRepository.create({ id: storeHelpers.uuid(), resourceName: "User", resourceLabel: context.auth.user.name ?? context.auth.user.email, module: "users", resourceId: context.auth.user.id, token: input.token, provider: input.provider, expiresAt: input.expiresAt ?? null, title: input.title ?? null, createdAt: now, updatedAt: now });
      }),
      remove: os.user.pushTokens.remove.use(requireAuth).handler(async ({ input, context }) => {
        const token = await pushNotificationTokenRepository.findById(input.id);
        if (!token) notFound("Push notification token not found");
        if (token.resourceName !== "User" || token.resourceId !== context.auth.user.id) notFound("Push notification token not found");
        return (await pushNotificationTokenRepository.remove(input.id))!;
      }),
    },
  };
}
