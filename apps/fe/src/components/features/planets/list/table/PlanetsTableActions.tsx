import { Confirmation, InlineIconButton, useToast } from "@povio/ui";
import { Pencil, Trash } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { TableActions } from "@/components/shared/ui/TableActions";
import type { PlanetModels } from "@/openapi/planet/planet.models";
import { PlanetQueries } from "@/openapi/planet/planet.queries";

interface PlanetsTableActionsProps {
  onEdit: (planet: PlanetModels.PlanetsGetResponseDto) => void;
  planet: PlanetModels.PlanetsGetResponseDto;
}

export function PlanetsTableActions({ onEdit, planet }: PlanetsTableActionsProps) {
  const { t } = useTranslation();

  const { successToast, errorToast } = useToast();
  const { confirm } = Confirmation.useConfirmation();

  const deletePlanet = PlanetQueries.useDeleteApiPlanetsById();

  const handleRemove = useCallback(async () => {
    // Row actions should stop propagation in TableActions so the row click does not also open details.
    const confirmed = await confirm({
      heading: t(($) => $.planets.removeConfirm.heading),
      description: t(($) => $.planets.removeConfirm.description, { name: planet.name }),
      confirmLabel: t(($) => $.planets.removeConfirm.confirm),
      cancelLabel: t(($) => $.planets.removeConfirm.cancel),
      confirmColor: "error",
      cancelVariant: "subtle",
      textAlign: "center",
      buttonSize: "s",
    });

    if (!confirmed) {
      return;
    }

    try {
      await deletePlanet.mutateAsync({ id: planet.id });
      successToast({ text: t(($) => $.planets.removeConfirm.success) });
    } catch {
      errorToast({ text: t(($) => $.planets.removeConfirm.error) });
    }
  }, [confirm, deletePlanet, errorToast, planet, successToast, t]);

  return (
    <TableActions>
      <InlineIconButton
        label={t(($) => $.planets.actions.edit)}
        icon={Pencil}
        color="secondary"
        onPress={() => onEdit(planet)}
      />
      <InlineIconButton
        label={t(($) => $.planets.actions.remove)}
        icon={Trash}
        color="error"
        onPress={handleRemove}
      />
    </TableActions>
  );
}
