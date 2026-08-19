import { Typography, useSorting } from "@povio/ui";
import type { SortingState } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import type { PlanetModels } from "@/openapi/planet/planet.models";
import { PlanetQueries } from "@/openapi/planet/planet.queries";
import { StringUtils } from "@/utils/string.utils";

import { PlanetsTable } from "./table/PlanetsTable";
import { usePlanetTableFilters } from "./table/usePlanetTableFilters";
import { PlanetsTableSummary } from "./PlanetsTableSummary";

interface PlanetsTablePageProps {
  onEdit: (planet: PlanetModels.PlanetsGetResponseDto) => void;
}

const DEFAULT_SORTING: SortingState = [{ id: "discoveryDate", desc: true }];
const EMPTY_PLANETS: PlanetModels.PlanetsGetResponseDto[] = [];
const getPlanetRowId = (planet: PlanetModels.PlanetsGetResponseDto) => planet.id;

export function PlanetsTablePage({ onEdit }: PlanetsTablePageProps) {
  const { t } = useTranslation();

  const { apiFilters, filterControls } = usePlanetTableFilters();

  const { order, setSorting, sorting } = useSorting();
  const effectiveSorting = sorting.length > 0 ? sorting : DEFAULT_SORTING;
  const effectiveOrder = order || "-discoveryDate";

  const { data, isLoading } = PlanetQueries.usePaginate({
    page: 1,
    cursor: undefined,
    limit: 20,
    filter: apiFilters,
    order: StringUtils.emptyToUndefined(effectiveOrder),
  });
  const planets = data?.items ?? EMPTY_PLANETS;

  return (
    <div className="flex flex-col gap-4 pb-12">
      {filterControls}

      {isLoading ? (
        <LoadingState />
      ) : (
        <PlanetsTable
          className="min-w-[920px]"
          items={planets}
          getRowId={getPlanetRowId}
          onRowClick={onEdit}
          onEdit={onEdit}
          setSorting={setSorting}
          sorting={effectiveSorting}
        />
      )}

      {!isLoading && planets.length === 0 && (
        <Typography size="body-3" className="text-text-default-2">
          {t(($) => $.planets.page.empty)}
        </Typography>
      )}

      {!isLoading ? (
        <PlanetsTableSummary
          displayedCount={planets.length}
          totalCount={data?.totalItems ?? planets.length}
        />
      ) : null}
    </div>
  );
}
