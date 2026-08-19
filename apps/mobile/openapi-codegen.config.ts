/* oxlint-disable import/no-nodejs-modules */
import type { OpenAPICodegenConfig } from "@povio/openapi-codegen-cli";
import { resolveConfigSync } from "@povio/resolve-config";
import { resolve } from "node:path";

const COMPACT_OPENAPI_INPUT = "../../packages/fake-be/openapi.generated.json";
const REAL_OPENAPI_PATH = "/api/docs-json";
const repoRoot = resolve(process.cwd(), "../..");
const env = resolveConfigSync({ cwd: repoRoot, module: "spa", target: "resolved" }) as Record<
  string,
  string | undefined
>;

function resolveRealOpenApiInput(apiUrl = env.EXPO_PUBLIC_API_URL) {
  return `${apiUrl}${REAL_OPENAPI_PATH}`;
}

export function resolveOpenApiInput(apiMode = process.env.EXPO_PUBLIC_API_MODE) {
  return apiMode === "real" && process.env.EXPO_PUBLIC_USE_REAL_OPENAPI === "true"
    ? resolveRealOpenApiInput()
    : COMPACT_OPENAPI_INPUT;
}

const config: OpenAPICodegenConfig = {
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
};

export default config;
