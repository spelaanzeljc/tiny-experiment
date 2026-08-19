import { fileURLToPath, pathToFileURL } from "node:url";

import { generateOpenApiFile, generateORPCOpenAPISpec } from "@povio/openapi-codegen-cli/tiny";

import { contract } from "../packages/fake-be/src/orpc/api/contract";
import { collectRobodevMediaResources } from "../packages/fake-be/src/orpc/api/module";
import { MEDIA_RESOURCE_NAMES } from "../packages/fake-be/src/orpc/api/media/media.models";
import { apiSpecModules as apiModules } from "../packages/fake-be/src/orpc/api/spec-modules";
import { getOpenApiSchemaName } from "../packages/fake-be/src/orpc/spec";
import { userRoles } from "../packages/fake-be/src/roles";

const openApiOutput = fileURLToPath(new URL("../packages/fake-be/openapi.generated.json", import.meta.url).href);
const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "options", "head", "trace"]);

function toPascalCase(value: string): string {
  return value
    .replace(/(^|[-_\s]+)([a-zA-Z0-9])/g, (_match, _separator: string, character: string) => character.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

function findModuleTag(
  tags: { name?: string }[] | undefined,
  moduleName: string,
  openApiTag: string | undefined,
): { name?: string } | undefined {
  if (!tags?.length) {
    return undefined;
  }

  if (openApiTag) {
    return tags.find((item) => item.name === openApiTag);
  }

  return (
    tags.find((item) => item.name === moduleName) ??
    tags.find((item) => item.name?.toLowerCase() === moduleName.toLowerCase())
  );
}

function findOperationTagName(
  spec: { paths?: unknown },
  moduleName: string,
  openApiTag: string | undefined,
): string | undefined {
  if (openApiTag) {
    return openApiTag;
  }

  if (!spec.paths || typeof spec.paths !== "object" || Array.isArray(spec.paths)) {
    return undefined;
  }

  const controllerPrefix = `${toPascalCase(moduleName)}Controller`;
  for (const pathItem of Object.values(spec.paths)) {
    if (!pathItem || typeof pathItem !== "object" || Array.isArray(pathItem)) {
      continue;
    }

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method) || !operation || typeof operation !== "object" || Array.isArray(operation)) {
        continue;
      }

      const operationId =
        "operationId" in operation && typeof operation.operationId === "string" ? operation.operationId : "";
      const tags = "tags" in operation && Array.isArray(operation.tags) ? operation.tags : [];
      const [tagName] = tags.filter((tag): tag is string => typeof tag === "string");
      if (operationId.startsWith(controllerPrefix) && tagName) {
        return tagName;
      }
    }
  }

  return undefined;
}

export async function generateTinyOpenApiSpec() {
  const spec = await generateORPCOpenAPISpec({
    contract,
    apiModules,
    userRoles,
    apiRoot: fileURLToPath(new URL("../packages/fake-be/src/orpc/api", import.meta.url).href),
    dbTablesRoot: fileURLToPath(new URL("../packages/fake-be/src/db/tables", import.meta.url).href),
    getOpenApiSchemaName,
  });

  for (const [moduleName, module] of Object.entries(apiModules)) {
    const tag = findModuleTag(spec.tags, moduleName, module.openApiTag);
    const operationTagName = findOperationTagName(spec, moduleName, module.openApiTag);
    if (tag && operationTagName && tag.name !== operationTagName) {
      tag.name = operationTagName;
    }
  }

  for (const [moduleName, module] of Object.entries(apiModules)) {
    if (!module.robodevMediaResources?.length) {
      continue;
    }

    const tag = findModuleTag(spec.tags, moduleName, module.openApiTag);
    if (tag) {
      tag["x-robodev-media-resources"] = module.robodevMediaResources;
    }
  }

  const mediaResourceNameSchema = spec.components?.schemas?.MediaResourceName;
  if (
    mediaResourceNameSchema &&
    typeof mediaResourceNameSchema === "object" &&
    !Array.isArray(mediaResourceNameSchema)
  ) {
    mediaResourceNameSchema.enum = [
      ...MEDIA_RESOURCE_NAMES,
      ...collectRobodevMediaResources(apiModules).map((resource) => resource.name),
    ];
  }

  return spec;
}

export function generateTinyOpenApiFile(defaultOutput: string) {
  return generateOpenApiFile({
    defaultOutput,
    generateOpenApiSpec: generateTinyOpenApiSpec,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateTinyOpenApiFile(openApiOutput);
}
