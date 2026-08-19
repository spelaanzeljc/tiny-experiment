import { createFakeMailRouter } from "~/orpc/api/fakeMail/fakeMail.router";
import { defineApiModule } from "~/orpc/api/module";
import { apiSpecModules } from "~/orpc/api/spec-modules";

export const fakeMailModule = defineApiModule({
  ...apiSpecModules.fakeMail,
  createRouter: createFakeMailRouter,
});
