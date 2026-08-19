import { RestInterceptor } from "@povio/openapi-codegen-cli";

import { authTokenStore } from "@/clients/auth-token-store";

export const AuthorizationHeaderInterceptor = new RestInterceptor((client) => {
  return client.interceptors.request.use(async (config) => {
    const accessToken = authTokenStore.getAccessToken();
    if (accessToken != null) {
      // oxlint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });
});
