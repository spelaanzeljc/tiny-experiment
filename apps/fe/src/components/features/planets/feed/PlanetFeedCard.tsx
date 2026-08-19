import { Button, Link, Typography } from "@povio/ui";
import { Heart, Satellite, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { PlanetModels } from "@/openapi/planet/planet.models";
import { DateUtils } from "@/utils/date.utils";
import { getFallbackImageUrl } from "@/utils/image-fallback";

type PlanetFeedItem = PlanetModels.PlanetsGetResponseDto;

interface PlanetFeedCardProps {
  planet: PlanetFeedItem;
  isLikePending: boolean;
  onToggleLike: (planet: PlanetFeedItem) => void;
}

export function PlanetFeedCard({ planet, isLikePending, onToggleLike }: PlanetFeedCardProps) {
  const { t } = useTranslation();
  const imageSrc = planet.image?.url ?? getFallbackImageUrl({ width: 960, height: 540 });
  const discoveryDate = planet.discoveryDate ? DateUtils.formatDate(planet.discoveryDate) : null;
  const alienName = planet.alienName ?? t(($) => $.planetsFeed.card.noAlien);
  const isLiked = planet.likedByMe;
  const likesCount = typeof planet.likesCount === "number" ? planet.likesCount : 0;

  return (
    <article className="overflow-hidden rounded-m border border-elevation-outline-default-1 bg-elevation-fill-default-1 shadow-sm">
      <Link
        to="/planets/$id"
        params={{ id: planet.id }}
        className="block no-underline! outline-none focus-visible:ring-2 focus-visible:ring-interactive-outline-primary-idle"
      >
        <div className="aspect-video w-full bg-elevation-fill-default-2">
          <img
            src={imageSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Typography
              as="h2"
              size="title-4"
              variant="prominent-1"
              className="text-text-default-1"
            >
              {planet.name}
            </Typography>
            {discoveryDate ? (
              <Typography
                size="label-3"
                className="mt-1 text-text-default-2"
              >
                {t(($) => $.planetsFeed.card.discovered, { date: discoveryDate })}
              </Typography>
            ) : null}
          </div>

          <Button
            variant={isLiked ? "contained" : "outlined"}
            color={isLiked ? "primary" : "secondary"}
            size="s"
            icon={Heart}
            isLoading={isLikePending}
            onPress={() => onToggleLike(planet)}
          >
            {isLiked
              ? t(($) => $.planetsFeed.card.liked, { count: likesCount })
              : t(($) => $.planetsFeed.card.like, { count: likesCount })}
          </Button>
        </div>

        {planet.description ? (
          <Typography
            size="body-3"
            className="text-text-default-2"
          >
            {planet.description}
          </Typography>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex min-w-0 items-center gap-3 rounded-s bg-elevation-fill-default-2 px-3 py-2">
            <Satellite
              className="size-5 shrink-0 text-text-default-2"
              aria-hidden
            />
            <div className="min-w-0">
              <Typography
                size="label-3"
                className="text-text-default-2"
              >
                {t(($) => $.planetsFeed.card.alienLabel)}
              </Typography>
              <Typography
                size="body-3"
                className="truncate text-text-default-1"
              >
                {alienName}
              </Typography>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-s bg-elevation-fill-default-2 px-3 py-2">
            <UserRound
              className="size-5 shrink-0 text-text-default-2"
              aria-hidden
            />
            <div className="min-w-0">
              <Typography
                size="label-3"
                className="text-text-default-2"
              >
                {t(($) => $.planetsFeed.card.creatorLabel)}
              </Typography>
              <Typography
                size="body-3"
                className="truncate text-text-default-1"
              >
                {planet.creatorName ?? t(($) => $.planets.card.unknownCreator)}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
