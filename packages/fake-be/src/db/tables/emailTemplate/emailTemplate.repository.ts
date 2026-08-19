import { createTableRepository } from "~/db/repository";
import { emailTemplateTable } from "./emailTemplate.schema";
export const emailTemplateRepository = createTableRepository(emailTemplateTable);
