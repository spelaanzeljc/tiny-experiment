import { Button } from "@povio/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PlanetEditPage } from "@/components/features/planets/details/PlanetEditPage";
import { PageHeader } from "@/components/shared/page/PageHeader";
import type { PlanetModels } from "@/openapi/planet/planet.models";

import { PlanetCreateModal } from "./PlanetCreateModal";
import { PlanetsGridPage } from "./PlanetsGridPage";
import { PlanetsInfiniteTablePage } from "./PlanetsInfiniteTablePage";
import { PlanetsTablePage } from "./PlanetsTablePage";
import { type PlanetsView, PlanetsViewTabs } from "./PlanetsViewTabs";

export function PlanetsPage() {
  const { t } = useTranslation();
  const [view, setView] = useState<PlanetsView>("table");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlanet, setEditingPlanet] = useState<PlanetModels.PlanetsGetResponseDto>();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        actions={
          <Button
            color="primary"
            icon={Plus}
            size="xs"
            variant="contained"
            onPress={() => setIsCreateOpen(true)}
          >
            {t(($) => $.planets.page.addPlanet)}
          </Button>
        }
        title={t(($) => $.planets.page.title)}
      />

      <div className="flex w-full justify-between gap-1 border-elevation-outline-default-1 border-b pb-1-5">
        <PlanetsViewTabs
          value={view}
          onChange={setView}
        />
      </div>

      {view === "grid" && <PlanetsGridPage />}
      {view === "table" && <PlanetsTablePage onEdit={setEditingPlanet} />}
      {view === "infinite" && <PlanetsInfiniteTablePage onEdit={setEditingPlanet} />}

      <PlanetCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {editingPlanet ? (
        <PlanetEditPage
          planet={editingPlanet}
          onClose={() => setEditingPlanet(undefined)}
          onDeleted={() => setEditingPlanet(undefined)}
          onSaved={() => setEditingPlanet(undefined)}
        />
      ) : null}
    </div>
  );
}
