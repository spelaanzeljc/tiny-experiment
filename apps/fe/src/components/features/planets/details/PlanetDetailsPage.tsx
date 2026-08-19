import { Button, Typography } from "@povio/ui";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/shared/page/PageHeader";
import { Card } from "@/components/shared/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import type { PlanetModels } from "@/openapi/planet/planet.models";
import { DateUtils } from "@/utils/date.utils";
import { getFallbackImageUrl } from "@/utils/image-fallback";

interface PlanetDetailsPageProps {
  planet: PlanetModels.PlanetsGetResponseDto;
}

export function PlanetDetailsPage({ planet }: PlanetDetailsPageProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const imageSrc = planet.image?.url ?? getFallbackImageUrl({ width: 800, height: 450 });
  const createdDate = DateUtils.formatDate(new Date(planet.createdAt));
  const updatedDate = DateUtils.formatDate(new Date(planet.updatedAt));
  const discoveryDate = planet.discoveryDate ? DateUtils.formatDate(new Date(planet.discoveryDate)) : null;
  const creatorName = planet.creatorName ?? t(($) => $.planets.card.unknownCreator);
  // Frontend ownership checks are for UI affordances only; the router enforces ownership again on update/delete.
  const canEdit = user?.id === planet.userId;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        enableBack
        backProps={{ backLink: { to: "/planets" } }}
        title={planet.name}
        actions={
          canEdit && (
            <Button
              size="s"
              color="primary"
              icon={Pencil}
              link={{ to: "/planets/$id/edit", params: { id: planet.id } }}
            >
              {t(($) => $.planets.actions.edit)}
            </Button>
          )
        }
      />

      <Card className="max-w-3xl overflow-hidden p-0">
        <div className="aspect-video w-full bg-elevation-fill-default-2">
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-5 p-1">
          <Typography
            size="title-5"
            variant="prominent-1"
            as="h3"
          >
            {planet.name}
          </Typography>

          {planet.description && (
            <Typography
              size="body-3"
              as="p"
              className="whitespace-pre-wrap text-text-default-2"
            >
              {planet.description}
            </Typography>
          )}

          <dl className="flex flex-col gap-4 border-elevation-outline-default-1 border-t pt-4 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
            <div className="flex flex-col gap-1">
              <Typography
                size="label-3"
                className="text-text-default-2"
              >
                {t(($) => $.planets.detail.createdBy)}
              </Typography>
              <Typography
                size="body-3"
                className="text-text-default-1"
              >
                {creatorName}
              </Typography>
            </div>
            <div className="flex flex-col gap-1">
              <Typography
                size="label-3"
                className="text-text-default-2"
              >
                {t(($) => $.planets.detail.created)}
              </Typography>
              <Typography
                size="body-3"
                className="text-text-default-1"
              >
                {createdDate}
              </Typography>
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <Typography
                size="label-3"
                className="text-text-default-2"
              >
                {t(($) => $.planets.detail.updated)}
              </Typography>
              <Typography
                size="body-3"
                className="text-text-default-1"
              >
                {updatedDate}
              </Typography>
            </div>
            {discoveryDate && (
              <div className="flex flex-col gap-1 sm:col-span-2">
                <Typography
                  size="label-3"
                  className="text-text-default-2"
                >
                  {t(($) => $.planets.detail.discoveryDate)}
                </Typography>
                <Typography
                  size="body-3"
                  className="text-text-default-1"
                >
                  {discoveryDate}
                </Typography>
              </div>
            )}
          </dl>
        </div>
      </Card>
    </div>
  );
}
