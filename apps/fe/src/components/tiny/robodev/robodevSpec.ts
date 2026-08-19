type JsonObject = Record<string, unknown>;
type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "options", "head", "trace"]);
const PAGINATION_FIELD_NAMES = new Set(["page", "cursor", "nextCursor", "limit", "totalItems"]);
const PAGINATED_OUTPUT_SUFFIX = "PaginateOutput";
const PAGINATED_RESPONSE_SUFFIX = "PaginateResponse";
const PAGINATED_ITEM_SUFFIX = "PaginateItem";

export const AI_PROVIDERS = ["Anthropic", "Meta", "OpenAI", "OpenRouter"] as const;
export const AGENTS = ["Claude", "Codex"] as const;
export const GENERATION_STRATEGIES = ["Class", "Method"] as const;
export const TEST_STRATEGIES = ["NONE", "HAPPY_PATH", "FULL"] as const;
export const ROBODEV_COMMANDS = ["curl", "wget"] as const;
export const ROBODEV_PROJECT_GENERATION_URL = "https://dev.codegen.robodev.com/api/projects/gen5";

export type AiProvider = (typeof AI_PROVIDERS)[number];
export type AgentType = (typeof AGENTS)[number];
export type GenerationStrategy = (typeof GENERATION_STRATEGIES)[number];
export type TestStrategy = (typeof TEST_STRATEGIES)[number];
export type RobodevCommand = (typeof ROBODEV_COMMANDS)[number];

// A type alias satisfies TanStack Form's Record constraint without widening keyof to every string.
// oxlint-disable-next-line consistent-type-definitions
export type RobodevFormValues = {
  baseOwnerName: string;
  baseRepositoryName: string;
  baseBranchName: string;
  targetOwnerName: string;
  targetRepositoryName: string;
  targetBranchName: string;
  directory: string;
  appName: string;
  commitMessage: string;
  aiProvider: AiProvider;
  agent: AgentType;
  generationStrategy: GenerationStrategy;
  testStrategy: TestStrategy;
  robodevToken: string;
  robodevCommand: RobodevCommand;
  runTests: boolean;
  deploy: boolean;
  generateCode: boolean;
  generateAdmin: boolean;
};

interface RobodevRequestField {
  name: string;
  type: string;
  context: string;
  required?: boolean;
}

interface RobodevResponseField {
  name: string;
  type: string;
  context: string;
  required?: boolean;
}

interface RobodevRequestDto {
  name: string;
  context: string;
  fields: RobodevRequestField[];
}

interface RobodevResponseDto {
  name: string;
  context: string;
  isArray?: boolean;
  fields: RobodevResponseField[];
}

interface RobodevPaginationDto {
  name: string;
  context: string;
  filters: {
    name: string;
    type: string;
    context: string;
  }[];
  sortingFields: string[];
}

interface RobodevEnumConstant {
  name: string;
  values: string[];
}

interface RobodevUserRole {
  name: string;
  description: string;
}

interface OpenApiRobodevUserRole extends RobodevUserRole {
  isDefault?: boolean;
}

interface RobodevEndpoint {
  method: string;
  path: string;
  modificationAction: "ADD";
  isPagination: boolean;
  hasMediaDownload?: boolean;
  hasMediaUpload?: boolean;
  roles: string[] | null;
  businessRequirements: string;
  requestParams: string;
  responseParams: string;
  validations: string;
  paginatedRequestParams: string;
}

interface RobodevModuleConstants {
  enums: RobodevEnumConstant[];
}

interface RobodevMediaResource {
  name: string;
  field: string;
  dtoField: string;
  mimeTypes: string[];
  maxFileSize: number;
}

interface RobodevModule {
  name: string;
  apis: RobodevEndpoint[];
  requestDtos: RobodevRequestDto[];
  responseDtos: RobodevResponseDto[];
  paginatedRequestDtos: RobodevPaginationDto[];
  constants: RobodevModuleConstants;
  tables: string[];
  mediaResources: RobodevMediaResource[];
  integrations: null;
  internal: null;
}

interface RobodevProjectRequest {
  executionId: string;
  repository: {
    baseBranch: {
      ownerName: string;
      repositoryName: string;
      branchName: string;
    };
    featureBranch: {
      ownerName: string;
      repositoryName: string;
      branchName: string;
    };
    developer: null;
    commitMessage: string | null;
  };
  specification: {
    constants: {
      userRoles: RobodevUserRole[];
    };
    apiModules: RobodevModule[];
    dbml: string;
  };
  configuration: {
    generationStrategy: {
      agent: AgentType;
      generateCode: boolean;
      generateAdmin: boolean;
      testStrategy: TestStrategy;
      generationStrategy: GenerationStrategy;
      runTests: boolean;
    };
    deploy: boolean;
    deploymentConfig: {
      deploy: boolean;
      appName: string;
    };
    directory: string;
    aiProvider: AiProvider;
  };
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSchemaObject(value: unknown): value is JsonObject {
  return isObject(value);
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

function asRobodevMediaResources(value: unknown): RobodevMediaResource[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item): RobodevMediaResource[] => {
    if (
      !isObject(item) ||
      typeof item.name !== "string" ||
      typeof item.field !== "string" ||
      typeof item.dtoField !== "string" ||
      typeof item.maxFileSize !== "number"
    ) {
      return [];
    }

    const mimeTypes = asStringArray(item.mimeTypes);
    if (mimeTypes.length === 0) {
      return [];
    }

    return [
      {
        name: item.name,
        field: item.field,
        dtoField: item.dtoField,
        mimeTypes,
        maxFileSize: item.maxFileSize,
      },
    ];
  });
}

function toPascalCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function toCamelCase(value: string): string {
  const pascalCase = toPascalCase(value);
  return pascalCase ? `${pascalCase.charAt(0).toLowerCase()}${pascalCase.slice(1)}` : value;
}

function toSentence(value: string): string {
  const spaced = value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

  return spaced ? `${spaced.charAt(0).toUpperCase()}${spaced.slice(1)}` : value;
}

function schemaRefName(schema: unknown): string | null {
  if (!isObject(schema) || typeof schema.$ref !== "string") {
    return null;
  }

  return schema.$ref.split("/").at(-1) ?? null;
}

function resolveRef(openapi: JsonObject, schema: unknown, seen = new Set<string>()): JsonObject | null {
  const name = schemaRefName(schema);
  const components = isObject(openapi.components) ? openapi.components : {};
  const schemas = isObject(components.schemas) ? components.schemas : {};
  const resolved = name ? schemas[name] : schema;

  if (name && isObject(resolved) && schemaRefName(resolved) && !seen.has(name)) {
    return resolveRef(openapi, resolved, new Set([...seen, name]));
  }

  return isSchemaObject(resolved) ? resolved : null;
}

function getJsonContentSchema(value: unknown): unknown {
  if (!isObject(value) || !isObject(value.content)) {
    return null;
  }

  const jsonContent = value.content["application/json"];
  return isObject(jsonContent) ? jsonContent.schema : null;
}

function getSuccessResponseSchema(operation: JsonObject): unknown {
  const responses = isObject(operation.responses) ? operation.responses : {};
  const response =
    responses["200"] ?? responses["201"] ?? Object.entries(responses).find(([status]) => status.startsWith("2"))?.[1];

  return getJsonContentSchema(response);
}

function getSchemaType(schema: unknown): string {
  const refName = schemaRefName(schema);
  if (refName) {
    return refName;
  }

  if (!isObject(schema)) {
    return "unknown";
  }

  if (schema.nullable === true) {
    return getSchemaType({ ...schema, nullable: undefined });
  }

  if (schema.type === "array") {
    return `${getSchemaType(schema.items)}[]`;
  }

  if (schema.type === "string" && (schema.format === "date" || schema.format === "date-time")) {
    return schema.format;
  }

  const recordType = getRecordSchemaType(schema);
  if (recordType) {
    return recordType;
  }

  const enumValues = asStringArray(schema.enum);
  if (enumValues.length > 0) {
    return enumValues.join(" | ");
  }

  if (Array.isArray(schema.oneOf)) {
    return schema.oneOf.map((item) => getSchemaType(item)).join(" | ");
  }

  if (Array.isArray(schema.anyOf)) {
    return schema.anyOf.map((item) => getSchemaType(item)).join(" | ");
  }

  if (Array.isArray(schema.allOf)) {
    return schema.allOf.map((item) => getSchemaType(item)).join(" & ");
  }

  return typeof schema.type === "string" ? schema.type : "object";
}

function getRecordSchemaType(schema: JsonObject): string | null {
  if (schema.type !== "object" || !("additionalProperties" in schema)) {
    return null;
  }

  const valueType = isObject(schema.additionalProperties) ? getSchemaType(schema.additionalProperties) : "unknown";

  return `record<string,${valueType}>`;
}

function isNullableSchema(schema: unknown): boolean {
  return isObject(schema) && schema.nullable === true;
}

function getSchemaProperties(openapi: JsonObject, schema: unknown): { properties: JsonObject; required: string[] } {
  const resolved = resolveRef(openapi, schema) ?? (isObject(schema) ? schema : {});
  const required = asStringArray(resolved.required);

  if (isObject(resolved.properties)) {
    return { properties: resolved.properties, required };
  }

  if (resolved.type === "array" && isObject(resolved.items)) {
    return getSchemaProperties(openapi, resolved.items);
  }

  if (Array.isArray(resolved.allOf)) {
    return resolved.allOf.reduce(
      (result, item) => {
        const nested = getSchemaProperties(openapi, item);

        return {
          properties: { ...result.properties, ...nested.properties },
          required: [...result.required, ...nested.required],
        };
      },
      { properties: {}, required: [] as string[] },
    );
  }

  return { properties: {}, required };
}

function getArrayItemSchema(openapi: JsonObject, schema: unknown): unknown {
  const resolved = resolveRef(openapi, schema) ?? (isObject(schema) ? schema : {});

  return resolved.type === "array" && isObject(resolved.items) ? resolved.items : null;
}

function componentSchemaRef(name: string): JsonObject {
  return { $ref: `#/components/schemas/${name}` };
}

function getComponentSchema(openapi: JsonObject, name: string): JsonObject | null {
  const components = isObject(openapi.components) ? openapi.components : {};
  const schemas = isObject(components.schemas) ? components.schemas : {};
  const schema = schemas[name];

  return isSchemaObject(schema) ? schema : null;
}

function getEnumValues(openapi: JsonObject, name: string): string[] {
  const schema = resolveRef(openapi, componentSchemaRef(name));
  return schema ? asStringArray(schema.enum) : [];
}

function getSchemaEnumNames(openapi: JsonObject, schema: unknown): string[] {
  const enumNames = isObject(schema) ? asStringArray(schema["x-enumNames"]) : [];
  if (enumNames.length > 0) {
    return enumNames;
  }

  const refName = schemaRefName(schema);
  if (refName) {
    const resolved = getComponentSchema(openapi, refName);
    return resolved ? getSchemaEnumNames(openapi, resolved) : [];
  }

  const enumValues = isObject(schema) ? asStringArray(schema.enum) : [];
  if (enumValues.length > 0) {
    return enumValues;
  }

  if (isObject(schema)) {
    for (const keyword of ["allOf", "anyOf", "oneOf"] as const) {
      const schemas = schema[keyword];
      if (!Array.isArray(schemas)) {
        continue;
      }

      for (const item of schemas) {
        const nestedEnumNames = getSchemaEnumNames(openapi, item);
        if (nestedEnumNames.length > 0) {
          return nestedEnumNames;
        }
      }
    }
  }

  return [];
}

function isDtoComponent(openapi: JsonObject, name: string): boolean {
  if (
    name === "PaginationInput" ||
    name === "PaginationQuery" ||
    name === "PaginationDto" ||
    name.endsWith(PAGINATED_OUTPUT_SUFFIX) ||
    name.endsWith(PAGINATED_RESPONSE_SUFFIX)
  ) {
    return false;
  }

  const { properties } = getSchemaProperties(openapi, componentSchemaRef(name));
  return Object.keys(properties).length > 0;
}

function collectReferencedComponentNames(
  schema: unknown,
  refs = new Set<string>(),
  seenObjects = new Set<JsonObject>(),
): Set<string> {
  const refName = schemaRefName(schema);
  if (refName) {
    refs.add(refName);
  }

  if (!isObject(schema) || seenObjects.has(schema)) {
    return refs;
  }

  seenObjects.add(schema);

  if (schema.type === "array") {
    collectReferencedComponentNames(schema.items, refs, seenObjects);
  }

  for (const keyword of ["allOf", "anyOf", "oneOf"] as const) {
    const schemas = schema[keyword];
    if (Array.isArray(schemas)) {
      schemas.forEach((item) => collectReferencedComponentNames(item, refs, seenObjects));
    }
  }

  if (isObject(schema.properties)) {
    Object.values(schema.properties).forEach((property) =>
      collectReferencedComponentNames(property, refs, seenObjects),
    );
  }

  return refs;
}

function hasMediaDownload(operation: JsonObject): boolean {
  return operation["x-media-download"] === true || operation.hasMediaDownload === true;
}

function hasMediaUpload(operation: JsonObject): boolean {
  return operation["x-media-upload"] === true || operation.hasMediaUpload === true;
}

function collectReferencedEnumNames(
  openapi: JsonObject,
  schema: unknown,
  refs = new Set<string>(),
  seenNames = new Set<string>(),
  seenObjects = new Set<JsonObject>(),
): Set<string> {
  const refName = schemaRefName(schema);
  if (refName) {
    const enumValues = getEnumValues(openapi, refName);
    if (enumValues.length > 0) {
      refs.add(refName);
    }

    if (!seenNames.has(refName)) {
      seenNames.add(refName);
      const resolved = getComponentSchema(openapi, refName);
      if (resolved) {
        collectReferencedEnumNames(openapi, resolved, refs, seenNames, seenObjects);
      }
    }
  }

  if (!isObject(schema) || seenObjects.has(schema)) {
    return refs;
  }

  seenObjects.add(schema);

  if (schema.type === "array") {
    collectReferencedEnumNames(openapi, schema.items, refs, seenNames, seenObjects);
  }

  for (const keyword of ["allOf", "anyOf", "oneOf"] as const) {
    const schemas = schema[keyword];
    if (Array.isArray(schemas)) {
      schemas.forEach((item) => collectReferencedEnumNames(openapi, item, refs, seenNames, seenObjects));
    }
  }

  if (isObject(schema.properties)) {
    Object.values(schema.properties).forEach((property) =>
      collectReferencedEnumNames(openapi, property, refs, seenNames, seenObjects),
    );
  }

  return refs;
}

function schemaFields(openapi: JsonObject, schema: unknown): RobodevRequestField[] {
  const { properties, required } = getSchemaProperties(openapi, schema);
  const requiredSet = new Set(required);

  return Object.entries(properties).map(([name, property]) => ({
    name,
    type: getSchemaType(property),
    context: toSentence(name),
    required: requiredSet.has(name) && !isNullableSchema(property),
  }));
}

function responseFields(openapi: JsonObject, schema: unknown): RobodevResponseField[] {
  return schemaFields(openapi, schema).map(({ name, type, context, required }) => ({ name, type, context, required }));
}

function operationSchemaName(operationId: string, role: "Request" | "Query" | "Response") {
  const name = toPascalCase(operationId);

  if (name.endsWith(role)) {
    return name;
  }
  if (role === "Response" && name.endsWith("Request")) {
    return `${name.slice(0, -"Request".length)}Response`;
  }

  return `${name}${role}`;
}

function operationDtoName(operationId: string, schema: unknown, role: "Request" | "Query" | "Response") {
  return schemaRefName(schema) ?? operationSchemaName(operationId, role);
}

function operationParameterSchema(operation: JsonObject): unknown {
  const parameters = Array.isArray(operation.parameters) ? operation.parameters : [];
  const parameterProperties: JsonObject = {};
  const required: string[] = [];

  for (const parameter of parameters) {
    if (!isObject(parameter) || parameter.in !== "query" || typeof parameter.name !== "string") {
      continue;
    }

    const parameterSchema: JsonObject = isObject(parameter.schema) ? { ...parameter.schema } : { type: "string" };
    const enumNames = asStringArray(parameter["x-enumNames"]);

    if (enumNames.length > 0) {
      parameterSchema["x-enumNames"] = enumNames;
    }

    parameterProperties[parameter.name] = parameterSchema;
    if (parameter.required === true) {
      required.push(parameter.name);
    }
  }

  if (Object.keys(parameterProperties).length === 0) {
    return null;
  }

  return {
    type: "object",
    properties: parameterProperties,
    required,
  };
}

function operationRequestBodySchema(operation: JsonObject): unknown {
  return getJsonContentSchema(operation.requestBody);
}

function collectDto<TDto>(
  map: Map<string, TDto>,
  name: string,
  schema: unknown,
  createDto: (name: string, schema: unknown) => TDto,
) {
  if (!map.has(name)) {
    map.set(name, createDto(name, schema));
  }
}

function collectNestedDtos<TDto>(
  openapi: JsonObject,
  map: Map<string, TDto>,
  schema: unknown,
  createDto: (name: string, schema: unknown) => TDto,
  excludedNames = new Set<string>(),
  seenNames = new Set<string>(),
) {
  const resolved = resolveRef(openapi, schema) ?? schema;

  for (const name of collectReferencedComponentNames(resolved)) {
    if (excludedNames.has(name) || seenNames.has(name) || !isDtoComponent(openapi, name)) {
      continue;
    }

    seenNames.add(name);
    const ref = componentSchemaRef(name);
    collectDto(map, name, ref, createDto);
    collectNestedDtos(openapi, map, ref, createDto, excludedNames, seenNames);
  }
}

function collectEnumConstants(openapi: JsonObject, map: Map<string, RobodevEnumConstant>, schema: unknown) {
  for (const name of collectReferencedEnumNames(openapi, schema)) {
    if (!map.has(name)) {
      map.set(name, { name, values: getEnumValues(openapi, name) });
    }
  }
}

function isPaginatedSchema(openapi: JsonObject, schema: unknown): boolean {
  const { properties } = getSchemaProperties(openapi, schema);
  return [...PAGINATION_FIELD_NAMES].every((field) => field in properties);
}

function isPaginationOperation(openapi: JsonObject, path: string, operation: JsonObject): boolean {
  const operationId = typeof operation.operationId === "string" ? operation.operationId : "";

  return (
    path.includes("/paginate") ||
    operationId.toLowerCase().includes("paginate") ||
    isPaginatedSchema(openapi, getSuccessResponseSchema(operation))
  );
}

function paginatedItemDtoName(outputDtoName: string, itemSchema: unknown): string {
  const refName = schemaRefName(itemSchema);
  if (refName) {
    return refName;
  }
  if (outputDtoName.endsWith(PAGINATED_OUTPUT_SUFFIX)) {
    return outputDtoName.replace(new RegExp(`${PAGINATED_OUTPUT_SUFFIX}$`), PAGINATED_ITEM_SUFFIX);
  }
  if (outputDtoName.endsWith(PAGINATED_RESPONSE_SUFFIX)) {
    return outputDtoName.replace(new RegExp(`${PAGINATED_RESPONSE_SUFFIX}$`), PAGINATED_ITEM_SUFFIX);
  }

  return `${outputDtoName}Item`;
}

function arrayItemDtoName(outputDtoName: string, itemSchema: unknown): string {
  const refName = schemaRefName(itemSchema);
  if (refName) {
    return refName;
  }
  if (outputDtoName.endsWith("Output")) {
    return outputDtoName.replace(/Output$/u, "Item");
  }
  if (outputDtoName.endsWith("Response")) {
    return outputDtoName.replace(/Response$/u, "Item");
  }

  return `${outputDtoName}${PAGINATED_ITEM_SUFFIX}`;
}

function getArrayItemDto(
  openapi: JsonObject,
  outputDtoName: string,
  schema: unknown,
): { name: string; schema: unknown } | null {
  const itemSchema = getArrayItemSchema(openapi, schema);
  if (!itemSchema) {
    return null;
  }

  const itemName = arrayItemDtoName(outputDtoName, itemSchema);
  if (
    !isDtoComponent(openapi, itemName) &&
    Object.keys(getSchemaProperties(openapi, itemSchema).properties).length === 0
  ) {
    return null;
  }

  return {
    name: itemName,
    schema: itemSchema,
  };
}

function getPaginatedItemDto(
  openapi: JsonObject,
  outputDtoName: string,
  schema: unknown,
): { name: string; schema: unknown } | null {
  const { properties } = getSchemaProperties(openapi, schema);
  const { items } = properties;

  if (!isObject(items) || items.type !== "array" || !isObject(items.items)) {
    return null;
  }

  return {
    name: paginatedItemDtoName(outputDtoName, items.items),
    schema: items.items,
  };
}

function getOperationResponseDto(
  openapi: JsonObject,
  isPaginated: boolean,
  responseDtoName: string | null,
  responseSchema: unknown,
): { name: string; schema: unknown; isArray?: boolean } | null {
  if (!responseSchema || !responseDtoName) {
    return null;
  }

  if (!isPaginated) {
    const arrayItemDto = getArrayItemDto(openapi, responseDtoName, responseSchema);
    return arrayItemDto ? { ...arrayItemDto, isArray: true } : { name: responseDtoName, schema: responseSchema };
  }

  return (
    getPaginatedItemDto(openapi, responseDtoName, responseSchema) ?? {
      name: responseDtoName,
      schema: responseSchema,
    }
  );
}

function getOperationResponseParams(responseDto: { name: string; schema: unknown; isArray?: boolean } | null): string {
  return responseDto?.name ?? "";
}

function formatValidationQueryParams(openapi: JsonObject, name: string, schema: unknown): string {
  const fields = schemaFields(openapi, schema)
    .map(
      (field) =>
        `{ name: "${field.name}", type: "${field.type}", context: "${field.context}", required: ${field.required === true} }`,
    )
    .join(", ");

  return `Query params: ${name}{ fields: [${fields}] }`;
}

function getPaginationDto(
  openapi: JsonObject,
  name: string,
  operationId: string,
  schema: unknown,
): RobodevPaginationDto {
  const { properties } = getSchemaProperties(openapi, schema);
  const filterFields = isObject(properties.filter)
    ? schemaFields(openapi, properties.filter)
    : schemaFields(openapi, schema).filter(
        (field) => !PAGINATION_FIELD_NAMES.has(field.name) && field.name !== "order",
      );

  return {
    name,
    context: toSentence(operationId),
    filters: filterFields.map((field) => ({
      name: field.name,
      type: field.type,
      context: field.context,
    })),
    sortingFields: getSchemaEnumNames(openapi, properties.order),
  };
}

function toEndpoint(
  openapi: JsonObject,
  method: string,
  path: string,
  operation: JsonObject,
  roles: readonly string[],
  refs: {
    requestDtoName: string | null;
    responseParams: string;
    parameterDtoName: string | null;
    parameterSchema: unknown;
  },
): RobodevEndpoint {
  const paginated = isPaginationOperation(openapi, path, operation);
  const hasValidationDto = method.toLowerCase() === "get" && !paginated;

  return {
    method: method.toUpperCase(),
    path,
    modificationAction: "ADD",
    isPagination: paginated,
    ...(hasMediaDownload(operation) ? { hasMediaDownload: true } : {}),
    ...(hasMediaUpload(operation) ? { hasMediaUpload: true } : {}),
    roles: roles.length > 0 ? [...roles] : null,
    businessRequirements: typeof operation["x-bl"] === "string" ? operation["x-bl"] : "",
    requestParams: paginated ? "" : (refs.requestDtoName ?? ""),
    responseParams: refs.responseParams,
    validations:
      hasValidationDto && refs.parameterDtoName
        ? formatValidationQueryParams(openapi, refs.parameterDtoName, refs.parameterSchema)
        : "",
    paginatedRequestParams: paginated ? (refs.parameterDtoName ?? "") : "",
  };
}

function buildApiModules(openapi: JsonObject, defaultRoles: readonly string[]): RobodevModule[] {
  const modules = new Map<
    string,
    {
      apis: RobodevEndpoint[];
      requestDtos: Map<string, RobodevRequestDto>;
      responseDtos: Map<string, RobodevResponseDto>;
      paginatedRequestDtos: Map<string, RobodevPaginationDto>;
      enums: Map<string, RobodevEnumConstant>;
      tables: string[];
      mediaResources: RobodevMediaResource[];
    }
  >();
  const paths = isObject(openapi.paths) ? openapi.paths : {};
  const tags = (Array.isArray(openapi.tags) ? openapi.tags : []).filter((tag): tag is JsonObject => isObject(tag));
  const hiddenTags = new Set(
    tags
      .filter((tag) => tag["x-robodev-hidden"] === true)
      .map((tag) => tag.name)
      .filter((name): name is string => typeof name === "string"),
  );
  const ownedTablesByTag = new Map(
    tags
      .map((tag) => [tag.name, asStringArray(tag["x-robodev-owned-tables"])] as const)
      .filter((entry): entry is readonly [string, string[]] => typeof entry[0] === "string" && entry[1].length > 0),
  );
  const rolesByTag = new Map(
    tags
      .map((tag) => [tag.name, asStringArray(tag["x-robodev-roles"])] as const)
      .filter((entry): entry is readonly [string, string[]] => typeof entry[0] === "string" && entry[1].length > 0),
  );
  const mediaResourcesByTag = new Map(
    tags
      .map((tag) => [tag.name, asRobodevMediaResources(tag["x-robodev-media-resources"])] as const)
      .filter((entry): entry is readonly [string, RobodevMediaResource[]] => {
        return typeof entry[0] === "string" && entry[1].length > 0;
      }),
  );
  assertUniqueOwnedTables(ownedTablesByTag);

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!isObject(pathItem)) {
      continue;
    }

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method) || !isObject(operation)) {
        continue;
      }

      const [tag] = asStringArray(operation.tags);
      if (operation["x-robodev-hidden"] === true || (tag && hiddenTags.has(tag))) {
        continue;
      }

      const moduleName = tag || "default";
      const operationId =
        typeof operation.operationId === "string" ? operation.operationId : `${method}${toPascalCase(path)}`;
      const responseSchema = getSuccessResponseSchema(operation);
      const isPaginated = isPaginationOperation(openapi, path, operation);
      const requestSchema = operationRequestBodySchema(operation);
      const parameterSchema = operationParameterSchema(operation);
      const requestDtoName = requestSchema ? operationDtoName(operationId, requestSchema, "Request") : null;
      const parameterDtoName = parameterSchema ? operationDtoName(operationId, parameterSchema, "Query") : null;
      const responseDtoName = responseSchema ? operationDtoName(operationId, responseSchema, "Response") : null;
      const responseDto = getOperationResponseDto(openapi, isPaginated, responseDtoName, responseSchema);
      const responseParams = getOperationResponseParams(responseDto);
      const module = modules.get(moduleName) ?? {
        apis: [],
        requestDtos: new Map<string, RobodevRequestDto>(),
        responseDtos: new Map<string, RobodevResponseDto>(),
        paginatedRequestDtos: new Map<string, RobodevPaginationDto>(),
        enums: new Map<string, RobodevEnumConstant>(),
        tables: ownedTablesByTag.get(moduleName) ?? [],
        mediaResources: mediaResourcesByTag.get(moduleName) ?? [],
      };
      const moduleRoles = rolesByTag.get(moduleName) ?? [...defaultRoles];

      module.apis.push(
        toEndpoint(openapi, method, path, operation, moduleRoles, {
          requestDtoName,
          responseParams,
          parameterDtoName,
          parameterSchema,
        }),
      );

      if (requestSchema && requestDtoName) {
        collectEnumConstants(openapi, module.enums, requestSchema);

        const createRequestDto = (dtoName: string, schema: unknown) => ({
          name: dtoName,
          context: toSentence(dtoName),
          fields: schemaFields(openapi, schema),
        });

        collectDto(module.requestDtos, requestDtoName, requestSchema, createRequestDto);
        collectNestedDtos(openapi, module.requestDtos, requestSchema, createRequestDto, new Set([requestDtoName]));
      }

      if (parameterSchema && parameterDtoName) {
        collectEnumConstants(openapi, module.enums, parameterSchema);
        if (isPaginated) {
          module.paginatedRequestDtos.set(
            parameterDtoName,
            getPaginationDto(openapi, parameterDtoName, operationId, parameterSchema),
          );
        }
      }

      if (responseDto) {
        collectEnumConstants(openapi, module.enums, responseDto.schema);

        const createResponseDto = (dtoName: string, schema: unknown) => ({
          name: dtoName,
          context: toSentence(dtoName),
          ...(responseDto.isArray && dtoName === responseDto.name ? { isArray: true } : {}),
          fields: responseFields(openapi, schema),
        });

        collectDto(module.responseDtos, responseDto.name, responseDto.schema, createResponseDto);
        collectNestedDtos(
          openapi,
          module.responseDtos,
          responseDto.schema,
          createResponseDto,
          new Set([responseDto.name]),
        );
      }

      modules.set(moduleName, module);
    }
  }

  return [...modules.entries()].map(([name, module]) => ({
    name: toCamelCase(name),
    apis: module.apis,
    requestDtos: [...module.requestDtos.values()],
    responseDtos: [...module.responseDtos.values()],
    paginatedRequestDtos: [...module.paginatedRequestDtos.values()],
    constants: { enums: [...module.enums.values()] },
    tables: module.tables,
    mediaResources: module.mediaResources,
    integrations: null,
    internal: null,
  }));
}

function assertUniqueOwnedTables(tablesByTag: Map<string, string[]>) {
  const ownerByTable = new Map<string, string>();
  const conflicts: string[] = [];

  for (const [moduleName, tables] of tablesByTag) {
    for (const table of tables) {
      const existingOwner = ownerByTable.get(table);
      if (existingOwner && existingOwner !== moduleName) {
        conflicts.push(`${table}: ${existingOwner}, ${moduleName}`);
      } else {
        ownerByTable.set(table, moduleName);
      }
    }
  }

  if (conflicts.length > 0) {
    throw new Error(`Robodev table ownership conflict: ${conflicts.join("; ")}`);
  }
}

function excludedRobodevDbmlTables(openapi: JsonObject, modules: RobodevModule[]): Set<string> {
  const visibleTables = new Set(modules.flatMap((module) => module.tables));
  const hiddenTables = (Array.isArray(openapi.tags) ? openapi.tags : [])
    .filter((tag): tag is JsonObject => isObject(tag) && tag["x-robodev-hidden"] === true)
    .flatMap((tag) => asStringArray(tag["x-robodev-owned-tables"]));

  return new Set(hiddenTables.filter((table) => !visibleTables.has(table)));
}

function buildOpenApiUserRoles(openapi: JsonObject): OpenApiRobodevUserRole[] {
  const roles = openapi["x-robodev-user-roles"];

  if (!Array.isArray(roles)) {
    return [];
  }

  return roles.flatMap((role): OpenApiRobodevUserRole[] => {
    if (!isObject(role) || typeof role.name !== "string" || typeof role.description !== "string") {
      return [];
    }

    return [
      {
        name: role.name,
        description: role.description,
        ...(role.isDefault === true ? { isDefault: true } : {}),
      },
    ];
  });
}

function buildUserRoles(openapiRoles: readonly OpenApiRobodevUserRole[]): RobodevUserRole[] {
  return openapiRoles.map((role) => ({
    name: role.name,
    description: role.description,
  }));
}

function getDefaultUserRoleNames(openapiRoles: readonly OpenApiRobodevUserRole[]): string[] {
  return openapiRoles.filter((role) => role.isDefault).map((role) => role.name);
}

function countBraces(value: string): number {
  let count = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value.charAt(index);
    if (char === "{") {
      count += 1;
    }
    if (char === "}") {
      count -= 1;
    }
  }

  return count;
}

function excludeDbmlTables(dbml: string, excludedTables: Set<string>): string {
  if (excludedTables.size === 0) {
    return dbml;
  }

  const lines: string[] = [];
  let includeCurrentBlock = true;
  let tableDepth = 0;

  for (const line of dbml.split("\n")) {
    if (tableDepth === 0) {
      const tableName = /^Table\s+([^\s{]+)/.exec(line.trimStart())?.[1];
      if (tableName) {
        includeCurrentBlock = !excludedTables.has(tableName);
        tableDepth = countBraces(line);
      }
    } else {
      tableDepth += countBraces(line);
    }

    if (includeCurrentBlock) {
      lines.push(line);
    }

    if (tableDepth === 0) {
      includeCurrentBlock = true;
    }
  }

  return lines.join("\n");
}

function refReferencesExcludedTable(line: string, excludedTables: Set<string>): boolean {
  if (!line.trimStart().startsWith("Ref:")) {
    return false;
  }

  const tableRefs = line.matchAll(/\b([A-Za-z_]\w*)\.[A-Za-z_]\w*/g);

  for (const match of tableRefs) {
    if (excludedTables.has(match[1] ?? "")) {
      return true;
    }
  }

  return false;
}

function normalizeRobodevDbml(dbml: string, excludedTables: Set<string>): string {
  const normalized = dbml
    .split("\n")
    .filter((line) => !line.trimStart().startsWith("//"))
    .filter((line) => !refReferencesExcludedTable(line, excludedTables))
    .join("\n")
    .trim();

  return excludeDbmlTables(normalized, excludedTables).trim();
}

export function createRobodevProjectRequest(
  values: RobodevFormValues,
  openapi: JsonObject,
  dbml: string,
  executionId: string = crypto.randomUUID(),
): RobodevProjectRequest {
  const openapiRoles = buildOpenApiUserRoles(openapi);
  const userRoles = buildUserRoles(openapiRoles);
  const apiModules = buildApiModules(openapi, getDefaultUserRoleNames(openapiRoles));

  return {
    executionId,
    repository: {
      baseBranch: {
        ownerName: values.baseOwnerName.trim(),
        repositoryName: values.baseRepositoryName.trim(),
        branchName: values.baseBranchName.trim(),
      },
      featureBranch: {
        ownerName: values.targetOwnerName.trim(),
        repositoryName: values.targetRepositoryName.trim(),
        branchName: values.targetBranchName.trim(),
      },
      developer: null,
      commitMessage: values.commitMessage.trim() || null,
    },
    specification: {
      constants: {
        userRoles,
      },
      apiModules,
      dbml: normalizeRobodevDbml(dbml, excludedRobodevDbmlTables(openapi, apiModules)),
    },
    configuration: {
      generationStrategy: {
        agent: values.agent,
        generateCode: values.generateCode,
        generateAdmin: values.generateAdmin,
        testStrategy: values.testStrategy,
        generationStrategy: values.generationStrategy,
        runTests: values.runTests,
      },
      deploy: values.deploy,
      deploymentConfig: {
        deploy: values.deploy,
        appName: values.appName.trim(),
      },
      directory: values.directory.trim(),
      aiProvider: values.aiProvider,
    },
  };
}

function isPlainScalar(value: string): boolean {
  return value !== "" && /^[a-zA-Z0-9_./@-]+$/.test(value) && !["true", "false", "null"].includes(value);
}

function serializeScalar(value: null | boolean | number | string): string {
  if (value === null) {
    return "null";
  }

  if (typeof value === "string") {
    return isPlainScalar(value) ? value : JSON.stringify(value);
  }

  return String(value);
}

function serializeYamlValue(value: JsonValue, indent: number): string[] {
  const pad = " ".repeat(indent);

  if (typeof value === "string" && value.includes("\n")) {
    return ["|", ...value.split("\n").map((line) => `${pad}  ${line}`)];
  }

  if (value === null || typeof value !== "object") {
    return [serializeScalar(value)];
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return ["[]"];
    }

    return value.flatMap((item) => {
      if (item === null || typeof item !== "object") {
        return [`${pad}- ${serializeScalar(item)}`];
      }

      const lines = serializeYamlValue(item, indent + 2);
      const [first, ...rest] = lines;
      return [`${pad}- ${first?.trimStart() ?? ""}`, ...rest];
    });
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    return ["{}"];
  }

  return entries.flatMap(([key, item]) => {
    if (typeof item === "string" && item.includes("\n")) {
      const lines = serializeYamlValue(item, indent + 2);
      const [, ...body] = lines;
      return [`${pad}${key}: |`, ...body];
    }

    if (item === null || typeof item !== "object") {
      return [`${pad}${key}: ${serializeScalar(item)}`];
    }

    const lines = serializeYamlValue(item, indent + 2);
    const isInline = lines.length === 1 && ["[]", "{}"].includes(lines[0] ?? "");
    return isInline ? [`${pad}${key}: ${lines[0]}`] : [`${pad}${key}:`, ...lines];
  });
}

export function serializeYaml(value: JsonValue): string {
  return `${serializeYamlValue(value, 0).join("\n")}\n`;
}

export function createRobodevJson(
  values: RobodevFormValues,
  openapi: JsonObject,
  dbml: string,
  executionId?: string,
): string {
  return `${JSON.stringify(createRobodevProjectRequest(values, openapi, dbml, executionId), null, 2)}\n`;
}

export function createRobodevYaml(
  values: RobodevFormValues,
  openapi: JsonObject,
  dbml: string,
  executionId?: string,
): string {
  return serializeYaml(createRobodevProjectRequest(values, openapi, dbml, executionId) as unknown as JsonValue);
}

function encodeBase64(value: string): string {
  if (typeof globalThis.btoa === "function") {
    const bytes = new TextEncoder().encode(value);
    let binary = "";

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return globalThis.btoa(binary);
  }

  return Buffer.from(value, "utf8").toString("base64");
}

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, String.raw`'\''`)}'`;
}

export function createRobodevCommand(json: string, token: string, command: RobodevCommand): string {
  const authorizationHeader = `Authorization: Basic ${encodeBase64(token.trim())}`;
  const url = shellQuote(ROBODEV_PROJECT_GENERATION_URL);
  const authorization = shellQuote(authorizationHeader);
  const contentType = shellQuote("Content-Type: application/json");
  const body = shellQuote(json.trim());

  if (command === "wget") {
    return [
      `wget --method=POST ${url}`,
      `  --header=${authorization}`,
      `  --header=${contentType}`,
      `  --body-data=${body}`,
      "  --output-document=-",
    ].join(" \\\n");
  }

  return [
    `curl --request POST ${url}`,
    `  --header ${authorization}`,
    `  --header ${contentType}`,
    `  --data ${body}`,
  ].join(" \\\n");
}
