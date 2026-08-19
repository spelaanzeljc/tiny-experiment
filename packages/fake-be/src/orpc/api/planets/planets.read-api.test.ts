/* oxlint-disable jest/max-expects, jest/prefer-importing-jest-globals, vitest/no-importing-vitest-globals, vitest/prefer-strict-boolean-matchers */
import { describe, expect, it } from "vitest";

import { PlanetApi } from "@/openapi/planet/planet.api";
import { setupFakeBackendTestFile } from "~/test/api-test-context";

const testContext = setupFakeBackendTestFile();
const auth = testContext.authConfig();

describe("planet read API", () => {
  it("requires authentication for every read endpoint", async () => {
    await expect(PlanetApi.getAll("+name")).rejects.toMatchObject({
      serverMessage: "Authentication is required",
    });
    await expect(PlanetApi.paginate(1, null, 10, "+name")).rejects.toMatchObject({
      serverMessage: "Authentication is required",
    });
    await expect(PlanetApi.getById(testContext.seedIds.planets.planet1)).rejects.toMatchObject({
      serverMessage: "Authentication is required",
    });
  });

  it("lists enriched planets in the requested order", async () => {
    const planets = await PlanetApi.getAll("-name", undefined, auth);

    expect(planets).toHaveLength(30);
    expect(planets.map(({ name }) => name)).toStrictEqual(
      planets.map(({ name }) => name).sort((a, b) => b.localeCompare(a)),
    );
    expect(planets[0]).toMatchObject({
      creatorName: "Demo User",
      likesCount: 0,
      likedByMe: false,
    });
    expect(planets[0]?.alienName).toBeTruthy();
  });

  it("uses name ascending as the default order", async () => {
    const planets = await PlanetApi.getAll(null, undefined, auth);
    expect(planets.map(({ name }) => name)).toStrictEqual(
      planets.map(({ name }) => name).sort((a, b) => a.localeCompare(b)),
    );
  });

  it("applies alien and discovery-date filters", async () => {
    const alienId = testContext.seedIds.aliens.alien1;
    const planets = await PlanetApi.getAll(
      "+discoveryDate,-name",
      {
        alienId,
        discoveryDate: {
          start: "2001-01-01T00:00:00.000Z",
          end: "2025-12-31T23:59:59.999Z",
        },
      },
      auth,
    );

    expect(planets.length).toBeGreaterThan(0);
    expect(planets.every((planet) => planet.alienId === alienId && planet.discoveryDate != null)).toBeTruthy();
    await expect(PlanetApi.getAll("+name", { alienId: "unknown-alien" }, auth)).resolves.toStrictEqual([]);
  });

  it("paginates a stable globally sorted result", async () => {
    const first = await PlanetApi.paginate(1, null, 7, "+name", undefined, auth);
    const second = await PlanetApi.paginate(2, null, 7, "+name", undefined, auth);
    const last = await PlanetApi.paginate(5, null, 7, "+name", undefined, auth);

    expect(first).toMatchObject({ page: 1, limit: 7, totalItems: 30 });
    expect(first.items).toHaveLength(7);
    expect(second.items).toHaveLength(7);
    expect(last.items).toHaveLength(2);
    expect([...first.items, ...second.items].map(({ name }) => name)).toStrictEqual(
      [...first.items, ...second.items].map(({ name }) => name).sort(),
    );
    expect(new Set([...first.items, ...second.items].map(({ id }) => id))).toHaveLength(14);
  });

  it("applies filters before pagination", async () => {
    const alienId = testContext.seedIds.aliens.alien2;
    const response = await PlanetApi.paginate(1, null, 20, "+name", { alienId }, auth);

    expect(response.totalItems).toBeGreaterThan(0);
    expect(response.items.every((planet) => planet.alienId === alienId)).toBeTruthy();
  });

  it("searches all supported fields before pagination", async () => {
    const byName = await PlanetApi.paginate(1, null, 20, "+name", { search: "venus" }, auth);
    const byDescription = await PlanetApi.paginate(1, null, 20, "+name", { search: "polar ice" }, auth);
    const byAlien = await PlanetApi.paginate(1, null, 20, "+name", { search: "andromedan" }, auth);
    const byCreator = await PlanetApi.paginate(1, null, 20, "+name", { search: "demo user" }, auth);

    expect(byName).toMatchObject({ totalItems: 1 });
    expect(byName.items.map(({ name }) => name)).toStrictEqual(["Venus"]);
    expect(byDescription.items.map(({ name }) => name)).toStrictEqual(["Mars"]);
    expect(byAlien.totalItems).toBeGreaterThan(0);
    expect(byAlien.items.every(({ alienName }) => alienName === "Andromedan")).toBeTruthy();
    expect(byCreator).toMatchObject({ totalItems: 30 });
    expect(byCreator.items).toHaveLength(20);
  });

  it("gets an enriched planet by ID and reports missing planets", async () => {
    await expect(PlanetApi.getById(testContext.seedIds.planets.planet1, auth)).resolves.toMatchObject({
      id: testContext.seedIds.planets.planet1,
      creatorName: "Demo User",
      likesCount: 0,
      likedByMe: false,
    });
    await expect(PlanetApi.getById("missing-planet", auth)).rejects.toMatchObject({
      serverMessage: "Planet not found",
    });
  });
});
