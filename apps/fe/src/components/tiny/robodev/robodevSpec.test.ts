/* oxlint-disable vitest/no-importing-vitest-globals */
import { describe, expect, it } from "vitest";

import { DEFAULT_VALUES, getStoredRobodevFormValues, mergeRobodevFormValues } from "./robodevForm";
import {
  createRobodevCommand,
  createRobodevJson,
  createRobodevProjectRequest,
  createRobodevYaml,
  type RobodevFormValues,
} from "./robodevSpec";

const formValues: RobodevFormValues = {
  baseOwnerName: "povioai",
  baseRepositoryName: "orion-template",
  baseBranchName: "develop",
  targetOwnerName: "povio",
  targetRepositoryName: "service-api",
  targetBranchName: "feature/backend-generation",
  directory: "apps/be",
  appName: "service-api",
  commitMessage: "Generate backend",
  aiProvider: "OpenAI",
  agent: "Codex",
  generationStrategy: "Class",
  testStrategy: "HAPPY_PATH",
  robodevToken: "token:secret",
  robodevCommand: "curl",
  runTests: true,
  deploy: false,
  generateCode: true,
  generateAdmin: false,
};

const openapi = {
  "x-robodev-user-roles": [
    { name: "admin", description: "Admin user role" },
    { name: "manager", description: "Manager user role" },
    { name: "worker", description: "Worker user role" },
  ],
  tags: [
    { name: "userAuth", "x-robodev-hidden": true },
    { name: "media", "x-robodev-hidden": true },
    { name: "managerProjects", "x-robodev-owned-tables": ["Project"], "x-robodev-roles": ["manager"] },
    { name: "adminProjects", "x-robodev-owned-tables": ["Company"], "x-robodev-roles": ["admin"] },
  ],
  components: {
    schemas: {
      ProjectCreateInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          estimate: { type: "number", minimum: 0 },
          notes: { type: "string", nullable: true },
          status: { $ref: "#/components/schemas/ProjectStatus" },
        },
        required: ["name"],
      },
      ProjectStatus: {
        type: "string",
        enum: ["PLANNED", "ACTIVE", "DONE"],
      },
      ProjectFilters: {
        type: "object",
        properties: {
          search: { type: "string" },
          active: { type: "boolean" },
        },
      },
      ProjectOutput: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
        },
        required: ["id", "name"],
      },
      PaginationDto: {
        type: "object",
        properties: {
          page: { type: "number" },
          cursor: { type: "string", nullable: true },
          nextCursor: { type: "string", nullable: true },
          limit: { type: "number" },
          totalItems: { type: "number" },
        },
        required: ["limit", "totalItems"],
      },
      ProjectPaginateItem: {
        $ref: "#/components/schemas/ProjectOutput",
      },
      ProjectPaginateOutput: {
        allOf: [
          { $ref: "#/components/schemas/PaginationDto" },
          {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/ProjectPaginateItem" },
              },
            },
            required: ["items"],
          },
        ],
      },
      AuthRole: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["admin", "manager", "worker"],
          },
        },
      },
    },
  },
  paths: {
    "/api/manager/projects/paginate": {
      get: {
        operationId: "managerProjectsPaginate",
        tags: ["managerProjects"],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "order", in: "query", schema: { type: "string" }, "x-enumNames": ["name", "estimate"] },
          { name: "filter", in: "query", schema: { $ref: "#/components/schemas/ProjectFilters" } },
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProjectPaginateOutput" },
              },
            },
          },
        },
        "x-bl": "Lists projects for the manager.",
      },
    },
    "/api/admin/projects": {
      post: {
        operationId: "adminProjectsCreate",
        tags: ["adminProjects"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProjectCreateInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProjectOutput" },
              },
            },
          },
        },
        "x-bl": "Creates a project for administrators.",
      },
    },
    "/api/user/auth/login": {
      post: {
        operationId: "userAuthLogin",
        tags: ["userAuth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    accessToken: { type: "string" },
                  },
                  required: ["accessToken"],
                },
              },
            },
          },
        },
        "x-bl": "Authenticates a user.",
      },
    },
  },
};

describe("robodev project request generation", () => {
  it("uses a uuid for execution id", () => {
    const request = createRobodevProjectRequest(formValues, openapi, "dbml");

    expect(request.executionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("uses the provided execution id", () => {
    const executionId = "6d09a89e-3193-4580-991f-d528c7e80a55";
    const request = createRobodevProjectRequest(formValues, openapi, "dbml", executionId);

    expect(request.executionId).toBe(executionId);
  });

  it("uses declared OpenAPI roles for global role constants", () => {
    const request = createRobodevProjectRequest(formValues, openapi, "dbml");

    expect(request.specification.constants.userRoles).toStrictEqual([
      { name: "admin", description: "Admin user role" },
      { name: "manager", description: "Manager user role" },
      { name: "worker", description: "Worker user role" },
    ]);
  });

  it("uses explicit module roles with default role fallback", () => {
    const roleOpenapi = {
      "x-robodev-user-roles": [
        { name: "USER", description: "Default role for regular users", isDefault: true },
        { name: "ADMIN", description: "Admin user role" },
      ],
      tags: [{ name: "projects" }, { name: "reports", "x-robodev-roles": ["USER", "ADMIN"] }],
      paths: {
        "/api/projects": {
          get: {
            operationId: "projectsList",
            tags: ["projects"],
            responses: { "204": { description: "No Content" } },
            "x-bl": "Lists projects.",
          },
        },
        "/api/reports": {
          get: {
            operationId: "reportsList",
            tags: ["reports"],
            responses: { "204": { description: "No Content" } },
            "x-bl": "Lists reports.",
          },
        },
      },
    };

    const request = createRobodevProjectRequest(formValues, roleOpenapi, "dbml");

    expect(request.specification.apiModules.find((module) => module.name === "projects")?.apis[0]?.roles).toStrictEqual(
      ["USER"],
    );
    expect(request.specification.apiModules.find((module) => module.name === "reports")?.apis[0]?.roles).toStrictEqual([
      "USER",
      "ADMIN",
    ]);
  });

  it("groups endpoints by tag and extracts endpoint metadata", () => {
    const request = createRobodevProjectRequest(formValues, openapi, "Table projects {\n  id varchar [pk]\n}");

    expect(request.specification.apiModules).toHaveLength(2);
    expect(request.specification.apiModules.map((module) => module.name)).toStrictEqual([
      "managerProjects",
      "adminProjects",
    ]);
    expect(request.specification.apiModules[0]?.apis[0]).toMatchObject({
      method: "GET",
      path: "/api/manager/projects/paginate",
      modificationAction: "ADD",
      isPagination: true,
      roles: ["manager"],
      businessRequirements: "Lists projects for the manager.",
      requestParams: "",
      responseParams: "ProjectPaginateItem",
      validations: "",
      paginatedRequestParams: "ManagerProjectsPaginateQuery",
    });
    expect(request.specification.apiModules[1]?.apis[0]).toMatchObject({
      method: "POST",
      roles: ["admin"],
      businessRequirements: "Creates a project for administrators.",
      requestParams: "ProjectCreateInput",
      responseParams: "ProjectOutput",
      validations: "",
      paginatedRequestParams: "",
    });
  });

  it("normalizes display-style OpenAPI tags to camelCase module names", () => {
    const displayTagOpenapi = {
      tags: [{ name: "Estimation Sharing", "x-robodev-owned-tables": ["EstimationRevision"] }],
      paths: {
        "/api/estimation-revisions": {
          get: {
            operationId: "estimationRevisionsList",
            tags: ["Estimation Sharing"],
            responses: { "204": { description: "No Content" } },
          },
        },
      },
    };

    const request = createRobodevProjectRequest(formValues, displayTagOpenapi, "dbml");

    expect(request.specification.apiModules).toHaveLength(1);
    expect(request.specification.apiModules[0]).toMatchObject({
      name: "estimationSharing",
      tables: ["EstimationRevision"],
    });
  });

  it("includes media upload and download flags on endpoints", () => {
    const mediaOpenapi = {
      "x-robodev-user-roles": [{ name: "USER", description: "Regular user", isDefault: true }],
      tags: [
        {
          name: "planets",
          "x-robodev-media-resources": [
            {
              name: "planet-image",
              field: "imageId",
              dtoField: "image",
              mimeTypes: ["image/jpeg", "image/png", "image/webp"],
              maxFileSize: 12_582_912,
            },
          ],
        },
      ],
      components: {
        schemas: {
          PlanetImageRequestDto: {
            type: "object",
            properties: {
              id: { type: "string" },
            },
            required: ["id"],
          },
          PlanetImageDto: {
            type: "object",
            properties: {
              id: { type: "string" },
              url: { type: "string" },
            },
            required: ["id", "url"],
          },
          PlanetsCreateRequestDto: {
            type: "object",
            properties: {
              name: { type: "string" },
              image: {
                nullable: true,
                allOf: [{ $ref: "#/components/schemas/PlanetImageRequestDto" }],
              },
            },
            required: ["name"],
          },
          PlanetsGetResponseDto: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              image: {
                nullable: true,
                allOf: [{ $ref: "#/components/schemas/PlanetImageDto" }],
              },
            },
            required: ["id", "name"],
          },
        },
      },
      paths: {
        "/api/planets/{id}": {
          get: {
            operationId: "planetsGetById",
            tags: ["planets"],
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/PlanetsGetResponseDto" },
                  },
                },
              },
            },
            hasMediaDownload: true,
          },
        },
        "/api/planets": {
          post: {
            operationId: "planetsCreate",
            tags: ["planets"],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PlanetsCreateRequestDto" },
                },
              },
            },
            responses: {
              "201": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/PlanetsGetResponseDto" },
                  },
                },
              },
            },
            hasMediaUpload: true,
            hasMediaDownload: true,
          },
        },
      },
    };

    const request = createRobodevProjectRequest(formValues, mediaOpenapi, "dbml");
    const planetsModule = request.specification.apiModules.find((module) => module.name === "planets");

    expect(planetsModule?.apis).toStrictEqual([
      expect.objectContaining({
        method: "GET",
        path: "/api/planets/{id}",
        hasMediaDownload: true,
        roles: ["USER"],
      }),
      expect.objectContaining({
        method: "POST",
        path: "/api/planets",
        hasMediaUpload: true,
        hasMediaDownload: true,
        roles: ["USER"],
      }),
    ]);
    expect(planetsModule?.mediaResources).toStrictEqual([
      {
        name: "planet-image",
        field: "imageId",
        dtoField: "image",
        mimeTypes: ["image/jpeg", "image/png", "image/webp"],
        maxFileSize: 12_582_912,
      },
    ]);
  });

  it("uses validations for non-paginated GET query DTOs", () => {
    const labelsOpenapi = {
      tags: [{ name: "projects" }],
      components: {
        schemas: {
          Label: {
            type: "object",
            properties: {
              id: { type: "string" },
              label: { type: "string" },
            },
            required: ["id", "label"],
          },
          ProjectLabelsOutput: {
            type: "array",
            items: { $ref: "#/components/schemas/Label" },
          },
        },
      },
      paths: {
        "/api/projects/labels": {
          get: {
            operationId: "projectsLabels",
            tags: ["projects"],
            parameters: [{ name: "search", in: "query", schema: { type: "string" } }],
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ProjectLabelsOutput" },
                  },
                },
              },
            },
            "x-bl": "Lists project labels matching the optional search term.",
          },
        },
      },
    };

    const request = createRobodevProjectRequest(formValues, labelsOpenapi, "dbml");
    const [projectsModule] = request.specification.apiModules;

    expect(projectsModule?.apis[0]).toMatchObject({
      method: "GET",
      path: "/api/projects/labels",
      isPagination: false,
      requestParams: "",
      validations:
        'Query params: ProjectsLabelsQuery{ fields: [{ name: "search", type: "string", context: "Search", required: false }] }',
      paginatedRequestParams: "",
    });
    expect(projectsModule?.requestDtos).toStrictEqual([]);
    expect(projectsModule?.paginatedRequestDtos).toStrictEqual([]);
  });

  it("uses query names for generated controller query parameter DTOs", () => {
    const controllerOpenapi = {
      tags: [{ name: "aliens" }, { name: "planets" }],
      components: {
        schemas: {
          Label: {
            type: "object",
            properties: {
              id: { type: "string" },
              label: { type: "string" },
            },
          },
          AliensGetLabelsResponse: {
            type: "array",
            items: { $ref: "#/components/schemas/Label" },
          },
          Planet: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
            },
          },
          PlanetPaginationResponse: {
            type: "object",
            properties: {
              page: { type: "number" },
              limit: { type: "number" },
              totalItems: { type: "number" },
              items: {
                type: "array",
                items: { $ref: "#/components/schemas/Planet" },
              },
            },
          },
        },
      },
      paths: {
        "/api/aliens/labels": {
          get: {
            operationId: "AlienController_getLabels",
            tags: ["aliens"],
            parameters: [{ name: "search", in: "query", schema: { type: "string" } }],
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/AliensGetLabelsResponse" },
                  },
                },
              },
            },
          },
        },
        "/api/planets/paginate": {
          get: {
            operationId: "PlanetController_paginate",
            tags: ["planets"],
            parameters: [
              { name: "page", in: "query", schema: { type: "integer" } },
              { name: "limit", in: "query", schema: { type: "number" } },
            ],
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/PlanetPaginationResponse" },
                  },
                },
              },
            },
          },
        },
      },
    };

    const request = createRobodevProjectRequest(formValues, controllerOpenapi, "dbml");
    const aliensModule = request.specification.apiModules.find((module) => module.name === "aliens");
    const planetsModule = request.specification.apiModules.find((module) => module.name === "planets");
    const deprecatedGetLabelsName = ["AlienControllerGetLabels", "Input"].join("");

    expect(aliensModule?.apis[0]?.validations).toContain("AlienControllerGetLabelsQuery");
    expect(aliensModule?.apis[0]?.validations).not.toContain(deprecatedGetLabelsName);
    expect(planetsModule?.apis[0]?.paginatedRequestParams).toBe("PlanetControllerPaginateQuery");
  });

  it("uses owned table tag metadata for module tables", () => {
    const request = createRobodevProjectRequest(formValues, openapi, "dbml");

    expect(request.specification.apiModules[0]?.tables).toStrictEqual(["Project"]);
    expect(request.specification.apiModules[1]?.tables).toStrictEqual(["Company"]);
  });

  it("resolves request, response, and paginated DTOs", () => {
    const request = createRobodevProjectRequest(formValues, openapi, "dbml");
    const [managerModule, adminModule] = request.specification.apiModules;

    expect(managerModule?.requestDtos).toStrictEqual([]);
    expect(managerModule?.responseDtos[0]?.name).toBe("ProjectPaginateItem");
    expect(managerModule?.responseDtos[0]?.fields).toStrictEqual([
      { name: "id", type: "string", context: "Id", required: true },
      { name: "name", type: "string", context: "Name", required: true },
      { name: "description", type: "string", context: "Description", required: false },
    ]);
    expect(managerModule?.paginatedRequestDtos[0]).toMatchObject({
      name: "ManagerProjectsPaginateQuery",
      filters: [
        { name: "search", type: "string", context: "Search" },
        { name: "active", type: "boolean", context: "Active" },
      ],
      sortingFields: ["name", "estimate"],
    });
    expect(adminModule?.requestDtos[0]).toMatchObject({
      name: "ProjectCreateInput",
      fields: expect.arrayContaining([
        expect.objectContaining({ name: "name", type: "string", required: true }),
        expect.objectContaining({ name: "notes", type: "string", required: false }),
      ]),
    });
  });

  it("formats record schema fields as record key-value types", () => {
    const recordOpenapi = {
      tags: [{ name: "projects" }],
      components: {
        schemas: {
          ProjectCreateInput: {
            type: "object",
            properties: {
              metadata: {
                type: "object",
                additionalProperties: { type: "string" },
              },
            },
          },
          ProjectOutput: {
            type: "object",
            properties: {
              id: { type: "string" },
            },
          },
        },
      },
      paths: {
        "/api/projects": {
          post: {
            operationId: "projectsCreate",
            tags: ["projects"],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ProjectCreateInput" },
                },
              },
            },
            responses: {
              "201": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ProjectOutput" },
                  },
                },
              },
            },
          },
        },
      },
    };

    const request = createRobodevProjectRequest(formValues, recordOpenapi, "dbml");
    const [projectsModule] = request.specification.apiModules;

    expect(projectsModule?.requestDtos[0]?.fields).toContainEqual({
      name: "metadata",
      type: "record<string,string>",
      context: "Metadata",
      required: false,
    });
  });

  it("preserves date formats in request and response DTO field types", () => {
    const formattedFieldsOpenapi = {
      tags: [{ name: "events" }],
      components: {
        schemas: {
          EventInput: {
            type: "object",
            properties: {
              startsAt: { type: "string", format: "date-time" },
              reminderTimes: {
                type: "array",
                items: { type: "string", format: "date-time" },
              },
              eventDate: { type: "string", format: "date" },
              excludedDates: {
                type: "array",
                items: { type: "string", format: "date" },
              },
              capacity: { type: "integer" },
            },
            required: ["startsAt", "reminderTimes", "eventDate", "excludedDates", "capacity"],
          },
          EventOutput: {
            type: "object",
            properties: {
              startsAt: { type: "string", format: "date-time" },
              reminderTimes: {
                type: "array",
                items: { type: "string", format: "date-time" },
              },
              eventDate: { type: "string", format: "date" },
              excludedDates: {
                type: "array",
                items: { type: "string", format: "date" },
              },
              capacity: { type: "integer" },
            },
            required: ["startsAt", "reminderTimes", "eventDate", "excludedDates", "capacity"],
          },
        },
      },
      paths: {
        "/api/events": {
          post: {
            operationId: "eventsCreate",
            tags: ["events"],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/EventInput" },
                },
              },
            },
            responses: {
              "201": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/EventOutput" },
                  },
                },
              },
            },
          },
        },
      },
    };

    const request = createRobodevProjectRequest(formValues, formattedFieldsOpenapi, "dbml");
    const [eventsModule] = request.specification.apiModules;
    const expectedFields = [
      { name: "startsAt", type: "date-time", context: "Starts At", required: true },
      { name: "reminderTimes", type: "date-time[]", context: "Reminder Times", required: true },
      { name: "eventDate", type: "date", context: "Event Date", required: true },
      { name: "excludedDates", type: "date[]", context: "Excluded Dates", required: true },
      { name: "capacity", type: "integer", context: "Capacity", required: true },
    ];

    expect(eventsModule?.requestDtos[0]?.fields).toStrictEqual(expectedFields);
    expect(eventsModule?.responseDtos[0]?.fields).toStrictEqual(expectedFields);
  });

  it("represents non-paginated array responses with array response DTOs", () => {
    const listOpenapi = {
      tags: [{ name: "projects" }],
      components: {
        schemas: {
          ProjectOutput: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
            },
            required: ["id", "name"],
          },
          ProjectsListOutput: {
            type: "array",
            items: { $ref: "#/components/schemas/ProjectOutput" },
          },
        },
      },
      paths: {
        "/api/projects": {
          get: {
            operationId: "projectsList",
            tags: ["projects"],
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ProjectsListOutput" },
                  },
                },
              },
            },
            "x-bl": "Lists projects.",
          },
        },
      },
    };

    const request = createRobodevProjectRequest(formValues, listOpenapi, "dbml");
    const [projectsModule] = request.specification.apiModules;

    expect(projectsModule?.apis[0]).toMatchObject({
      responseParams: "ProjectOutput",
    });
    expect(projectsModule?.responseDtos.map((dto) => dto.name)).toStrictEqual(["ProjectOutput"]);
    expect(projectsModule?.responseDtos[0]).toMatchObject({
      isArray: true,
    });
    expect(projectsModule?.responseDtos[0]?.fields).toStrictEqual([
      { name: "id", type: "string", context: "Id", required: true },
      { name: "name", type: "string", context: "Name", required: true },
    ]);
  });

  it("collects nested referenced DTOs into the owning robodev modules", () => {
    const nestedOpenapi = {
      tags: [{ name: "managerTimesheets" }, { name: "workerStopwatch" }],
      components: {
        schemas: {
          ManagerTimesheetsCalendarDay: {
            type: "object",
            properties: {
              date: { type: "string" },
              workHours: { type: "number" },
            },
            required: ["date", "workHours"],
          },
          ManagerTimesheetsCalendarSummary: {
            type: "object",
            properties: {
              balanceHours: { type: "number" },
            },
            required: ["balanceHours"],
          },
          ManagerTimesheetsCalendarOutput: {
            type: "object",
            properties: {
              days: {
                type: "array",
                items: { $ref: "#/components/schemas/ManagerTimesheetsCalendarDay" },
              },
              summary: { $ref: "#/components/schemas/ManagerTimesheetsCalendarSummary" },
            },
            required: ["days", "summary"],
          },
          WorkerStopwatchStopwatchSession: {
            type: "object",
            properties: {
              id: { type: "string" },
              projectId: { type: "string" },
            },
            required: ["id", "projectId"],
          },
          WorkerStopwatchGetActiveOutput: {
            type: "object",
            properties: {
              session: { $ref: "#/components/schemas/WorkerStopwatchStopwatchSession" },
            },
          },
        },
      },
      paths: {
        "/api/manager/timesheets/calendar": {
          get: {
            operationId: "managerTimesheetsCalendar",
            tags: ["managerTimesheets"],
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/ManagerTimesheetsCalendarOutput" },
                  },
                },
              },
            },
            "x-bl": "Returns calendar totals.",
          },
        },
        "/api/worker/stopwatch/active": {
          get: {
            operationId: "workerStopwatchGetActive",
            tags: ["workerStopwatch"],
            responses: {
              "200": {
                description: "OK",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/WorkerStopwatchGetActiveOutput" },
                  },
                },
              },
            },
            "x-bl": "Returns the active stopwatch session.",
          },
        },
      },
    };
    const request = createRobodevProjectRequest(formValues, nestedOpenapi, "dbml");
    const managerModule = request.specification.apiModules.find((module) => module.name === "managerTimesheets");
    const stopwatchModule = request.specification.apiModules.find((module) => module.name === "workerStopwatch");

    expect(managerModule?.responseDtos.map((dto) => dto.name)).toStrictEqual([
      "ManagerTimesheetsCalendarOutput",
      "ManagerTimesheetsCalendarDay",
      "ManagerTimesheetsCalendarSummary",
    ]);
    expect(managerModule?.responseDtos[0]?.fields).toStrictEqual([
      { name: "days", type: "ManagerTimesheetsCalendarDay[]", context: "Days", required: true },
      { name: "summary", type: "ManagerTimesheetsCalendarSummary", context: "Summary", required: true },
    ]);
    expect(stopwatchModule?.responseDtos.map((dto) => dto.name)).toStrictEqual([
      "WorkerStopwatchGetActiveOutput",
      "WorkerStopwatchStopwatchSession",
    ]);
    expect(stopwatchModule?.responseDtos[0]?.fields).toStrictEqual([
      {
        name: "session",
        type: "WorkerStopwatchStopwatchSession",
        context: "Session",
        required: false,
      },
    ]);
  });

  it("uses separate base and target repository inputs", () => {
    const request = createRobodevProjectRequest(formValues, openapi, "dbml");

    expect(request.repository.baseBranch).toStrictEqual({
      ownerName: "povioai",
      repositoryName: "orion-template",
      branchName: "develop",
    });
    expect(request.repository.featureBranch).toStrictEqual({
      ownerName: "povio",
      repositoryName: "service-api",
      branchName: "feature/backend-generation",
    });
  });

  it("emits module constants as an object", () => {
    const request = createRobodevProjectRequest(formValues, openapi, "dbml");

    expect(request.specification.apiModules[0]?.constants).toStrictEqual({ enums: [] });
  });

  it("emits referenced enum constants for the owning module", () => {
    const request = createRobodevProjectRequest(formValues, openapi, "dbml");
    const adminModule = request.specification.apiModules.find((module) => module.name === "adminProjects");

    expect(adminModule?.requestDtos[0]?.fields).toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ name: "status", type: "ProjectStatus" })]),
    );
    expect(adminModule?.constants).toStrictEqual({
      enums: [{ name: "ProjectStatus", values: ["PLANNED", "ACTIVE", "DONE"] }],
    });
  });

  it("includes dbml and selected configuration fields", () => {
    const request = createRobodevProjectRequest(
      formValues,
      openapi,
      "// DBML generated from fake-be table schemas\nTable projects {}",
    );

    expect(request.specification.dbml).toBe("Table projects {}");
    expect(request.configuration).toMatchObject({
      aiProvider: "OpenAI",
      directory: "apps/be",
    });
    expect(Object.keys(request.configuration)).not.toStrictEqual(
      expect.arrayContaining([
        "autocorrect",
        "analyzeDependencies",
        "assignTables",
        "maxFixAttempts",
        "disabledModules",
        "commitAfterEachStep",
      ]),
    );
  });

  it("keeps unowned DBML tables while omitting tables explicitly hidden from Robodev", () => {
    const request = createRobodevProjectRequest(
      formValues,
      {
        ...openapi,
        tags: [...openapi.tags, { name: "secret", "x-robodev-hidden": true, "x-robodev-owned-tables": ["Secret"] }],
      },
      [
        "Table Project {}",
        "Table Media {}",
        "Table User {}",
        "Table Secret {}",
        "Ref: Project.userId > User.id",
        "Ref: Project.mediaId > Media.id",
        "Ref: Project.secretId > Secret.id",
      ].join("\n"),
    );

    expect(request.specification.dbml).toBe(
      "Table Project {}\nTable Media {}\nTable User {}\nRef: Project.userId > User.id\nRef: Project.mediaId > Media.id",
    );
  });

  it("omits fake mail APIs, configuration schemas, and tables from Robodev", () => {
    const request = createRobodevProjectRequest(
      formValues,
      {
        ...openapi,
        tags: [...openapi.tags, { name: "Fake Mail", "x-robodev-hidden": true, "x-robodev-owned-tables": ["Mail"] }],
        paths: {
          ...openapi.paths,
          "/api/fake-mail/demo": {
            post: {
              tags: ["Fake Mail"],
              operationId: "FakeMailController_sendDemo",
              "x-bl": "Sends a fake mailbox demo message.",
              requestBody: {
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/FakeMailSendDemoBody" },
                  },
                },
              },
              responses: {
                "201": {
                  content: {
                    "application/json": {
                      schema: { $ref: "#/components/schemas/FakeMailSendDemoResponse" },
                    },
                  },
                },
              },
            },
          },
        },
        components: {
          ...openapi.components,
          schemas: {
            ...openapi.components.schemas,
            FakeMailSendDemoBody: {
              type: "object",
              properties: { variant: { type: "string", enum: ["text", "html"] } },
              required: ["variant"],
            },
            FakeMailSendDemoResponse: {
              type: "object",
              properties: { mailIds: { type: "array", items: { type: "string" } } },
              required: ["mailIds"],
            },
          },
        },
      },
      ["Table Project {}", "Table Mail {}", "Table User {}"].join("\n"),
    );

    const serializedSpecification = JSON.stringify(request.specification);
    expect(request.specification.apiModules.map((module) => module.name)).not.toContain("Fake Mail");
    expect(request.specification.dbml).not.toContain("Mail");
    expect(serializedSpecification).not.toContain("FakeMail");
  });

  it("rejects duplicate owned table metadata", () => {
    expect(() =>
      createRobodevProjectRequest(
        formValues,
        {
          ...openapi,
          tags: [
            { name: "managerProjects", "x-robodev-owned-tables": ["Project"] },
            { name: "adminProjects", "x-robodev-owned-tables": ["Project"] },
          ],
        },
        "dbml",
      ),
    ).toThrow("Robodev table ownership conflict: Project: managerProjects, adminProjects");
  });
});

describe("robodev YAML serialization", () => {
  it("serializes multiline dbml as a YAML block scalar", () => {
    const yaml = createRobodevYaml(formValues, openapi, "Table projects {\n  id varchar [pk]\n}");

    expect(yaml).toContain("dbml: |");
    expect(yaml).toContain("  Table projects {");
    expect(yaml).toContain("configuration:");
    expect(yaml).toContain("directory: apps/be");
    expect(["disabledModules:", "maxFixAttempts:"].filter((legacyKey) => yaml.includes(legacyKey))).toHaveLength(0);
  });

  it("omits generated DBML comments from the serialized payload", () => {
    const yaml = createRobodevYaml(
      formValues,
      openapi,
      "// DBML generated from fake-be table schemas\n// Paste into dbdiagram.io\n\nTable projects {}",
    );

    expect(yaml).not.toContain("// DBML generated");
    expect(yaml).not.toContain("// Paste into dbdiagram.io");
    expect(yaml).toContain('dbml: "Table projects {}"');
  });
});

describe("robodev JSON serialization", () => {
  it("serializes the project request as pretty JSON", () => {
    const json = createRobodevJson(
      formValues,
      openapi,
      "// DBML generated from fake-be table schemas\n// Paste into dbdiagram.io\n\nTable projects {}",
    );
    const parsed = JSON.parse(json) as ReturnType<typeof createRobodevProjectRequest>;

    expect(json).toContain('\n  "repository": {');
    expect(json).not.toContain("// DBML generated");
    expect(parsed.repository.baseBranch.ownerName).toBe("povioai");
    expect(parsed.specification.dbml).toBe("Table projects {}");
  });

  it("serializes the provided execution id", () => {
    const executionId = "6d09a89e-3193-4580-991f-d528c7e80a55";
    const json = createRobodevJson(formValues, openapi, "dbml", executionId);
    const parsed = JSON.parse(json) as ReturnType<typeof createRobodevProjectRequest>;

    expect(parsed.executionId).toBe(executionId);
  });
});

describe("robodev command serialization", () => {
  it("creates a curl command with encoded Basic authorization and JSON body", () => {
    const command = createRobodevCommand('{"name":"service-api"}\n', "token:secret", "curl");

    expect(command).toContain("curl --request POST 'https://dev.codegen.robodev.com/api/projects/gen5'");
    expect(command).toContain("--header 'Authorization: Basic dG9rZW46c2VjcmV0'");
    expect(command).toContain("--header 'Content-Type: application/json'");
    expect(command).toContain('--data \'{"name":"service-api"}\'');
  });

  it("creates a wget command when selected", () => {
    const command = createRobodevCommand('{"name":"service-api"}\n', "token:secret", "wget");

    expect(command).toContain("wget --method=POST 'https://dev.codegen.robodev.com/api/projects/gen5'");
    expect(command).toContain("--header='Authorization: Basic dG9rZW46c2VjcmV0'");
    expect(command).toContain("--header='Content-Type: application/json'");
    expect(command).toContain('--body-data=\'{"name":"service-api"}\'');
    expect(command).toContain("--output-document=-");
  });

  it("shell-quotes single quotes in JSON bodies", () => {
    expect(createRobodevCommand('{"name":"owner\'s api"}', "token:secret", "curl")).toContain(
      String.raw`--data '{"name":"owner'\''s api"}'`,
    );
  });
});

describe("robodev persisted form values", () => {
  it("merges valid stored values over defaults", () => {
    expect(
      mergeRobodevFormValues({
        targetOwnerName: "povio",
        targetRepositoryName: "service-api",
        aiProvider: "Anthropic",
        runTests: false,
      }),
    ).toMatchObject({
      ...DEFAULT_VALUES,
      targetOwnerName: "povio",
      targetRepositoryName: "service-api",
      aiProvider: "Anthropic",
      runTests: false,
    });
  });

  it("ignores invalid stored values field-by-field", () => {
    expect(
      mergeRobodevFormValues({
        targetOwnerName: "povio",
        aiProvider: "Invalid",
        runTests: "yes",
      }),
    ).toMatchObject({
      ...DEFAULT_VALUES,
      targetOwnerName: "povio",
    });
  });

  it("does not include the RoboDev token in stored values", () => {
    expect(getStoredRobodevFormValues({ ...formValues, robodevToken: "plain-token" })).not.toHaveProperty(
      "robodevToken",
    );
  });
});
