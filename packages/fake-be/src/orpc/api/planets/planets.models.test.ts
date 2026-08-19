/* oxlint-disable import/no-nodejs-modules -- Tests read the generated OpenAPI JSON fixture from disk. */
import { readFileSync } from "node:fs";

/* oxlint-disable vitest/no-importing-vitest-globals */
import { describe, expect, it } from "vitest";

import { PlanetsGetResponseDtoSchema, PlanetsPaginateQuerySchema } from "~/orpc/api/planets/planets.models";

const basePlanet = {
  id: "planet-1",
  userId: "user-1",
  alienId: null,
  discoveryDate: null,
  name: "Kepler Test",
  description: null,
  image: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("planet API models", () => {
  it("requires like metadata on enriched planet responses", () => {
    const planet = PlanetsGetResponseDtoSchema.parse({
      ...basePlanet,
      likesCount: 2,
      likedByMe: true,
    });

    expect(planet.likesCount).toBe(2);
    expect(planet).toMatchObject({ likedByMe: true });
  });

  it("rejects negative like counts", () => {
    const result = PlanetsGetResponseDtoSchema.safeParse({
      ...basePlanet,
      likesCount: -1,
      likedByMe: false,
    });

    expect(result).toMatchObject({ success: false });
  });

  it("allows paginate queries without a cursor", () => {
    const query = PlanetsPaginateQuerySchema.parse({
      page: 1,
      limit: 20,
    });

    expect(query.cursor).toBeUndefined();
  });

  it("allows cursor field names and field names with non-empty values", () => {
    expect(PlanetsPaginateQuerySchema.parse({ cursor: "name" })).toMatchObject({ cursor: "name" });
    expect(PlanetsPaginateQuerySchema.parse({ cursor: "name:Kepler" })).toMatchObject({ cursor: "name:Kepler" });
    expect(PlanetsPaginateQuerySchema.parse({ cursor: " discoveryDate:2026-01-01 " })).toMatchObject({
      cursor: "discoveryDate:2026-01-01",
    });
  });

  it("rejects empty cursors and cursors with empty values", () => {
    const invalidCursors = ["", " ", ":Kepler", "name:", "1name", "name-with-dash"];
    const messages: string[] = [];

    for (const cursor of invalidCursors) {
      const result = PlanetsPaginateQuerySchema.safeParse({ cursor });

      if (result.success) {
        throw new Error(`Expected cursor "${cursor}" to be invalid`);
      }

      messages.push(result.error.issues[0]?.message ?? "");
    }

    expect(messages).toStrictEqual([
      "Cursor must be a field name or a field name followed by a non-empty value",
      "Cursor must be a field name or a field name followed by a non-empty value",
      "Cursor must be a field name or a field name followed by a non-empty value",
      "Cursor must be a field name or a field name followed by a non-empty value",
      "Cursor must be a field name or a field name followed by a non-empty value",
      "Cursor must be a field name or a field name followed by a non-empty value",
    ]);
  });

  it("uses real backend dto names in generated OpenAPI schemas", () => {
    const spec = JSON.parse(readFileSync(new URL("../../../../openapi.generated.json", import.meta.url), "utf8")) as {
      components: {
        schemas: Record<string, { enum?: string[] }>;
      };
      tags: {
        name: string;
        "x-robodev-media-resources"?: {
          name: string;
          field: string;
          dtoField: string;
          mimeTypes: string[];
          maxFileSize: number;
        }[];
      }[];
    };
    const schemaNames = Object.keys(spec.components.schemas);

    expect(schemaNames).toStrictEqual(
      expect.arrayContaining([
        "AliensGetLabelsQuery",
        "GetAllResponse",
        "MediaUploadRequest",
        "MediaUploadInstructionsResponse",
        "PlanetControllerUpdateRequestDto",
        "PlanetImageDto",
        "PlanetImageRequestDto",
        "PlanetPaginateFilterParam",
        "PlanetsGetAllQuery",
        "PlanetsCreateRequestDto",
        "PlanetsGetResponseDto",
        "PlanetsPaginateItemDto",
        "PlanetsPaginateItemPaginationResponse",
        "PlanetsPaginateQuery",
        "UserMeResponse",
      ]),
    );

    expect(
      schemaNames.filter((name) => /OutputOutput|ResponseResponse|RequestRequest|InputDto|OutputDto/.test(name)),
    ).toStrictEqual([]);
    expect(spec.components.schemas.MediaResourceName?.enum).toContain("planet-image");
    expect(spec.tags.find((tag) => tag.name === "Planet")?.["x-robodev-media-resources"]).toStrictEqual([
      {
        name: "planet-image",
        field: "imageId",
        dtoField: "image",
        mimeTypes: ["image/jpeg", "image/png", "image/webp"],
        maxFileSize: 2 * 1024 * 1024,
      },
    ]);
  });
});
