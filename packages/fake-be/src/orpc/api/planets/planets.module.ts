import { defineApiModule } from "~/orpc/api/module";
import { createPlanetsRouter } from "~/orpc/api/planets/planets.router";
import { apiSpecModules } from "~/orpc/api/spec-modules";

export const planetsModule = defineApiModule({
  ...apiSpecModules.planets,
  createRouter: createPlanetsRouter,
});
