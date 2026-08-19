import { collectContracts } from "~/orpc/api/module";
import { apiSpecModules } from "~/orpc/api/spec-modules";

export const contract = collectContracts(apiSpecModules);
