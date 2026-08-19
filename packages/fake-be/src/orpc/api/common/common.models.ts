import { z } from "zod";

export const paginationCursorSchema = z
  .string()
  .trim()
  .regex(
    /^[A-Za-z_][A-Za-z0-9_]*(?::.+)?$/,
    "Cursor must be a field name or a field name followed by a non-empty value",
  );

export const LabelSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const DateRangeSchema = z
  .object({
    start: z.iso.datetime({ offset: true }).nullable(),
    end: z.iso.datetime({ offset: true }).nullable(),
  })
  .partial();

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  cursor: paginationCursorSchema.nullish(),
  limit: z.coerce.number().positive().max(20).default(20).optional(),
});

export const PaginationDtoSchema = z.object({
  page: z.number().nullish(),
  cursor: z.string().nullish(),
  nextCursor: z.string().nullish(),
  limit: z.number(),
  totalItems: z.number(),
});

export function createPaginateQuerySchema<TFilterSchema extends z.ZodType>(filterSchema: TFilterSchema) {
  return PaginationQuerySchema.extend({
    filter: filterSchema.nullish(),
  });
}

export type Label = z.infer<typeof LabelSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type Pagination = z.infer<typeof PaginationDtoSchema>;
