import { createTableRepository } from "~/db/repository";
import { queueJobTable } from "./queueJob.schema";
export const queueJobRepository = createTableRepository(queueJobTable);
