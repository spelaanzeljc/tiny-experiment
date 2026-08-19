import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PlanetsFeedPage } from "@/components/features/planets/feed/PlanetsFeedPage";
import { AppHead } from "@/components/shared/head/AppHead";

function PageComponent() {
  const { t } = useTranslation();

  return (
    <>
      <AppHead
        title={t(($) => $.planetsFeed.page.headTitle)}
        description={t(($) => $.planetsFeed.page.headDescription)}
      />
      <PlanetsFeedPage />
    </>
  );
}

export const Route = createFileRoute("/(private)/planets-feed")({
  component: PageComponent,
});
