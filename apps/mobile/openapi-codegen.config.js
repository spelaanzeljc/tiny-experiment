/* eslint-env node */
/* oxlint-disable import/no-nodejs-modules typescript-eslint/unbound-method typescript-eslint/no-base-to-string typescript-eslint/restrict-template-expressions */
const { resolveConfigSync } = require("@povio/resolve-config");
const { resolve } = require("node:path");

const COMPACT_OPENAPI_INPUT = "../../packages/fake-be/openapi.generated.json";
const REAL_OPENAPI_PATH = "/api/docs-json";
const repoRoot = resolve(process.cwd(), "../..");
const env = resolveConfigSync({ cwd: repoRoot, module: "spa", target: "resolved" });

function resolveRealOpenApiInput(apiUrl = env.EXPO_PUBLIC_API_URL) {
  return `${apiUrl}${REAL_OPENAPI_PATH}`;
}

function resolveOpenApiInput(apiMode = process.env.EXPO_PUBLIC_API_MODE) {
  return apiMode === "real" && process.env.EXPO_PUBLIC_USE_REAL_OPENAPI === "true"
    ? resolveRealOpenApiInput()
    : COMPACT_OPENAPI_INPUT;
}

module.exports = {
  default: {
    input: resolveOpenApiInput(),
    output: "./api",
    tsPath: "@/api",
    restClientImportPath: "@/utils/rest/openapi/appRestClient",
    replaceOptionalWithNullish: true,
    infiniteQueries: false,
    builderConfigs: false,
    mutationEffects: false,
    mutationDefaultOnError: true,
    acl: false,
    checkAcl: false,
  },
  resolveOpenApiInput,
};
