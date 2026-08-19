import { RestClient, RestInterceptor } from "@povio/openapi-codegen-cli";

import { tinyApiUrl, useTinyFakeBackend } from "@/constants/tiny";
import { useAuthStore } from "@/modules/auth/stores/authStore";

import { AppErrorHandler } from "./errorHandler";
import { createORPCAxiosAdapter } from "../orpcAxiosAdapter";

const RequestInterceptor = new RestInterceptor((client) => {
  return client.interceptors.request.use(async (config) => {
    const accessToken = useAuthStore.getState().token;
    if (accessToken != null) {
      // oxlint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
});

const ResponseInterceptor = new RestInterceptor((client) => {
  return client.interceptors.response.use((response) => {
    return response;
  });
});

export const AppRestClient = new RestClient({
  config: {
    baseURL: tinyApiUrl,
    ...(useTinyFakeBackend ? { adapter: createORPCAxiosAdapter() } : {}),
  },
  errorHandler: AppErrorHandler,
  interceptors: [RequestInterceptor, ResponseInterceptor],
});
