import { oc } from "@orpc/contract";

import { MediaUploadInstructionsResponseSchema, MediaUploadRequestSchema } from "~/orpc/api/media/media.models";
import { authSpec, composeSpec, mediaUploadSpec } from "~/orpc/spec";

export const mediaContract = oc.tag("Media").router({
  uploadRequest: oc
    .route({
      method: "POST",
      path: "/api/files/presigned-url",
      successStatus: 201,
      spec: composeSpec(authSpec, mediaUploadSpec),
    })
    .input(MediaUploadRequestSchema)
    .output(MediaUploadInstructionsResponseSchema)
    .meta({
      bl: "Validates an authenticated media upload request, creates a pending media record for an allowed resource, and returns upload instructions for sending the file bytes separately.",
    }),
});
