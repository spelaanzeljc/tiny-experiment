import { oc } from "@orpc/contract";

import { AliensGetLabelsQuerySchema, AliensGetLabelsResponseSchema } from "~/orpc/api/aliens/aliens.models";
import { authSpec } from "~/orpc/spec";

export const aliensContract = oc.tag("Alien").router({
  getLabels: oc
    .route({
      method: "GET",
      path: "/api/aliens/labels",
      spec: authSpec,
    })
    .input(AliensGetLabelsQuerySchema)
    .output(AliensGetLabelsResponseSchema)
    .meta({
      bl: "Lists up to 50 alien labels matching the optional search term by name, sorted by label.",
      acl: ["alien:list"],
    }),
});
