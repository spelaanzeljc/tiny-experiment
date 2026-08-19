import { Button, DateRangePicker, QueryAutocomplete } from "@povio/ui/tanstack";
import type { FilterStore } from "@povio/ui/tanstack";
import { useTranslation } from "react-i18next";

import { AlienQueries } from "@/openapi/alien/alien.queries";
import type { PlanetModels } from "@/openapi/planet/planet.models";

import "./PlanetsFilters.css";

export type PlanetsFiltersValue = NonNullable<PlanetModels.PlanetPaginateFilterParam>;

interface PlanetsFiltersProps {
  filters: FilterStore<PlanetsFiltersValue>;
}

function getDateRangeValue(value: PlanetsFiltersValue["discoveryDate"]) {
  if (!value) {
    return null;
  }

  return {
    start: value.start ?? null,
    end: value.end ?? null,
  };
}

export function PlanetsFilters({ filters }: PlanetsFiltersProps) {
  const { t } = useTranslation();
  const handleClearAllFilters = () => filters.clearAllFilters();

  return (
    <div className="flex flex-wrap items-end gap-1 *:w-fit!">
      {/* QueryAutocomplete works well with lightweight label endpoints instead of loading full related records. */}
      <div className="planets-filters__control-without-label">
        <QueryAutocomplete
          value={filters.filterData.alienId ?? null}
          onChange={(alienId) => filters.setFilterValue({ alienId: alienId ? String(alienId) : undefined })}
          query={AlienQueries.useGetLabels}
          label={t(($) => $.planets.filters.alien)}
          placeholder={t(($) => $.planets.filters.alienPlaceholder)}
          isClearable
          as="filter"
          size="extra-small"
          variant="filled"
        />
      </div>

      <div className="planets-filters__control-without-label">
        <DateRangePicker
          value={getDateRangeValue(filters.filterData.discoveryDate)}
          onChange={(discoveryDate) => filters.setFilterValue({ discoveryDate: discoveryDate ?? undefined })}
          label={t(($) => $.planets.filters.discoveryDate)}
          placeholder={t(($) => $.planets.filters.discoveryDatePlaceholder)}
          isClearable
          // fullIso matches the backend z.iso.datetime schema and avoids local date parsing ambiguity.
          fullIso
          as="filter"
          size="extra-small"
          variant="filled"
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
}
