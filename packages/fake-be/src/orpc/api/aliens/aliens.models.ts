import { z } from "zod";

import { LabelSchema } from "~/orpc/api/common/common.models";

export const AliensGetLabelsQuerySchema = z.object({
  search: z.string().optional(),
});

export const AliensGetLabelsResponseSchema = LabelSchema.array();
