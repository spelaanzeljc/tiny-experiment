import type { OpenAPI } from "@orpc/contract";

export type OpenAPIRouteSpec = OpenAPI.OperationObject & {
  "x-media-download"?: boolean;
  "x-media-upload"?: boolean;
};

export type AclRule = `${string}:${string}`;

export interface ProcedureMeta {
  bl: string;
  acl?: AclRule[];
}

export type OpenAPIRouteSpecTransform = (spec: OpenAPIRouteSpec) => OpenAPIRouteSpec;

export const composeSpec =
  (...transforms: OpenAPIRouteSpecTransform[]): OpenAPIRouteSpecTransform =>
  (spec) =>
    transforms.reduce((nextSpec, transform) => transform(nextSpec), spec);

export const authSpec = (spec: OpenAPIRouteSpec): OpenAPIRouteSpec => ({
  ...spec,
  security: [{ bearerAuth: [] }],
});

export const mediaUploadSpec = (spec: OpenAPIRouteSpec): OpenAPIRouteSpec => ({
  ...spec,
  "x-media-upload": true,
});

export const mediaDownloadSpec = (spec: OpenAPIRouteSpec): OpenAPIRouteSpec => ({
  ...spec,
  "x-media-download": true,
});

const openApiSchemaNames = new WeakMap<object, string>();

export function getOpenApiSchemaName(schema: unknown): string | undefined {
  return typeof schema === "object" && schema !== null ? openApiSchemaNames.get(schema) : undefined;
}
