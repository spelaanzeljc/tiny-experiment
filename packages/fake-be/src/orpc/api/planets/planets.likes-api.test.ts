/* oxlint-disable jest/prefer-importing-jest-globals, vitest/no-importing-vitest-globals */
import { describe, expect, it } from "vitest";

import { PlanetApi } from "@/openapi/planet/planet.api";
import { setupFakeBackendTestFile } from "~/test/api-test-context";

const testContext = setupFakeBackendTestFile();
const planetId = testContext.seedIds.planets.planet1;
const auth = testContext.authConfig();

describe("planet likes API", () => {
  it("likes a planet and exposes the state on reads", async () => {
    await expect(PlanetApi.like(planetId, auth)).resolves.toMatchObject({ likesCount: 1, likedByMe: true });
    await expect(PlanetApi.getById(planetId, auth)).resolves.toMatchObject({ likesCount: 1, likedByMe: true });
  });

  it("is idempotent when the same user likes repeatedly", async () => {
    await expect(PlanetApi.like(planetId, auth)).resolves.toMatchObject({ likesCount: 1, likedByMe: true });
  });

  it("isolates likedByMe while sharing the aggregate count", async () => {
    const otherUser = await testContext.createTestUser({ id: "likes-user" });
    const otherAuth = testContext.authConfig(otherUser.id);

    await expect(PlanetApi.getById(planetId, otherAuth)).resolves.toMatchObject({
      likesCount: 1,
      likedByMe: false,
    });
    await expect(PlanetApi.like(planetId, otherAuth)).resolves.toMatchObject({ likesCount: 2, likedByMe: true });
    await expect(PlanetApi.getById(planetId, auth)).resolves.toMatchObject({ likesCount: 2, likedByMe: true });
  });

  it("unlikes only for the authenticated user and is idempotent", async () => {
    await expect(PlanetApi.unlike(planetId, auth)).resolves.toMatchObject({ likesCount: 1, likedByMe: false });
    await expect(PlanetApi.unlike(planetId, auth)).resolves.toMatchObject({ likesCount: 1, likedByMe: false });
  });

  it("reports missing planets for like and unlike", async () => {
    await expect(PlanetApi.like("missing-planet", auth)).rejects.toMatchObject({ serverMessage: "Planet not found" });
    await expect(PlanetApi.unlike("missing-planet", auth)).rejects.toMatchObject({ serverMessage: "Planet not found" });
  });
});
