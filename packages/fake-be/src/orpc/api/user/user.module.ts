import { defineApiModule } from "~/orpc/api/module";
import { createUserRouter } from "~/orpc/api/user/user.router";
import { apiSpecModules } from "~/orpc/api/spec-modules";

export const userModule = defineApiModule({
  ...apiSpecModules.user,
  createRouter: createUserRouter,
});
