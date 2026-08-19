import type { ReactNode } from "react";
import { router } from "expo-router";

import type { PlanetModels } from "@/api/planet/planet.models";
import { Box, Image, Pressable, Text } from "@povio/rn-ui";

import { Card } from "@/modules/tiny/components/Card";
import { formatDate } from "../utils/date";
import { getFallbackImageUrl } from "../utils/image";

interface PlanetCardProps {
  planet: PlanetModels.PlanetsGetResponseDto;
  footer?: ReactNode;
  isPressable?: boolean;
}

export function PlanetCard({ planet, footer, isPressable = true }: PlanetCardProps) {
  const content = (
    <Card>
      <Image
        width="100%"
        height={176}
        borderRadius="s"
        source={planet.image?.url ?? getFallbackImageUrl(planet.id)}
        contentFit="cover"
      />
      <Box gap="1">
        <Text
          variant="title-3-prominent-1"
          color="text-default-primary"
        >
          {planet.name}
        </Text>
        <Text
          variant="label-2-default"
          color="text-default-secondary"
        >
          {planet.discoveryDate ? `Discovered ${formatDate(planet.discoveryDate)}` : "Discovery date not set"}
        </Text>
      </Box>
      {planet.description ? (
        <Text
          variant="body-3-default"
          color="text-default-secondary"
          numberOfLines={3}
        >
          {planet.description}
        </Text>
      ) : null}
      <Box
        flexDirection="row"
        gap="2"
        flexWrap="wrap"
      >
        <Text
          variant="label-2-default"
          color="text-default-secondary"
        >
          Alien: {planet.alienName ?? "None"}
        </Text>
        <Text
          variant="label-2-default"
          color="text-default-secondary"
        >
          Likes: {planet.likesCount}
        </Text>
      </Box>
      {footer}
    </Card>
  );

  if (!isPressable) {
    return content;
  }

  return <Pressable onPress={() => router.push(`/planets/${planet.id}` as any)}>{content}</Pressable>;
}
