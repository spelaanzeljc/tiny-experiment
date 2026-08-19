// oxlint-disable-next-line import/no-namespace
import * as Sentry from "@sentry/react";

import { AppConfig } from "@/config/app.config";

export function initSentry() {
  Sentry.init({
    enabled: AppConfig.sentry.enabled,
    dsn: AppConfig.sentry.dsn,
    release: AppConfig.release,
    integrations: [
      ...(AppConfig.sentry.tracesSampleRate > 0 ? [] : []),
      ...(AppConfig.sentry.replaysOnErrorSampleRate > 0 ? [Sentry.replayIntegration()] : []),
    ],

    tracesSampleRate: AppConfig.sentry.tracesSampleRate,

    replaysSessionSampleRate: AppConfig.sentry.replaysSessionSampleRate,
    replaysOnErrorSampleRate: AppConfig.sentry.replaysOnErrorSampleRate,
  });
}
