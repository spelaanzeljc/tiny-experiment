import { Typography, useSorting } from "@povio/ui";
import type { SortingState } from "@tanstack/react-table";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import type { PlanetModels } from "@/openapi/planet/planet.models";
import { PlanetQueries } from "@/openapi/planet/planet.queries";
import { StringUtils } from "@/utils/string.utils";

import { PlanetsTableInfinite } from "./table/PlanetsTableInfinite";
import { usePlanetTableFilters } from "./table/usePlanetTableFilters";
import { PlanetsTableSummary } from "./PlanetsTableSummary";

// Keep the first two pages tall enough for the intersection sentinel to leave and re-enter
// the viewport on larger collections. With 10-row pages it stayed visible after page two,
// so the observer never emitted another intersection and the loader remained indefinitely.
const PAGE_SIZE = 20;
const DEFAULT_SORTING: SortingState = [{ id: "discoveryDate", desc: true }];
const getPlanetRowId = (planet: PlanetModels.PlanetsGetResponseDto) => planet.id;

interface PlanetsInfiniteTablePageProps {
  onEdit: (planet: PlanetModels.PlanetsGetResponseDto) => void;
}

export function PlanetsInfiniteTablePage({ onEdit }: PlanetsInfiniteTablePageProps) {
  const { t } = useTranslation();

  const { apiFilters, filterControls } = usePlanetTableFilters();

  const { order, setSorting, sorting } = useSorting();
  const effectiveSorting = sorting.length > 0 ? sorting : DEFAULT_SORTING;
  const effectiveOrder = order || "-discoveryDate";

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    PlanetQueries.usePaginateInfinite({
      cursor: undefined,
      limit: PAGE_SIZE,
      filter: apiFilters,
      order: StringUtils.emptyToUndefined(effectiveOrder),
    });

  const planets = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const totalCount = data?.pages[0]?.totalItems ?? planets.length;
  const handleFetchNextPage = useCallback(() => void fetchNextPage(), [fetchNextPage]);

  return (
    <div className="flex flex-col gap-4 pb-12">
      {filterControls}

      {isLoading ? (
        <LoadingState />
      ) : (
        <PlanetsTableInfinite
          className="min-w-[920px]"
          items={planets}
          getRowId={getPlanetRowId}
          onRowClick={onEdit}
          onEdit={onEdit}
          setSorting={setSorting}
          sorting={effectiveSorting}
          hasNextPage={Boolean(hasNextPage)}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={handleFetchNextPage}
        />
      )}

      {!isLoading && planets.length === 0 && (
        <Typography size="body-3" className="text-text-default-2">
          {t(($) => $.planets.page.empty)}
        </Typography>
      )}

      {!isLoading ? (
        <PlanetsTableSummary displayedCount={planets.length} totalCount={totalCount} />
      ) : null}
    </div>
  );
}
