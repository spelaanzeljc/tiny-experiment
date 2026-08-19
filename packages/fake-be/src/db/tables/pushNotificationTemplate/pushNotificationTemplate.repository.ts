import { createTableRepository } from "~/db/repository";
import { pushNotificationTemplateTable } from "./pushNotificationTemplate.schema";
export const pushNotificationTemplateRepository = createTableRepository(pushNotificationTemplateTable);
