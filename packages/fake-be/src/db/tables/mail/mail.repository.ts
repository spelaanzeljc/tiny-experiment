import { createTableRepository } from "~/db/repository";
import { mailTable } from "~/db/tables/mail/mail.schema";

export const mailRepository = createTableRepository(mailTable);
