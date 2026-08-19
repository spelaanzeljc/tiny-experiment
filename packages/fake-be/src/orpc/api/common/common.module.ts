import { defineApiModule } from "~/orpc/api/module";
import { apiSpecModules } from "~/orpc/api/spec-modules";

export const commonModule = defineApiModule({
  ...apiSpecModules.common,
  createRouter: () => ({}),
});
