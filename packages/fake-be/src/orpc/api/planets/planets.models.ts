import { z } from "zod";

import { PlanetSchema as DbPlanetSchema } from "~/db/tables/planet/planet.schema";
import { DateRangeSchema, PaginationDtoSchema, PaginationQuerySchema } from "~/orpc/api/common/common.models";
import { isValidOrder } from "~/orpc/helpers/sorting";

const PLANETS_SORTABLE_KEYS = ["id", "name", "discoveryDate", "createdAt", "updatedAt"] as const;

export const PlanetImageRequestDtoSchema = z.object({
  id: z.string(),
});

export const PlanetImageDtoSchema = PlanetImageRequestDtoSchema.extend({
  url: z.string(),
});

// API models extend persisted planet rows with read-only labels used by the UI.
export const PlanetsGetResponseDtoSchema = DbPlanetSchema.omit({ imageId: true }).extend({
  description: z.string().nullish(),
  image: PlanetImageDtoSchema.nullish(),
  creatorName: z.string().optional(),
  alienName: z.string().optional(),
  likesCount: z.number().int().nonnegative(),
  likedByMe: z.boolean(),
});

export const PlanetsPaginateItemDtoSchema = PlanetsGetResponseDtoSchema.extend({});

const planetBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  alienId: z.string().nullish(),
  discoveryDate: z.iso.datetime({ offset: true }).nullish(),
  description: z.string().nullish(),
  image: PlanetImageRequestDtoSchema.nullish(),
});

export const PlanetPaginateFilterParamSchema = z
  .object({
    search: z.string().optional(),
    alienId: z.string().nullish(),
    discoveryDate: DateRangeSchema.nullish(),
  })
  .partial()
  .nullable();

export const PlanetPaginateOrderParamEnumSchema = z.enum(PLANETS_SORTABLE_KEYS);

export const PlanetPaginateOrderParamSchema = z
  .string()
  .refine((value) => isValidOrder(value, PlanetPaginateOrderParamEnumSchema), "Invalid planet sort order")
  .nullish();

export const PlanetsGetAllQuerySchema = z.object({
  filter: PlanetPaginateFilterParamSchema.optional(),
  order: PlanetPaginateOrderParamSchema.nullish(),
});
export const GetAllResponseSchema = PlanetsGetResponseDtoSchema.array();
export const PlanetsPaginateQuerySchema = PaginationQuerySchema.extend({
  filter: PlanetPaginateFilterParamSchema.optional(),
  order: PlanetPaginateOrderParamSchema.nullish(),
});
export const PlanetsPaginateItemPaginationResponseSchema = PaginationDtoSchema.extend({
  items: PlanetsPaginateItemDtoSchema.array(),
});
export const PlanetsGetByIdParamsSchema = z.object({
  id: z.string(),
});

export const PlanetsCreateRequestDtoSchema = planetBodySchema;
export const PlanetControllerUpdateRequestDtoSchema = planetBodySchema.extend({});
export const PlanetsUpdateRequestSchema = z.object({
  params: PlanetsGetByIdParamsSchema,
  body: PlanetControllerUpdateRequestDtoSchema,
});
export const PlanetsRemoveParamsSchema = PlanetsGetByIdParamsSchema;
export const PlanetsRemoveResponseSchema = z.void();
export const PlanetsLikeParamsSchema = PlanetsGetByIdParamsSchema;
export const PlanetsUnlikeParamsSchema = PlanetsGetByIdParamsSchema;

export type Planet = z.infer<typeof PlanetsGetResponseDtoSchema>;
export type PlanetsFilters = NonNullable<z.infer<typeof PlanetPaginateFilterParamSchema>>;
export type PlanetsOrder = z.infer<typeof PlanetPaginateOrderParamSchema>;
