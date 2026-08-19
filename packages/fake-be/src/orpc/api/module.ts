import type { OpenAPIGeneratorGenerateOptions } from "@orpc/openapi";

import type { TableName } from "~/db/schema-registry";
import type { UserRoleName } from "~/roles";

export type OpenApiSchemaRegistry = NonNullable<OpenAPIGeneratorGenerateOptions["commonSchemas"]>;

export interface RobodevMediaResource {
  name: string;
  field: string;
  dtoField: string;
  mimeTypes: readonly string[];
  maxFileSize: number;
}

export interface ApiModuleShape {
  contract: unknown;
  createRouter: unknown;
  extraSchemas?: OpenApiSchemaRegistry;
  openApiController?: string;
  openApiTag?: string;
  robodevHidden?: boolean;
  robodevOwnedTables?: readonly TableName[];
  robodevRoles?: readonly UserRoleName[];
  robodevMediaResources?: readonly RobodevMediaResource[];
}

export function defineApiModule<const TModule extends ApiModuleShape>(
  module: TModule,
): TModule & { extraSchemas: OpenApiSchemaRegistry } {
  return { extraSchemas: {}, ...module };
}

export function defineOpenApiSchemas<const TSchemas extends OpenApiSchemaRegistry>(schemas: TSchemas): TSchemas {
  return schemas;
}

export function collectExtraSchemas<const TModules extends Record<string, { extraSchemas: OpenApiSchemaRegistry }>>(
  modules: TModules,
): OpenApiSchemaRegistry {
  return Object.values(modules).reduce<OpenApiSchemaRegistry>((schemas, module) => {
    Object.assign(schemas, module.extraSchemas);
    return schemas;
  }, {});
}

export function collectContracts<const TModules extends Record<string, Pick<ApiModuleShape, "contract">>>(
  modules: TModules,
): { [K in keyof TModules]: TModules[K]["contract"] } {
  return Object.fromEntries(Object.entries(modules).map(([name, module]) => [name, module.contract])) as {
    [K in keyof TModules]: TModules[K]["contract"];
  };
}

function hasRobodevMediaResources(value: unknown): value is { robodevMediaResources: readonly RobodevMediaResource[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    "robodevMediaResources" in value &&
    Array.isArray(value.robodevMediaResources)
  );
}

export function collectRobodevMediaResources(modules: Record<string, unknown>): RobodevMediaResource[] {
  return Object.values(modules).flatMap((module) =>
    hasRobodevMediaResources(module) ? [...module.robodevMediaResources] : [],
  );
}
