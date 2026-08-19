import { RestInterceptor } from "@povio/openapi-codegen-cli";

import { AuthErrorCodes } from "@/clients/rest/app-error-handler";
import { UserAuthApi } from "@/openapi/userAuth/userAuth.api";
import { authTokenStore } from "@/clients/auth-token-store";

export const RefreshTokenInterceptor = new RestInterceptor((client) => {
  return client.interceptors.response.use(
    (response) => response,
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.data?.code === AuthErrorCodes.InvalidCredentials) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const refreshToken = authTokenStore.getRefreshToken();
          const { accessToken, refreshToken: newRefreshToken } = await UserAuthApi.accessToken({
            refreshToken: refreshToken || "",
          });
          authTokenStore.setTokens(accessToken, newRefreshToken || null);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return client(originalRequest);
        } catch {
          authTokenStore.clear();
        }
      }
      return Promise.reject(error);
    },
  );
});
