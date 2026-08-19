import { AuthContext } from "@povio/openapi-codegen-cli";

import type { UserModels } from "@/openapi/user/user.models";

export const useAuth = () => AuthContext.useAuth<UserModels.UserMeResponse>();
