import { createTableRepository } from "~/db/repository";
import { planetTable } from "~/db/tables/planet/planet.schema";

export const planetRepository = createTableRepository(planetTable);
