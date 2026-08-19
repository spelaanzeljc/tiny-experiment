/* oxlint-disable jest/max-expects, jest/prefer-importing-jest-globals, vitest/no-importing-vitest-globals */
import { describe, expect, it } from "vitest";

import { PlanetApi } from "@/openapi/planet/planet.api";
import { mediaRepository } from "~/db/tables/media/media.repository";
import { setupFakeBackendTestFile } from "~/test/api-test-context";

const testContext = setupFakeBackendTestFile();
const auth = testContext.authConfig();
const validBody = {
  name: "Test Planet",
  alienId: testContext.seedIds.aliens.alien1,
  discoveryDate: "2024-03-01T12:00:00.000Z",
  description: "Created through the generated client",
  image: null,
};

describe("planet write API", () => {
  it("requires authentication for every write endpoint", async () => {
    await expect(PlanetApi.create(validBody)).rejects.toMatchObject({ serverMessage: "Authentication is required" });
    await expect(PlanetApi.update(testContext.seedIds.planets.planet1, validBody)).rejects.toMatchObject({
      serverMessage: "Authentication is required",
    });
    await expect(PlanetApi.deleteApiPlanetsById(testContext.seedIds.planets.planet1)).rejects.toMatchObject({
      serverMessage: "Authentication is required",
    });
    await expect(PlanetApi.like(testContext.seedIds.planets.planet1)).rejects.toMatchObject({
      serverMessage: "Authentication is required",
    });
    await expect(PlanetApi.unlike(testContext.seedIds.planets.planet1)).rejects.toMatchObject({
      serverMessage: "Authentication is required",
    });
  });

  it("creates an enriched planet owned by the authenticated user", async () => {
    const created = await PlanetApi.create(validBody, auth);

    expect(created).toMatchObject({
      ...validBody,
      image: null,
      userId: testContext.seedIds.users.demo,
      creatorName: "Demo User",
      alienName: "Andromedan",
      likesCount: 0,
      likedByMe: false,
    });
    await expect(PlanetApi.getById(created.id, auth)).resolves.toMatchObject({ id: created.id });
  });

  it("normalizes omitted optional values to null", async () => {
    const created = await PlanetApi.create({ name: "Minimal Planet" }, auth);
    expect(created).toMatchObject({ alienId: null, discoveryDate: null, description: null, image: null });
  });

  it("rejects an unknown alien and invalid request data", async () => {
    await expect(PlanetApi.create({ ...validBody, alienId: "missing-alien" }, auth)).rejects.toMatchObject({
      serverMessage: "Alien not found",
    });
    expect(() => PlanetApi.create({ ...validBody, name: "" }, auth)).toThrow(
      "An error occurred while validating the data",
    );
  });

  it("enforces media ownership and readiness", async () => {
    const otherUser = await testContext.createTestUser({ id: "media-owner" });
    const now = new Date().toISOString();
    const baseMedia = {
      key: "test-key",
      provider: "fake",
      resourceName: "planet-image",
      meta: null,
      fileName: "planet.png",
      fileSize: 10,
      mimeType: "image/png",
      uploaded: now,
      validated: now,
      deleted: null,
      loOid: null,
      module: null,
      type: null,
      resourceId: null,
      createdAt: now,
      updatedAt: now,
    };
    await mediaRepository.create({ ...baseMedia, id: "foreign-media", userId: otherUser.id });
    await mediaRepository.create({
      ...baseMedia,
      id: "unready-media",
      userId: testContext.seedIds.users.demo,
      validated: null,
    });
    await mediaRepository.create({
      ...baseMedia,
      id: "wrong-resource-media",
      userId: testContext.seedIds.users.demo,
      resourceName: "other-resource",
    });
    await mediaRepository.create({
      ...baseMedia,
      id: "ready-media",
      userId: testContext.seedIds.users.demo,
    });

    await expect(PlanetApi.create({ ...validBody, image: { id: "missing-media" } }, auth)).rejects.toMatchObject({
      serverMessage: "Media not found",
    });
    await expect(PlanetApi.create({ ...validBody, image: { id: "foreign-media" } }, auth)).rejects.toMatchObject({
      serverMessage: "You can only use your own media",
    });
    await expect(PlanetApi.create({ ...validBody, image: { id: "wrong-resource-media" } }, auth)).rejects.toMatchObject(
      { serverMessage: "Media cannot be used as a planet image" },
    );
    await expect(PlanetApi.create({ ...validBody, image: { id: "unready-media" } }, auth)).rejects.toMatchObject({
      serverMessage: "Media must be uploaded and validated before it can be attached",
    });
    await expect(PlanetApi.create({ ...validBody, image: { id: "ready-media" } }, auth)).resolves.toMatchObject({
      image: null,
    });
  });

  it("updates owned planets and removes nullable associations", async () => {
    const created = await PlanetApi.create(validBody, auth);
    const updated = await PlanetApi.update(
      created.id,
      { name: "Updated Planet", alienId: null, discoveryDate: null, description: null, image: null },
      auth,
    );

    expect(updated).toMatchObject({
      id: created.id,
      name: "Updated Planet",
      alienId: null,
      discoveryDate: null,
      description: null,
    });
    expect(updated).not.toHaveProperty("alienName");
  });

  it("rejects updates by non-owners and updates to missing records", async () => {
    const otherUser = await testContext.createTestUser({ id: "update-user" });
    await expect(
      PlanetApi.update(testContext.seedIds.planets.planet1, validBody, testContext.authConfig(otherUser.id)),
    ).rejects.toMatchObject({ serverMessage: "You can only update your own planets" });
    await expect(PlanetApi.update("missing-planet", validBody, auth)).rejects.toMatchObject({
      serverMessage: "Planet not found",
    });
    await expect(
      PlanetApi.update(testContext.seedIds.planets.planet1, { ...validBody, alienId: "missing-alien" }, auth),
    ).rejects.toMatchObject({ serverMessage: "Alien not found" });
  });

  it("deletes owned planets and rejects forbidden or missing deletes", async () => {
    const created = await PlanetApi.create({ name: "Delete Me" }, auth);
    await expect(PlanetApi.deleteApiPlanetsById(created.id, auth)).resolves.toBeUndefined();
    await expect(PlanetApi.getById(created.id, auth)).rejects.toMatchObject({ serverMessage: "Planet not found" });

    const otherUser = await testContext.createTestUser({ id: "delete-user" });
    await expect(
      PlanetApi.deleteApiPlanetsById(testContext.seedIds.planets.planet1, testContext.authConfig(otherUser.id)),
    ).rejects.toMatchObject({ serverMessage: "You can only delete your own planets" });
    await expect(PlanetApi.deleteApiPlanetsById("missing-planet", auth)).rejects.toMatchObject({
      serverMessage: "Planet not found",
    });
  });
});
