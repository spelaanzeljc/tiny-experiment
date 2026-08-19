import { defineConfig } from "oxfmt";
import rootConfig from "../../oxfmt.config.js";
import tsconfig from "./tsconfig.json" with { type: "json" };

export default defineConfig({
  ...rootConfig,
  ignorePatterns: [...(rootConfig.ignorePatterns ?? []), ...(tsconfig.exclude ?? []), "api/"],
});
