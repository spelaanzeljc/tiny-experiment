import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@povio/ui";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { PageHeader } from "@/components/shared/page/PageHeader";
import type { PlanetModels } from "@/openapi/planet/planet.models";
import { PlanetQueries } from "@/openapi/planet/planet.queries";

import { PlanetFeedCard } from "./PlanetFeedCard";

const PAGE_SIZE = 8;

type PlanetFeedItem = PlanetModels.PlanetsGetResponseDto;

export function PlanetsFeedPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = PlanetQueries.usePaginateInfinite({
    cursor: undefined,
    limit: PAGE_SIZE,
    order: "-discoveryDate",
  });

  const likeMutation = PlanetQueries.useLike({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PlanetQueries.keys.all });
    },
  });

  const unlikeMutation = PlanetQueries.useUnlike({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PlanetQueries.keys.all });
    },
  });

  const planets = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "360px 0px" },
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const toggleLike = useCallback(
    (planet: PlanetFeedItem) => {
      if (planet.likedByMe) {
        unlikeMutation.mutate({ id: planet.id });
      } else {
        likeMutation.mutate({ id: planet.id });
      }
    },
    [likeMutation.mutate, unlikeMutation.mutate],
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <PageHeader title={t(($) => $.planetsFeed.page.title)} />

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="flex flex-col gap-5">
          {planets.map((planet) => (
            <PlanetFeedCard
              key={planet.id}
              planet={planet}
              isLikePending={
                (likeMutation.isPending && likeMutation.variables?.id === planet.id) ||
                (unlikeMutation.isPending && unlikeMutation.variables?.id === planet.id)
              }
              onToggleLike={toggleLike}
            />
          ))}
        </div>
      )}

      {!isLoading && planets.length === 0 && (
        <Typography
          size="body-3"
          className="text-text-default-2"
        >
          {t(($) => $.planetsFeed.page.empty)}
        </Typography>
      )}

      <div
        ref={loaderRef}
        className="flex min-h-16 items-center justify-center"
      >
        {isFetchingNextPage && <LoadingState />}
        {!hasNextPage && planets.length > 0 && (
          <Typography
            size="label-3"
            className="text-text-default-2"
          >
            {t(($) => $.planetsFeed.page.end)}
          </Typography>
        )}
      </div>
    </div>
  );
}
