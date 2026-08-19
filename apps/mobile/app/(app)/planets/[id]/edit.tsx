import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { PlanetQueries } from "@/api/planet/planet.queries";
import { Box, Button, Text } from "@povio/rn-ui";
import { Card } from "@/modules/tiny/components/Card";
import { PageHeader } from "@/modules/tiny/components/PageHeader";
import { PlanetForm, type PlanetFormValue } from "@/modules/planets/components/PlanetForm";
import { Screen } from "@/modules/tiny/components/Screen";
import { StateView } from "@/modules/tiny/components/StateView";

export default function PlanetEditPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { data: planet, isLoading } = PlanetQueries.useGetById({ id }, { enabled: !!id });
  const updatePlanet = PlanetQueries.useUpdate();
  const deletePlanet = PlanetQueries.useDeleteApiPlanetsById();
  const [error, setError] = useState<string | null>(null);

  const invalidatePlanets = async () => {
    await queryClient.invalidateQueries({ queryKey: PlanetQueries.keys.all });
  };

  const handleSubmit = async (data: PlanetFormValue) => {
    if (!planet) {
      return;
    }

    setError(null);
    try {
      await updatePlanet.mutateAsync({ id: planet.id, data });
      await invalidatePlanets();
      router.replace(`/planets/${planet.id}` as any);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update planet");
    }
  };

  const handleDelete = () => {
    if (!planet) {
      return;
    }

    Alert.alert("Remove planet", `Remove ${planet.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          setError(null);
          try {
            await deletePlanet.mutateAsync({ id: planet.id });
            await invalidatePlanets();
            router.replace("/planets" as any);
          } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to remove planet");
          }
        },
      },
    ]);
  };

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
        title="Edit planet"
        description={planet.name}
      />
      <Card>
        {error ? (
          <Text
            variant="body-3-default"
            color="informational-error"
          >
            {error}
          </Text>
        ) : null}
        <PlanetForm
          initialValue={{
            name: planet.name,
            alienId: planet.alienId,
            discoveryDate: planet.discoveryDate,
            description: planet.description,
            image: planet.image ? { id: planet.image.id } : null,
          }}
          submitLabel="Save changes"
          isSubmitting={updatePlanet.isPending}
          onSubmit={handleSubmit}
        />
        <Box
          flexDirection="row"
          gap="2"
          flexWrap="wrap"
        >
          <Button
            label="Cancel"
            variant="outlined"
            onPress={() => router.back()}
          />
          <Button
            label="Remove"
            variant="secondary"
            loading={deletePlanet.isPending}
            disabled={deletePlanet.isPending}
            onPress={handleDelete}
          />
        </Box>
      </Card>
    </Screen>
  );
}
