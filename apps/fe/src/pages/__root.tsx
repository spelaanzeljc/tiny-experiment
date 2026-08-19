import { OpenApiRouter } from "@povio/openapi-codegen-cli";
import { Confirmation, ToastContainer, UIConfig, UIOverrides, UIRouter } from "@povio/ui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { onCLS, onINP, onLCP } from "web-vitals";

import { NotFoundPage } from "@/components/404";
import GoogleAnalytics from "@/components/googleAnalytics/GoogleAnalytics";
import { DefaultAppHead } from "@/components/shared/head/DefaultAppHead";
import { FakeMailboxProvider } from "@/components/tiny/fake-mailbox/FakeMailboxProvider";
import { AppConfig } from "@/config/app.config";
import { initA11y } from "@/config/inits/a11y";
import { initLogger } from "@/config/inits/logger";
import { initSentry } from "@/config/inits/sentry";
import Providers from "@/providers";
import { AppErrorBoundary } from "@/providers/AppErrorBoundary";
import { OpenApiRuntimeProvider } from "@/providers/OpenApiRuntimeProvider";
import { Fonts } from "@/styles/fonts/fonts";
import { uiOverrides } from "@/styles/overrides/uiOverrides.override";

import "@/config/i18n";
initLogger();
initSentry();
initA11y();

const Root = () => {
  const { i18n } = useTranslation();

  const navigate = useNavigate();
  const searchString = useRouterState({
    select: (state) => state.location.searchStr,
  });

  const push = useCallback(
    async (to: string, params?: Record<string, unknown>) => {
      await navigate({ to, search: params });
      return true;
    },
    [navigate],
  );

  const replace = useCallback(
    async (to: string, params?: Record<string, unknown>) => {
      await navigate({ to, replace: true, search: params });
      return true;
    },
    [navigate],
  );

  useEffect(() => {
    const handler = (lng: string) => {
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("lang", lng);
      }
    };
    i18n.on("languageChanged", handler);
    return () => {
      i18n.off("languageChanged", handler);
    };
  }, [i18n]);

  if (AppConfig.enableWebVitals) {
    onCLS(console.log);
    onINP(console.log);
    onLCP(console.log);
  }

  return (
    <>
      <GoogleAnalytics />
      <AppErrorBoundary>
        <Providers
          providers={[
            // { provider: ThemeContext.ThemeContextProvider }, // Uncomment for dark theme support
            { provider: UIRouter.UIRouterProvider, props: { push, replace, searchString } },
            { provider: OpenApiRouter.Provider, props: { replace } },
            {
              provider: UIConfig.Provider,
              props: {
                config: {
                  input: {
                    size: "small",
                  },
                  tableCellText: {
                    size: "label-2",
                    variant: "default",
                  },
                  tableHeaderText: {
                    size: "label-2",
                    variant: "prominent-1",
                  },
                  tag: {
                    textSize: "label-3",
                  },
                },
              },
            },
            {
              provider: UIOverrides.Provider,
              props: {
                config: uiOverrides,
              },
            },
            { provider: OpenApiRuntimeProvider },
            { provider: Confirmation.Provider },
            { provider: FakeMailboxProvider },
          ]}
        >
          <Fonts />
          <DefaultAppHead />

          <RootLayout />

          <ToastContainer />
          <TanStackDevtools
            plugins={[
              {
                name: "TanStack Query",
                render: <ReactQueryDevtoolsPanel />,
                defaultOpen: true,
              },
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
                defaultOpen: false,
              },
            ]}
          />
        </Providers>
      </AppErrorBoundary>
    </>
  );
};

function RootLayout() {
  return (
    <main className="font-primary">
      <Outlet />
    </main>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#ffffff" },
      { title: "Tiny Template" },
      { name: "msapplication-TileColor", content: "#da532c" },
    ],
    links: [
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  component: Root,
  notFoundComponent: NotFoundPage,
});
