import { storeHelpers } from "~/db/store";
import { mediaRepository } from "~/db/tables/media/media.repository";
import { alienRepository } from "~/db/tables/alien/alien.repository";
import type { Alien } from "~/db/tables/alien/alien.schema";
import { planetLikeRepository } from "~/db/tables/planet-like/planet-like.repository";
import type { PlanetLike } from "~/db/tables/planet-like/planet-like.schema";
import { planetRepository } from "~/db/tables/planet/planet.repository";
import type { Planet as DbPlanet } from "~/db/tables/planet/planet.schema";
import { userRepository } from "~/db/tables/user/user.repository";
import type { User } from "~/db/tables/user/user.schema";
import { getMediaBlobUrl } from "~/media/blob-storage";
import { PLANET_IMAGE_MEDIA_RESOURCE } from "~/orpc/api/planets/planets.media-resource";
import type { ORPCRouterBuilder, RequireAuthMiddleware } from "~/orpc/api/router";
import {
  type Planet,
  PlanetPaginateOrderParamEnumSchema,
  type PlanetsFilters,
  type PlanetsOrder,
} from "~/orpc/api/planets/planets.models";
import { badRequest, forbidden, notFound } from "~/orpc/helpers/errors";
import { createPaginatedResponse } from "~/orpc/helpers/pagination";

type PlanetsSortableKey = "id" | "name" | "discoveryDate" | "createdAt" | "updatedAt";

const DEFAULT_PLANETS_ORDER = "+name";

function findCreatorName(userId: string, users: User[]): string | undefined {
  return users.find((item) => item.id === userId)?.name ?? undefined;
}

function findAlienName(alienId: string | null | undefined, aliens: Alien[]): string | undefined {
  if (!alienId) {
    return undefined;
  }

  return aliens.find((item) => item.id === alienId)?.name;
}

async function validateAlien(alienId: string | null | undefined) {
  if (!alienId) {
    return undefined;
  }

  const alien = await alienRepository.findById(alienId);
  if (!alien) {
    notFound("Alien not found");
  }

  return alien;
}

function normalizeAlienId(alienId: string | null | undefined): string | null {
  return alienId || null;
}

async function resolvePlanetImage(imageId: string | null | undefined): Promise<Planet["image"]> {
  if (!imageId) {
    return null;
  }

  const media = await mediaRepository.findById(imageId);
  if (!media || !media.uploaded || !media.validated || media.deleted) {
    return null;
  }

  const url = await getMediaBlobUrl(media.key);
  if (!url) {
    return null;
  }

  return {
    id: media.id,
    url,
  };
}

async function enrichPlanet(
  planet: DbPlanet,
  users: User[],
  aliens: Alien[],
  likes: PlanetLike[],
  currentUserId: string,
): Promise<Planet> {
  const { imageId, ...apiPlanet } = planet;
  const planetLikes = likes.filter((like) => like.planetId === planet.id);

  return {
    ...apiPlanet,
    image: await resolvePlanetImage(imageId),
    creatorName: findCreatorName(planet.userId, users),
    alienName: findAlienName(planet.alienId, aliens),
    likesCount: planetLikes.length,
    likedByMe: planetLikes.some((like) => like.userId === currentUserId),
  };
}

async function enrichPlanets(planets: DbPlanet[], currentUserId: string): Promise<Planet[]> {
  const [users, aliens, likes] = await Promise.all([
    userRepository.list(),
    alienRepository.list(),
    planetLikeRepository.list(),
  ]);
  return Promise.all(planets.map((planet) => enrichPlanet(planet, users, aliens, likes, currentUserId)));
}

async function findPlanetOrThrow(planetId: string): Promise<DbPlanet> {
  const planet = await planetRepository.findById(planetId);
  if (!planet) {
    notFound("Planet not found");
  }

  return planet;
}

async function enrichOnePlanet(planet: DbPlanet, currentUserId: string): Promise<Planet> {
  const [users, aliens, likes] = await Promise.all([
    userRepository.list(),
    alienRepository.list(),
    planetLikeRepository.list(),
  ]);
  return enrichPlanet(planet, users, aliens, likes, currentUserId);
}

async function validatePlanetImage(
  image: { id: string } | null | undefined,
  userId: string,
  resourceName: string,
): Promise<string | null> {
  if (!image) {
    return null;
  }

  const media = await mediaRepository.findById(image.id);
  if (!media) {
    notFound("Media not found");
  }
  if (media.userId !== userId) {
    forbidden("You can only use your own media");
  }
  if (media.resourceName !== resourceName) {
    badRequest("Media cannot be used as a planet image");
  }
  if (!media.uploaded || !media.validated || media.deleted) {
    badRequest("Media must be uploaded and validated before it can be attached");
  }

  return media.id;
}

// Keep filter logic shared between list and paginate so both views behave identically.
function isWithinDiscoveryDateRange(discoveryDate: string | null | undefined, range: PlanetsFilters["discoveryDate"]) {
  const start = range?.start;
  const end = range?.end;
  if (!start && !end) {
    return true;
  }
  if (!discoveryDate) {
    return false;
  }

  const timestamp = Date.parse(discoveryDate);
  if (start && timestamp < Date.parse(start)) {
    return false;
  }
  if (end && timestamp > Date.parse(end)) {
    return false;
  }

  return true;
}

async function filterPlanets<T extends DbPlanet>(
  planets: T[],
  filters: PlanetsFilters | null | undefined,
): Promise<T[]> {
  if (!filters) {
    return planets;
  }

  const search = filters.search?.trim().toLocaleLowerCase();
  const [users, aliens] = search ? await Promise.all([userRepository.list(), alienRepository.list()]) : [[], []];

  return planets.filter((planet) => {
    if (
      search &&
      ![
        planet.name,
        planet.description,
        findCreatorName(planet.userId, users),
        findAlienName(planet.alienId, aliens),
      ].some((value) => value?.toLocaleLowerCase().includes(search))
    ) {
      return false;
    }

    if (filters.alienId && planet.alienId !== filters.alienId) {
      return false;
    }

    return isWithinDiscoveryDateRange(planet.discoveryDate, filters.discoveryDate);
  });
}

function parseOrder(order: PlanetsOrder): { key: PlanetsSortableKey; direction: "asc" | "desc" }[] {
  return (order || DEFAULT_PLANETS_ORDER)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const direction = item.startsWith("-") ? "desc" : "asc";
      const key = item.replace(/^[+-]/, "");
      const parsedKey = PlanetPaginateOrderParamEnumSchema.safeParse(key);
      return parsedKey.success ? { key: parsedKey.data, direction } : undefined;
    })
    .filter((item): item is { key: PlanetsSortableKey; direction: "asc" | "desc" } => Boolean(item));
}

function comparePlanetValues(a: DbPlanet, b: DbPlanet, key: PlanetsSortableKey, direction: "asc" | "desc") {
  const aValue = a[key];
  const bValue = b[key];
  if (!aValue && !bValue) {
    return 0;
  }
  if (!aValue) {
    return 1;
  }
  if (!bValue) {
    return -1;
  }

  // Nullish values stay at the bottom for both ascending and descending sorts.
  const result = aValue.localeCompare(bValue);
  return direction === "asc" ? result : -result;
}

function sortPlanets<T extends DbPlanet>(planets: T[], order: PlanetsOrder): T[] {
  const sorting = parseOrder(order);
  if (sorting.length === 0) {
    return planets;
  }

  return [...planets].sort((a, b) => {
    for (const sort of sorting) {
      const result = comparePlanetValues(a, b, sort.key, sort.direction);
      if (result !== 0) {
        return result;
      }
    }

    return a.name.localeCompare(b.name);
  });
}

export function createPlanetsRouter(os: ORPCRouterBuilder, requireAuth: RequireAuthMiddleware) {
  return {
    getAll: os.planets.getAll.use(requireAuth).handler(async ({ input, context }) => {
      const planets = await planetRepository.list();
      const filteredPlanets = await filterPlanets(planets, input.filter);
      return enrichPlanets(sortPlanets(filteredPlanets, input.order), context.auth.user.id);
    }),

    paginate: os.planets.paginate.use(requireAuth).handler(async ({ input, context }) => {
      const planets = await planetRepository.list();
      const filteredPlanets = await filterPlanets(planets, input.filter);
      const paginated = createPaginatedResponse({
        // Sort before slicing so infinite table pages keep a stable global order.
        items: sortPlanets(filteredPlanets, input.order),
        page: input.page,
        limit: input.limit,
      });
      return {
        ...paginated,
        items: await enrichPlanets(paginated.items, context.auth.user.id),
      };
    }),

    getById: os.planets.getById.use(requireAuth).handler(async ({ input, context }) => {
      const planet = await findPlanetOrThrow(input.id);
      return enrichOnePlanet(planet, context.auth.user.id);
    }),

    create: os.planets.create.use(requireAuth).handler(async ({ input, context }) => {
      const alienId = normalizeAlienId(input.alienId);
      const [, imageId] = await Promise.all([
        validateAlien(alienId),
        validatePlanetImage(input.image, context.auth.user.id, PLANET_IMAGE_MEDIA_RESOURCE.name),
      ]);
      const t = storeHelpers.now();
      const row: DbPlanet = {
        id: storeHelpers.uuid(),
        userId: context.auth.user.id,
        alienId,
        discoveryDate: input.discoveryDate ?? null,
        name: input.name,
        description: input.description ?? null,
        imageId,
        createdAt: t,
        updatedAt: t,
      };
      await planetRepository.create(row);
      return enrichOnePlanet(row, context.auth.user.id);
    }),

    update: os.planets.update.use(requireAuth).handler(async ({ input, context }) => {
      const {
        body,
        params: { id: planetId },
      } = input;
      const planet = await planetRepository.findById(planetId);
      if (!planet) {
        notFound("Planet not found");
      }
      if (planet.userId !== context.auth.user.id) {
        forbidden("You can only update your own planets");
      }
      const alienId = normalizeAlienId(body.alienId);
      const [, imageId] = await Promise.all([
        validateAlien(alienId),
        validatePlanetImage(body.image, context.auth.user.id, PLANET_IMAGE_MEDIA_RESOURCE.name),
      ]);

      const updatedPlanet = await planetRepository.update(planetId, {
        name: body.name,
        alienId,
        discoveryDate: body.discoveryDate ?? null,
        description: body.description ?? null,
        imageId,
        updatedAt: storeHelpers.now(),
      });
      if (!updatedPlanet) {
        notFound("Planet not found");
      }
      return enrichOnePlanet(updatedPlanet, context.auth.user.id);
    }),

    delete: os.planets.delete.use(requireAuth).handler(async ({ input, context }) => {
      const planet = await planetRepository.findById(input.id);
      if (!planet) {
        notFound("Planet not found");
      }

      if (planet.userId !== context.auth.user.id) {
        forbidden("You can only delete your own planets");
      }

      await planetRepository.remove(input.id);
      return undefined;
    }),

    like: os.planets.like.use(requireAuth).handler(async ({ input, context }) => {
      const planet = await findPlanetOrThrow(input.id);
      const existingLike = await planetLikeRepository.findFirst(
        (like) => like.planetId === planet.id && like.userId === context.auth.user.id,
      );

      if (!existingLike) {
        await planetLikeRepository.create({
          id: storeHelpers.uuid(),
          planetId: planet.id,
          userId: context.auth.user.id,
          createdAt: storeHelpers.now(),
        });
      }

      return enrichOnePlanet(planet, context.auth.user.id);
    }),

    unlike: os.planets.unlike.use(requireAuth).handler(async ({ input, context }) => {
      const planet = await findPlanetOrThrow(input.id);
      const existingLike = await planetLikeRepository.findFirst(
        (like) => like.planetId === planet.id && like.userId === context.auth.user.id,
      );

      if (existingLike) {
        await planetLikeRepository.remove(existingLike.id);
      }

      return enrichOnePlanet(planet, context.auth.user.id);
    }),
  };
}
