import { Typography, useFilters } from "@povio/ui";
import { useTranslation } from "react-i18next";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { PlanetModels } from "@/openapi/planet/planet.models";
import { PlanetQueries } from "@/openapi/planet/planet.queries";

import { PlanetCard } from "./PlanetCard";
import { PlanetsFilters, type PlanetsFiltersValue } from "./PlanetsFilters";

export function PlanetsGridPage() {
  const { t } = useTranslation();
  const filters = useFilters<PlanetsFiltersValue>({}, "", PlanetModels.PlanetPaginateFilterParamSchema);

  const { data, isLoading } = PlanetQueries.usePaginate({
    page: 1,
    cursor: undefined,
    limit: 20,
    filter: filters.filterData,
    order: "-discoveryDate",
  });
  const planets = data?.items ?? [];

  return (
    <div className="flex flex-col gap-4">
      <PlanetsFilters filters={filters} />

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {planets.map((planet) => (
            <PlanetCard
              key={planet.id}
              planet={planet}
            />
          ))}
        </div>
      )}

      {!isLoading && planets.length === 0 && (
        <Typography
          size="body-3"
          className="text-text-default-2"
        >
          {t(($) => $.planets.page.empty)}
        </Typography>
      )}
    </div>
  );
}
