import { Link, router, useLocalSearchParams } from "expo-router";

import { PlanetQueries } from "@/api/planet/planet.queries";
import { Box, Button, Image, Text } from "@povio/rn-ui";
import { Card } from "@/modules/tiny/components/Card";
import { PageHeader } from "@/modules/tiny/components/PageHeader";
import { Screen } from "@/modules/tiny/components/Screen";
import { StateView } from "@/modules/tiny/components/StateView";
import { formatDate } from "@/modules/planets/utils/date";
import { getFallbackImageUrl } from "@/modules/planets/utils/image";

export default function PlanetDetailsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: planet, isLoading } = PlanetQueries.useGetById({ id }, { enabled: !!id });

  if (isLoading || !planet) {
    return (
      <Screen>
        <StateView
          loading={isLoading}
          message={isLoading ? "Loading planet..." : "Planet not found."}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <PageHeader
        title={planet.name}
        action={
          <Link
            href={`/planets/${planet.id}/edit` as any}
            asChild
          >
            <Button
              label="Edit"
              size="small"
            />
          </Link>
        }
      />

      <Card>
        <Image
          width="100%"
          height={220}
          borderRadius="s"
          source={planet.image?.url ?? getFallbackImageUrl(planet.id)}
          contentFit="cover"
        />
        {planet.description ? (
          <Text
            variant="body-2-default"
            color="text-default-secondary"
          >
            {planet.description}
          </Text>
        ) : null}

        <Box gap="2">
          <DetailRow
            label="Created by"
            value={planet.creatorName ?? "Unknown creator"}
          />
          <DetailRow
            label="Alien"
            value={planet.alienName ?? "None"}
          />
          <DetailRow
            label="Discovery date"
            value={formatDate(planet.discoveryDate)}
          />
          <DetailRow
            label="Created"
            value={formatDate(planet.createdAt)}
          />
          <DetailRow
            label="Updated"
            value={formatDate(planet.updatedAt)}
          />
          <DetailRow
            label="Likes"
            value={String(planet.likesCount)}
          />
        </Box>
      </Card>

      <Button
        label="Back to planets"
        variant="outlined"
        onPress={() => router.back()}
      />
    </Screen>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box gap="1">
      <Text
        variant="label-2-prominent-1"
        color="text-default-secondary"
      >
        {label}
      </Text>
      <Text
        variant="body-3-default"
        color="text-default-primary"
      >
        {value}
      </Text>
    </Box>
  );
}
