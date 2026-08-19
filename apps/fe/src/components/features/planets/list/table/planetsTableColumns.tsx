import { dynamicColumns } from "@povio/ui";
import type { TFunction } from "i18next";
import { z } from "zod";

import { PlanetModels } from "@/openapi/planet/planet.models";
import { DateUtils } from "@/utils/date.utils";

import { PlanetsTableActions } from "./PlanetsTableActions";

const PLANET_SORTABLE_COLUMN_SCHEMA = z.enum(["name", "discoveryDate"]);

export function getPlanetsTableColumns(t: TFunction, onEdit: (planet: PlanetModels.PlanetsGetResponseDto) => void) {
  return dynamicColumns({
    schema: PlanetModels.PlanetsGetResponseDtoSchema,
    options: {
      // dynamicColumns keeps table columns aligned with generated OpenAPI models and sortable enum metadata.
      columns: {
        name: {
          header: t(($) => $.planets.table.name),
          meta: { filterKey: "search" },
          size: 224,
          minSize: 180,
          maxSize: 320,
        },
        description: {
          header: t(($) => $.planets.table.description),
          size: 360,
          minSize: 280,
        },
        alienName: {
          header: t(($) => $.planets.table.alien),
          meta: { filterKey: "alienId" },
          size: 192,
          minSize: 160,
          maxSize: 260,
        },
        discoveryDate: {
          header: t(($) => $.planets.table.discoveryDate),
          size: 176,
          minSize: 140,
          maxSize: 220,
          cell: ({ value }) => (value ? DateUtils.formatDate(value) : null),
        },
        creatorName: {
          header: t(($) => $.planets.table.creator),
          size: 160,
          minSize: 128,
          maxSize: 220,
        },
      },
      sortable: PLANET_SORTABLE_COLUMN_SCHEMA,
      customColumns: {
        // Keep per-row actions as a custom column so generated data columns stay declarative.
        actions: {
          header: t(($) => $.planets.table.actions),
          meta: { filterKey: "clear", headerClass: "[&>*]:ml-auto" },
          size: 112,
          minSize: 96,
          maxSize: 140,
          cell: ({ row }) => (
            <PlanetsTableActions
              planet={row.original}
              onEdit={onEdit}
            />
          ),
        },
      },
      order: ["name", "description", "alienName", "discoveryDate", "creatorName", "actions"],
      emptyValue: "-",
    },
  });
}
