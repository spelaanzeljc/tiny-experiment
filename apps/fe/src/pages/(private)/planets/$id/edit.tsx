import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PlanetEditPage } from "@/components/features/planets/details/PlanetEditPage";
import { AppHead } from "@/components/shared/head/AppHead";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import { useAuth } from "@/hooks/useAuth";
import { PlanetQueries } from "@/openapi/planet/planet.queries";

function PlanetEditRoutePage() {
  const { id } = Route.useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  // Reuse the read endpoint for edit screens so the form is initialized from the same model as details.
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

  if (user?.id !== planet.userId) {
    // Keep unauthorized users on the read page; the API still enforces ownership on write operations.
    return (
      <Navigate
        to="/planets/$id"
        params={{ id: planet.id }}
      />
    );
  }

  return (
    <>
      <AppHead
        title={t(($) => $.planets.edit.title)}
        description={planet.description ?? undefined}
      />
      <PlanetEditPage planet={planet} />
    </>
  );
}

export const Route = createFileRoute("/(private)/planets/$id/edit")({
  component: PlanetEditRoutePage,
});
