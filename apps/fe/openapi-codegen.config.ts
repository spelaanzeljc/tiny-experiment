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

function resolveRealOpenApiInput(apiUrl = env.VITE_PUBLIC_API_URL) {
  return `${apiUrl}${REAL_OPENAPI_PATH}`;
}

export function resolveOpenApiInput(apiMode = env.VITE_PUBLIC_API_MODE) {
  return apiMode === "real" ? resolveRealOpenApiInput() : COMPACT_OPENAPI_INPUT;
}

const config: OpenAPICodegenConfig = {
  input: resolveOpenApiInput(),
  output: "src/openapi",
  tsPath: "@/openapi",
  restClientImportPath: "@/clients/app-rest-client",
  clearOutput: true,
  excludeRedundantZodSchemas: false,
  checkAcl: false,
  acl: false,
  replaceOptionalWithNullish: true,
  infiniteQueries: true,
  mutationDefaultOnError: true,
  modelsInCommon: true,
  axiosRequestConfig: true,
};

export default config;
