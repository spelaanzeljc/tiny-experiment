import { defineApiModule } from "~/orpc/api/module";
import { createUserAuthRouter } from "~/orpc/api/userAuth/userAuth.router";
import { apiSpecModules } from "~/orpc/api/spec-modules";

export const userAuthModule = defineApiModule({
  ...apiSpecModules.userAuth,
  createRouter: createUserAuthRouter,
});
