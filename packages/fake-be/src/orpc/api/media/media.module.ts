import { defineApiModule } from "~/orpc/api/module";
import { createMediaRouter } from "~/orpc/api/media/media.router";
import { apiSpecModules } from "~/orpc/api/spec-modules";

export const mediaModule = defineApiModule({
  ...apiSpecModules.media,
  createRouter: createMediaRouter,
});
