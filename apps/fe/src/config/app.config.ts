const authCustomJWT = {
  enableMagicLink: import.meta.env.VITE_PUBLIC_AUTH_CUSTOM_JWT_ENABLE_MAGIC_LINK === "true",
};

const apiUrl = import.meta.env.VITE_PUBLIC_API_URL ?? "http://localhost:4000";
const apiOrigin = apiUrl.replace(/\/+$/, "") || "/";
const apiMode = import.meta.env.VITE_PUBLIC_API_MODE ?? "fake";
export const AppConfig = {
  isProduction: import.meta.env.NODE_ENV === "production",
  enableWebVitals: import.meta.env.VITE_PUBLIC_ENABLE_WEB_VITALS === "true",
  release: import.meta.env.VITE_PUBLIC_RELEASE,
  stage: import.meta.env.VITE_PUBLIC_STAGE,
  api: {
    url: apiOrigin,
    mode: apiMode,
    useFakeBackend: apiMode === "fake",
  },
  log: {
    level: import.meta.env.VITE_PUBLIC_LOG_LEVEL ?? "error",
  },
  sentry: {
    enabled: import.meta.env.VITE_PUBLIC_SENTRY_DSN ? true : false,
    dsn: import.meta.env.VITE_PUBLIC_SENTRY_DSN,
    environment: import.meta.env.VITE_PUBLIC_SENTRY_ENVIRONMENT,
    tracesSampleRate: parseFloat(import.meta.env.VITE_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0"),
    replaysSessionSampleRate: parseFloat(import.meta.env.VITE_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? "0"),
    replaysOnErrorSampleRate: parseFloat(import.meta.env.VITE_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? "0"),
  },
  auth: {
    customJWT: authCustomJWT,
    googleRedirectUrl: `${apiOrigin}/api/user/auth/google`,
  },
  googleAnalytics: {
    measurementId: import.meta.env.VITE_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID,
  },
};
