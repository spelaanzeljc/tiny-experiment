import { IDS } from "~/db/seed/ids";
import type { Planet } from "~/db/tables/planet/planet.schema";

const seedPlanets = [
  ["Mercury", "Small rocky world closest to the system star"],
  ["Venus", "Dense atmosphere with extreme surface temperatures"],
  ["Earth", "Temperate ocean world with abundant life"],
  ["Mars", "Cold desert world with polar ice caps"],
  ["Jupiter", "Massive gas giant with a long-lived storm system"],
  ["Saturn", "Ringed gas giant with many icy moons"],
  ["Uranus", "Ice giant with a tilted rotation axis"],
  ["Neptune", "Distant ice giant with high-speed winds"],
  ["Kepler-22b", "Exoplanet candidate in a habitable-zone orbit"],
  ["Proxima Centauri b", "Nearby terrestrial exoplanet orbiting a red dwarf"],
  ["TRAPPIST-1e", "Compact-system rocky planet in a temperate orbit"],
  ["HD 209458 b", "Hot gas giant with an observed atmosphere"],
  ["Gliese 581g", "Candidate super-Earth in a nearby stellar system"],
  ["LHS 1140 b", "Dense rocky super-Earth in a habitable-zone orbit"],
  ["TOI-700 d", "Earth-size planet orbiting a small cool star"],
  ["K2-18 b", "Sub-Neptune with detected atmospheric molecules"],
  ["WASP-12b", "Ultra-hot gas giant closely orbiting its star"],
  ["55 Cancri e", "Super-Earth with a very short orbital period"],
  ["Kepler-452b", "Large terrestrial candidate orbiting a Sun-like star"],
  ["GJ 1214 b", "Sub-Neptune with a hazy atmosphere"],
  ["Ross 128 b", "Nearby temperate exoplanet around a quiet red dwarf"],
  ["Tau Ceti e", "Candidate planet in a nearby Sun-like system"],
  ["Wolf 1061 c", "Rocky candidate near the inner habitable zone"],
  ["Teegarden's Star b", "Temperate Earth-mass candidate around a red dwarf"],
  ["Kapteyn b", "Candidate super-Earth around an old nearby star"],
  ["Kepler-186f", "Earth-size planet in a cool star's habitable zone"],
  ["OGLE-2005-BLG-390Lb", "Cold distant world found by microlensing"],
  ["HAT-P-7b", "Hot Jupiter with unusual atmospheric circulation"],
  ["WASP-19b", "Hot Jupiter with a compact orbit"],
  ["CoRoT-7b", "Rocky exoplanet with extreme dayside heating"],
] satisfies [string, string][];

export function createPlanetSeed(createdAt: string): Planet[] {
  const t = createdAt;
  const alienKeys = Object.keys(IDS.aliens) as (keyof typeof IDS.aliens)[];

  // The seed intentionally covers filtering/sorting demos: 30 planets, rotating aliens, and discovery dates on half.
  return seedPlanets.map(([name, description], index) => ({
    id: IDS.planets[`planet${index + 1}` as keyof typeof IDS.planets],
    userId: IDS.users.demo,
    alienId: IDS.aliens[alienKeys[index % alienKeys.length]],
    discoveryDate: index % 2 === 0 ? `20${String(index + 1).padStart(2, "0")}-01-01T00:00:00.000Z` : null,
    name,
    description,
    imageId: null,
    createdAt: t,
    updatedAt: t,
  }));
}
