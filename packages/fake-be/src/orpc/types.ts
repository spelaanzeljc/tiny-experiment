import type { User } from "~/db/tables/user/user.schema";

export interface AuthContextData {
  token: string;
  user: User;
}

export interface ORPCContext {
  request: Request;
}

export interface AuthenticatedORPCContext extends ORPCContext {
  auth: AuthContextData;
}
