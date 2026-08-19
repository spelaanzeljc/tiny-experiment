import { createTableRepository } from "~/db/repository";
import { pushNotificationTokenTable } from "./pushNotificationToken.schema";
export const pushNotificationTokenRepository = createTableRepository(pushNotificationTokenTable);
