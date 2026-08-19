import { AuthContext } from "@povio/openapi-codegen-cli";
import { type PropsWithChildren, useCallback } from "react";

import { useAuthStore } from "@/modules/auth/stores/authStore";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const { logout, restore, token, isLoading } = useAuthStore();

  const updateTokens = useCallback(
    (accessToken: string | null) => {
      restore(accessToken);
    },
    [restore],
  );

  return (
    <AuthContext.Provider
      user={null} // Add user fetching logic
      isAuthenticated={!!token}
      isInitializing={isLoading}
      logout={logout}
      updateTokens={updateTokens}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
