import type { z } from "zod";

export function isValidOrder(value: string, enumSchema: z.ZodEnum): boolean {
  if (!value) {
    return true;
  }

  return value.split(",").every((item) => {
    const key = item.trim().replace(/^[+-]/, "");
    return enumSchema.safeParse(key).success;
  });
}
