import { createTableRepository } from "~/db/repository";
import { activityTable } from "./activity.schema";
export const activityRepository = createTableRepository(activityTable);
