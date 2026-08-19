import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import type { PlanetModels } from "@/api/planet/planet.models";
import { PlanetQueries } from "@/api/planet/planet.queries";
import { Button, Text } from "@povio/rn-ui";
import { PageHeader } from "@/modules/tiny/components/PageHeader";
import { PlanetCard } from "@/modules/planets/components/PlanetCard";
import { Screen } from "@/modules/tiny/components/Screen";
import { StateView } from "@/modules/tiny/components/StateView";

export default function PlanetsFeedPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const { data, isLoading } = PlanetQueries.usePaginate({
    page: 1,
    cursor: undefined,
    limit: 20,
    order: "-discoveryDate",
  });
  const like = PlanetQueries.useLike({
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: PlanetQueries.keys.all });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : "Unable to like planet");
    },
  });
  const unlike = PlanetQueries.useUnlike({
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: PlanetQueries.keys.all });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : "Unable to unlike planet");
    },
  });

  const planets = useMemo(() => data?.items ?? [], [data]);

  const toggleLike = (planet: PlanetModels.PlanetsGetResponseDto) => {
    if (planet.likedByMe) {
      unlike.mutate({ id: planet.id });
    } else {
      like.mutate({ id: planet.id });
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Planets feed"
        description="Newest discoveries with the same like behavior as the web feed."
      />

      {isLoading ? (
        <StateView
          loading
          message="Loading feed..."
        />
      ) : null}

      {!isLoading && planets.length === 0 ? <StateView message="No feed items yet." /> : null}

      {error ? (
        <Text
          variant="body-3-default"
          color="informational-error"
        >
          {error}
        </Text>
      ) : null}

      {planets.map((planet) => {
        const isPending =
          (like.isPending && like.variables?.id === planet.id) ||
          (unlike.isPending && unlike.variables?.id === planet.id);

        return (
          <PlanetCard
            key={planet.id}
            planet={planet}
            isPressable={false}
            footer={
              <Button
                label={planet.likedByMe ? `Liked (${planet.likesCount})` : `Like (${planet.likesCount})`}
                variant={planet.likedByMe ? "primary" : "outlined"}
                loading={isPending}
                disabled={isPending}
                onPress={() => toggleLike(planet)}
              />
            }
          />
        );
      })}
    </Screen>
  );
}
