import { defineApiModule } from "~/orpc/api/module";
import { createAliensRouter } from "~/orpc/api/aliens/aliens.router";
import { apiSpecModules } from "~/orpc/api/spec-modules";

export const aliensModule = defineApiModule({
  ...apiSpecModules.aliens,
  createRouter: createAliensRouter,
});
