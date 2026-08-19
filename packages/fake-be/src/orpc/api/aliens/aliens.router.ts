import { alienRepository } from "~/db/tables/alien/alien.repository";
import type { ORPCRouterBuilder, RequireAuthMiddleware } from "~/orpc/api/router";

export function createAliensRouter(os: ORPCRouterBuilder, requireAuth: RequireAuthMiddleware) {
  return {
    getLabels: os.aliens.getLabels.use(requireAuth).handler(async ({ input }) => {
      const search = input.search?.trim().toLocaleLowerCase();
      const aliens = await alienRepository.list();

      return aliens
        .map((alien) => ({
          id: alien.id,
          label: alien.name,
        }))
        .filter((alien) => {
          if (!search) {
            return true;
          }

          return alien.label.toLocaleLowerCase().includes(search);
        })
        .sort((a, b) => a.label.localeCompare(b.label))
        .slice(0, 50);
    }),
  };
}
