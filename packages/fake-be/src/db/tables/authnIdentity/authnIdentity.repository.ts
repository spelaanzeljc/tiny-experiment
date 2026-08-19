import { createTableRepository } from "~/db/repository";
import { authnIdentityTable } from "./authnIdentity.schema";
export const authnIdentityRepository = createTableRepository(authnIdentityTable);
