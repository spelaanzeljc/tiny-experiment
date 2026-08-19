import { oc } from "@orpc/contract";

import { UserMeResponseSchema, UserMeUpdateRequestSchema, UserPushTokenCreateSchema, UserPushTokenIdSchema, UserPushTokensResponseSchema } from "~/orpc/api/user/user.models";
import { authSpec } from "~/orpc/spec";

export const userContract = oc.tag("User").router({
  get: oc
    .route({
      method: "GET",
      path: "/api/user/me",
      spec: authSpec,
    })
    .output(UserMeResponseSchema)
    .meta({
      bl: "Returns the authenticated user's profile for a valid access token.",
      acl: ["user:read"],
    }),

  update: oc
    .route({
      method: "PUT",
      path: "/api/user/me",
      spec: authSpec,
    })
    .input(UserMeUpdateRequestSchema)
    .output(UserMeResponseSchema)
    .meta({
      bl: "Updates the authenticated user's own name and email, enforcing unique email ownership, and returns the updated profile.",
      acl: ["user:update"],
    }),
  pushTokens: {
    list: oc.route({ method: "GET", path: "/api/user/push-tokens", spec: authSpec }).output(UserPushTokensResponseSchema).meta({ bl: "Lists push notification tokens owned by the authenticated user." }),
    create: oc.route({ method: "POST", path: "/api/user/push-tokens", spec: authSpec, successStatus: 201 }).input(UserPushTokenCreateSchema).output(UserPushTokensResponseSchema.element).meta({ bl: "Registers or refreshes a push notification token for the authenticated user." }),
    remove: oc.route({ method: "DELETE", path: "/api/user/push-tokens/{id}", spec: authSpec }).input(UserPushTokenIdSchema).output(UserPushTokensResponseSchema.element).meta({ bl: "Deletes a push notification token only when owned by the authenticated user." }),
  },
});
