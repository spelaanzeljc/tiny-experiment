import { createTableRepository } from "~/db/repository";
import { alienTable } from "~/db/tables/alien/alien.schema";

export const alienRepository = createTableRepository(alienTable);
