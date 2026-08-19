import { createTableRepository } from "~/db/repository";
import { userTable } from "~/db/tables/user/user.schema";

export const userRepository = createTableRepository(userTable);
