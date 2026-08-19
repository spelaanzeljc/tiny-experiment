import { Table } from "@povio/ui";
import type { TableWrapperProps } from "@povio/ui";
import { useTranslation } from "react-i18next";

import type { PlanetModels } from "@/openapi/planet/planet.models";

import { getPlanetsTableColumns } from "./planetsTableColumns";

type PlanetTableItem = PlanetModels.PlanetsGetResponseDto;
interface PlanetsTableProps extends TableWrapperProps<PlanetTableItem> {
  onEdit: (planet: PlanetTableItem) => void;
}

export function PlanetsTable({ className, onEdit, onRowClick, showCellBorder = false, ...props }: PlanetsTableProps) {
  const { t } = useTranslation();

  const columns = getPlanetsTableColumns(t, onEdit);

  return (
    <div className="-mx-4 overflow-x-auto">
      <Table
        {...props}
        className={className}
        columns={columns}
        onRowClick={onRowClick}
        showCellBorder={showCellBorder}
      />
    </div>
  );
}
