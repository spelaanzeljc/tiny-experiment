import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PlanetsPage } from "@/components/features/planets/list/PlanetsPage";
import { AppHead } from "@/components/shared/head/AppHead";

function PageComponent() {
  const { t } = useTranslation();

  return (
    <>
      {/* Route files own document metadata and route data boundaries; feature components own the page UI. */}
      <AppHead
        title={t(($) => $.planets.page.headTitle)}
        description={t(($) => $.planets.page.headDescription)}
      />
      <PlanetsPage />
    </>
  );
}

export const Route = createFileRoute("/(private)/planets/")({
  component: PageComponent,
});
