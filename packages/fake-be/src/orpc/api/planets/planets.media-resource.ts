import type { RobodevMediaResource } from "~/orpc/api/module";

export const PLANET_IMAGE_MEDIA_RESOURCE = {
  name: "planet-image",
  field: "imageId",
  dtoField: "image",
  mimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxFileSize: 2 * 1024 * 1024,
} as const satisfies RobodevMediaResource;
