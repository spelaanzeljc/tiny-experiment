import { InfiniteTable } from "@povio/ui";
import type { InfiniteTableWrapperProps } from "@povio/ui";
import { useTranslation } from "react-i18next";

import type { PlanetModels } from "@/openapi/planet/planet.models";

import { getPlanetsTableColumns } from "./planetsTableColumns";

type PlanetInfiniteTableItem = PlanetModels.PlanetsGetResponseDto;
interface PlanetsTableInfiniteProps extends InfiniteTableWrapperProps<PlanetInfiniteTableItem> {
  onEdit: (planet: PlanetInfiniteTableItem) => void;
}

export function PlanetsTableInfinite({
  className,
  onEdit,
  onRowClick,
  showCellBorder = false,
  ...props
}: PlanetsTableInfiniteProps) {
  const { t } = useTranslation();

  const columns = getPlanetsTableColumns(t, onEdit);

  return (
    <div className="-mx-4 overflow-x-auto">
      <InfiniteTable
        {...props}
        className={className}
        columns={columns}
        onRowClick={onRowClick}
        showCellBorder={showCellBorder}
      />
    </div>
  );
}
