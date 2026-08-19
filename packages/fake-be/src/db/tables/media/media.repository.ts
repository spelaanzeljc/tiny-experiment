import { createTableRepository } from "~/db/repository";
import { mediaTable } from "~/db/tables/media/media.schema";

export const mediaRepository = createTableRepository(mediaTable);
