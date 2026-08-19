import { createTableRepository } from "~/db/repository";
import { planetLikeTable } from "~/db/tables/planet-like/planet-like.schema";

export const planetLikeRepository = createTableRepository(planetLikeTable);
