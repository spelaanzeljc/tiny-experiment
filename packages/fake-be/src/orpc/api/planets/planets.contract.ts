import { oc } from "@orpc/contract";

import {
  PlanetsCreateRequestDtoSchema,
  PlanetsGetAllQuerySchema,
  GetAllResponseSchema,
  PlanetsGetByIdParamsSchema,
  PlanetsGetResponseDtoSchema,
  PlanetsLikeParamsSchema,
  PlanetsPaginateQuerySchema,
  PlanetsPaginateItemPaginationResponseSchema,
  PlanetsRemoveParamsSchema,
  PlanetsRemoveResponseSchema,
  PlanetsUnlikeParamsSchema,
  PlanetsUpdateRequestSchema,
} from "~/orpc/api/planets/planets.models";
import { authSpec } from "~/orpc/spec";

export const planetsContract = oc.tag("Planet").router({
  // Contracts define the API surface and business metadata; paginate is the preferred collection route.
  getAll: oc
    .route({
      method: "GET",
      path: "/api/planets",
      spec: authSpec,
    })
    .input(PlanetsGetAllQuerySchema)
    .output(GetAllResponseSchema)
    .meta({
      bl: "Lists planets, optionally searches by planet name, description, creator name, or alien name and filters by alien and discovery date range, sorts by the requested order with name as the default, and enriches each planet with creator name and alien name.",
      acl: ["planet:list"],
    }),

  paginate: oc
    .route({
      method: "GET",
      path: "/api/planets/paginate",
      spec: authSpec,
    })
    .input(PlanetsPaginateQuerySchema)
    .output(PlanetsPaginateItemPaginationResponseSchema)
    .meta({
      bl: "Lists planets in page-based slices, optionally searches by planet name, description, creator name, or alien name and filters by alien and discovery date range before pagination, sorts by the requested order with name as the default, enriches each planet with creator name and alien name, and returns pagination metadata for incremental loading.",
      acl: ["planet:list"],
    }),

  getById: oc
    .route({
      method: "GET",
      path: "/api/planets/{id}",
      spec: authSpec,
    })
    .input(PlanetsGetByIdParamsSchema)
    .output(PlanetsGetResponseDtoSchema)
    .meta({
      bl: "Finds one planet by ID and enriches it with creator name and alien name, returning not found when it does not exist.",
      acl: ["planet:read"],
    }),

  create: oc
    .route({
      method: "POST",
      path: "/api/planets",
      successStatus: 201,
      spec: authSpec,
    })
    .input(PlanetsCreateRequestDtoSchema)
    .output(PlanetsGetResponseDtoSchema)
    .meta({
      bl: "Creates a planet owned by the authenticated user and optionally assigns an existing alien.",
      acl: ["planet:create"],
    }),

  update: oc
    .route({
      method: "PUT",
      path: "/api/planets/{id}",
      inputStructure: "detailed",
      spec: authSpec,
    })
    .input(PlanetsUpdateRequestSchema)
    .output(PlanetsGetResponseDtoSchema)
    .meta({
      bl: "Updates a planet only when the authenticated user owns it, optionally assigns an existing alien, and returns it with creator name and alien name.",
      acl: ["planet:update"],
    }),

  delete: oc
    .route({
      method: "DELETE",
      path: "/api/planets/{id}",
      successStatus: 204,
      spec: authSpec,
    })
    .input(PlanetsRemoveParamsSchema)
    .output(PlanetsRemoveResponseSchema)
    .meta({
      bl: "Deletes a planet only when the authenticated user owns it.",
      acl: ["planet:delete"],
    }),

  like: oc
    .route({
      method: "POST",
      path: "/api/planets/{id}/like",
      spec: authSpec,
    })
    .input(PlanetsLikeParamsSchema)
    .output(PlanetsGetResponseDtoSchema)
    .meta({
      bl: "Likes a planet for the authenticated user and returns the enriched planet with like metadata.",
      acl: ["planet:like"],
    }),

  unlike: oc
    .route({
      method: "DELETE",
      path: "/api/planets/{id}/like",
      spec: authSpec,
    })
    .input(PlanetsUnlikeParamsSchema)
    .output(PlanetsGetResponseDtoSchema)
    .meta({
      bl: "Removes the authenticated user's like from a planet and returns the enriched planet with like metadata.",
      acl: ["planet:like"],
    }),
});
