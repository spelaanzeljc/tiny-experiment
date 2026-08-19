import { Link } from "expo-router";

import { PlanetQueries } from "@/api/planet/planet.queries";
import { Button, Text } from "@povio/rn-ui";
import { PageHeader } from "@/modules/tiny/components/PageHeader";
import { PlanetCard } from "@/modules/planets/components/PlanetCard";
import { Screen } from "@/modules/tiny/components/Screen";
import { StateView } from "@/modules/tiny/components/StateView";

export default function PlanetsPage() {
  const { data, isLoading, refetch, isRefetching } = PlanetQueries.usePaginate({
    page: 1,
    cursor: undefined,
    limit: 20,
    order: "-discoveryDate",
  });

  const planets = data?.items ?? [];

  return (
    <Screen>
      <PageHeader
        title="Planets"
        description="Browse the same planet collection available on the web app."
        action={
          <Link
            href="/create"
            asChild
          >
            <Button
              label="Add"
              size="small"
            />
          </Link>
        }
      />

      {isLoading ? (
        <StateView
          loading
          message="Loading planets..."
        />
      ) : null}

      {!isLoading && planets.length === 0 ? <StateView message="No planets found." /> : null}

      {planets.map((planet) => (
        <PlanetCard
          key={planet.id}
          planet={planet}
        />
      ))}

      {!isLoading && planets.length > 0 ? (
        <Button
          label={isRefetching ? "Refreshing..." : "Refresh"}
          variant="outlined"
          disabled={isRefetching}
          loading={isRefetching}
          onPress={() => void refetch()}
        />
      ) : null}

      <Text
        variant="label-3-default"
        color="text-default-secondary"
      >
        Showing {planets.length} of {data?.totalItems ?? planets.length}
      </Text>
    </Screen>
  );
}
