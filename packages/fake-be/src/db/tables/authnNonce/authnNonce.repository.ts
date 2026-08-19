import { createTableRepository } from "~/db/repository";
import { authnNonceTable } from "~/db/tables/authnNonce/authnNonce.schema";

export const authnNonceRepository = createTableRepository(authnNonceTable);
