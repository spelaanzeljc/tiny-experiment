import { AuthContext } from "@povio/openapi-codegen-cli";
import { useQueryClient } from "@tanstack/react-query";
import { type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";

import { authTokenStore } from "@/clients/auth-token-store";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { UserApi } from "@/openapi/user/user.api";
import type { UserModels } from "@/openapi/user/user.models";
import { UserQueries } from "@/openapi/user/user.queries";

const routes: AuthContext.Routes = {
  authenticated: "/",
  unauthenticated: "/login",
};

export const JWTProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();

  const previousAccessToken = useRef<string | null>(null);
  const accessToken = useSyncExternalStore(
    authTokenStore.subscribe,
    authTokenStore.getAccessToken,
    authTokenStore.getServerSnapshot,
  );

  const authenticated = !!accessToken;
  const isInitializing = false;

  const { data: user } = UserQueries.useGet({
    enabled: authenticated,
    staleTime: 10 * 60 * 1000,
  });

  const onAccessTokenChange = useCallback((token: string | null) => {
    authTokenStore.setAccessToken(token);
  }, []);

  const onRefreshTokenChange = useCallback((token: string | null) => {
    authTokenStore.setRefreshToken(token);
  }, []);

  const logout = useCallback(() => {
    authTokenStore.clear();
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    if (previousAccessToken.current && !accessToken) {
      queryClient.clear();
    }

    previousAccessToken.current = accessToken;
  }, [accessToken, queryClient]);

  const userPromise = useCallback(async () => {
    try {
      const user = await UserApi.get();
      queryClient.setQueryData<UserModels.UserMeResponse>(UserQueries.keys.get(), user);
      return user;
    } catch {
      logout();
      return null;
    }
  }, [logout, queryClient]);

  const updateTokens = useCallback(
    (accessToken: string | null, refreshToken?: string | null) => {
      if (accessToken !== null) {
        onAccessTokenChange(accessToken);
      }
      if (refreshToken !== null && refreshToken !== undefined) {
        onRefreshTokenChange(refreshToken);
      }
    },
    [onAccessTokenChange, onRefreshTokenChange],
  );

  const loadingState = useMemo(() => <LoadingState />, []);

  return (
    <AuthContext.Provider
      isAuthenticated={authenticated}
      isInitializing={isInitializing}
      logout={logout}
      updateTokens={updateTokens}
      accessToken={accessToken}
      user={user}
      userPromise={userPromise}
      routes={routes}
      loadingState={loadingState}
    >
      {children}
    </AuthContext.Provider>
  );
};
