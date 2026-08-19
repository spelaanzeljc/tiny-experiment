import { ORPCError, implement } from "@orpc/server";

import { contract } from "~/orpc/api/contract";
import { apiModules } from "~/orpc/api/modules";
import { resolveAuthFromRequest } from "~/orpc/helpers/tokens";
import type { AuthenticatedORPCContext, ORPCContext } from "~/orpc/types";

const os = implement(contract).$context<ORPCContext>();

const requireAuth = os.middleware(async ({ context, next }) => {
  const auth = await resolveAuthFromRequest(context.request);
  if (!auth) {
    throw new ORPCError("UNAUTHORIZED", { message: "Authentication is required" });
  }

  return next({ context: { auth } satisfies Pick<AuthenticatedORPCContext, "auth"> });
});

export type ORPCRouterBuilder = typeof os;
export type RequireAuthMiddleware = typeof requireAuth;

type ApiRouters = { [K in keyof typeof apiModules]: ReturnType<(typeof apiModules)[K]["createRouter"]> };

const apiRouters = Object.fromEntries(
  Object.entries(apiModules).map(([name, apiModule]) => [name, apiModule.createRouter(os, requireAuth)]),
) as ApiRouters;

export const router = os.router(apiRouters);
