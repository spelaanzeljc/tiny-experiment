import { IDS } from "~/db/seed/ids";
import type { Alien } from "~/db/tables/alien/alien.schema";

const seedAliens = [
  "Andromedan",
  "Arcturian",
  "Betelgeusian",
  "Centaurian",
  "Denebian",
  "Eridanian",
  "Fomalhautian",
  "Ganymedean",
  "Hydran",
  "Lyran",
  "Orionid",
  "Vegan",
] satisfies string[];

export function createAlienSeed(createdAt: string): Alien[] {
  const t = createdAt;

  return seedAliens.map((name, index) => ({
    id: IDS.aliens[`alien${index + 1}` as keyof typeof IDS.aliens],
    name,
    createdAt: t,
    updatedAt: t,
  }));
}
