import { z } from "zod";

import { UserSchema as DbUserSchema } from "~/db/tables/user/user.schema";
import { PushNotificationTokenSchema } from "~/db/tables/pushNotificationToken/pushNotificationToken.schema";

export const UserRoleSchema = z.enum(["CLIENT"]);

export const UserMeResponseSchema = DbUserSchema.pick({
  id: true,
  name: true,
  email: true,
});

export const UserMeUpdateRequestSchema = z.object({
  name: z.string().optional(),
  email: z
    .email("Invalid email")
    .min(1, "Email is required")
    .transform((value) => value.toLowerCase().trim())
    .optional(),
});

export const UserPushTokenCreateSchema = z.object({
  token: z.string().min(1),
  provider: z.string().min(1),
  title: z.string().nullish(),
  expiresAt: z.string().nullish(),
});
export const UserPushTokenIdSchema = z.object({ id: z.string() });
export const UserPushTokensResponseSchema = PushNotificationTokenSchema.array();

export type UserMeResponse = z.infer<typeof UserMeResponseSchema>;
