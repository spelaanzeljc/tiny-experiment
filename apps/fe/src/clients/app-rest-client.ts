import { RestClient } from "@povio/openapi-codegen-cli";

import { createORPCAxiosAdapter } from "@/clients/orpc-axios-adapter";
import { AuthorizationHeaderInterceptor } from "@/clients/rest/interceptors/authorization-header.interceptor";
import { RefreshTokenInterceptor } from "@/clients/rest/interceptors/refresh-token.interceptor";
import { ResponseInterceptor } from "@/clients/rest/interceptors/response.interceptor";
import { AppConfig } from "@/config/app.config";
import { AppErrorHandler } from "@/clients/rest/app-error-handler";
import { installFakeBackendBrowserFeatures } from "~/browser";

if (AppConfig.api.useFakeBackend) {
  installFakeBackendBrowserFeatures();
}

export const AppRestClient = new RestClient({
  config: {
    baseURL: AppConfig.api.url,
    ...(AppConfig.api.useFakeBackend ? { adapter: createORPCAxiosAdapter() } : {}),
  },
  errorHandler: AppErrorHandler,
  interceptors: [AuthorizationHeaderInterceptor, RefreshTokenInterceptor, ResponseInterceptor],
});
