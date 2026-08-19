import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PlanetDetailsPage } from "@/components/features/planets/details/PlanetDetailsPage";
import { AppHead } from "@/components/shared/head/AppHead";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { PlanetQueries } from "@/openapi/planet/planet.queries";

function PlanetDetailRoutePage() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  // Detail routes fetch one generated API model and pass it down as plain props.
  const { data: planet, isLoading } = PlanetQueries.useGetById({ id }, { enabled: !!id });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!planet) {
    return (
      <>
        <AppHead title={t(($) => $.planets.page.headTitle)} />
        <p className="text-text-default-2">{t(($) => $.planets.detail.notFound)}</p>
      </>
    );
  }

  return (
    <>
      <AppHead
        title={planet.name}
        description={planet.description ?? undefined}
      />
      <PlanetDetailsPage planet={planet} />
    </>
  );
}

export const Route = createFileRoute("/(private)/planets/$id/")({
  component: PlanetDetailRoutePage,
});
