import { IconButton, Link, Typography } from "@povio/ui";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/useAuth";
import type { PlanetModels } from "@/openapi/planet/planet.models";
import { DateUtils } from "@/utils/date.utils";
import { getFallbackImageUrl } from "@/utils/image-fallback";

interface PlanetCardProps {
  planet: PlanetModels.PlanetsGetResponseDto;
}

export function PlanetCard({ planet }: PlanetCardProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const imageSrc = planet.image?.url ?? getFallbackImageUrl({ width: 400, height: 300 });
  const createdDate = DateUtils.formatDate(new Date(planet.createdAt));
  const creatorName = planet.creatorName ?? t(($) => $.planets.card.unknownCreator);
  // Match the details/edit pages: show owner-only edit affordances, but keep backend authorization authoritative.
  const canEdit = user?.id === planet.userId;

  return (
    <div className="relative overflow-hidden rounded-m border border-elevation-outline-default-1 bg-elevation-fill-default-1 shadow-sm transition-all hover:border-elevation-outline-default-2 hover:bg-elevation-fill-default-2">
      {canEdit && (
        <div className="absolute right-2 top-2 z-10">
          <IconButton
            size="xs"
            variant="subtle"
            label={t(($) => $.planets.actions.edit)}
            icon={Pencil}
            color="secondary"
            link={{ to: "/planets/$id/edit", params: { id: planet.id } }}
          />
        </div>
      )}

      <Link
        to="/planets/$id"
        params={{ id: planet.id }}
        className="flex flex-col no-underline! outline-none focus-visible:ring-2 focus-visible:ring-interactive-outline-primary-idle"
      >
        <div className="aspect-video w-full bg-elevation-fill-default-2">
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-2 p-4">
          <Typography
            size="title-5"
            variant="prominent-1"
            as="h3"
            className="min-w-0 flex-1 text-text-default-1"
          >
            {planet.name}
          </Typography>
          {planet.description && (
            <Typography
              size="body-3"
              className="line-clamp-2 w-full text-text-default-2"
            >
              {planet.description}
            </Typography>
          )}

          <Typography
            size="label-3"
            className="pt-2 text-text-default-2"
          >
            {t(($) => $.planets.card.createdBy, { name: creatorName, date: createdDate })}
          </Typography>

          {planet.alienName && (
            <Typography
              size="label-3"
              className="text-text-default-2"
            >
              {t(($) => $.planets.card.alien, { name: planet.alienName })}
            </Typography>
          )}
        </div>
      </Link>
    </div>
  );
}
