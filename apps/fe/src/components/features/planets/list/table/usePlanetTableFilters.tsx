import { Button, DateRangePicker, QueryAutocomplete, TextInput, useFilters } from "@povio/ui/tanstack";
import { Search } from "lucide-react";
import { type Key, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { AlienQueries } from "@/openapi/alien/alien.queries";
import { PlanetModels } from "@/openapi/planet/planet.models";

import "../PlanetsFilters.css";

export type PlanetTableFilterValues = NonNullable<PlanetModels.PlanetPaginateFilterParam>;

export function usePlanetTableFilters() {
  const { t } = useTranslation();
  const { clearAllFilters, filterData, setFilterValue } = useFilters<PlanetTableFilterValues>(
    {},
    "",
    PlanetModels.PlanetPaginateFilterParamSchema,
  );
  const handleSearchChange = useCallback(
    (search: string) => setFilterValue({ search: search || undefined }),
    [setFilterValue],
  );
  const handleAlienChange = useCallback(
    (alienId: Key | null) => setFilterValue({ alienId: alienId ? String(alienId) : undefined }),
    [setFilterValue],
  );
  const handleDiscoveryDateChange = useCallback(
    (discoveryDate: PlanetTableFilterValues["discoveryDate"] | null) =>
      setFilterValue({ discoveryDate: discoveryDate ?? undefined }),
    [setFilterValue],
  );
  const handleClearAllFilters = useCallback(() => clearAllFilters(), [clearAllFilters]);

  const discoveryDateValue = filterData.discoveryDate
    ? {
        start: filterData.discoveryDate.start ?? null,
        end: filterData.discoveryDate.end ?? null,
      }
    : null;

  const filterControls = (
    <div className="flex flex-wrap items-end gap-1">
      <div className="min-w-48 flex-1">
        <TextInput
          value={filterData.search ?? ""}
          onChange={handleSearchChange}
          label={t(($) => $.planets.filters.search)}
          leadingIcon={Search}
          as="filter"
          size="extra-small"
          variant="filled"
          hideLabel
          isClearable
        />
      </div>
      <div className="planets-filters__control-without-label min-w-48 flex-1">
        <QueryAutocomplete
          key={filterData.alienId ?? "empty"}
          value={filterData.alienId ?? null}
          onChange={handleAlienChange}
          query={AlienQueries.useGetLabels}
          label={t(($) => $.planets.filters.alien)}
          as="filter"
          size="extra-small"
          variant="filled"
          isClearable
        />
      </div>
      <div className="planets-filters__control-without-label min-w-48 flex-1">
        <DateRangePicker
          value={discoveryDateValue}
          onChange={handleDiscoveryDateChange}
          label={t(($) => $.planets.filters.discoveryDate)}
          as="filter"
          size="extra-small"
          variant="filled"
          isClearable
          fullIso
        />
      </div>
      <Button
        variant="subtle"
        color="secondary"
        size="xs"
        onPress={handleClearAllFilters}
      >
        {t(($) => $.planets.filters.clearAll)}
      </Button>
    </div>
  );

  const apiFilters: PlanetModels.PlanetPaginateFilterParam = {
    search: filterData.search || undefined,
    alienId: filterData.alienId || undefined,
    discoveryDate: filterData.discoveryDate || undefined,
  };
  return {
    apiFilters,
    filterControls,
  };
}
