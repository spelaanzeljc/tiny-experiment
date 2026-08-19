import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";

import { PlanetQueries } from "@/api/planet/planet.queries";
import { Text } from "@povio/rn-ui";
import { Card } from "@/modules/tiny/components/Card";
import { PageHeader } from "@/modules/tiny/components/PageHeader";
import { PlanetForm, type PlanetFormValue } from "@/modules/planets/components/PlanetForm";
import { Screen } from "@/modules/tiny/components/Screen";

export default function PlanetCreatePage() {
  const queryClient = useQueryClient();
  const createPlanet = PlanetQueries.useCreate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PlanetFormValue) => {
    setError(null);
    try {
      await createPlanet.mutateAsync({ data });
      await queryClient.invalidateQueries({ queryKey: PlanetQueries.keys.all });
      router.replace("/planets" as any);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to create planet");
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Add planet"
        description="Create a planet with the same core fields as the web form."
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
          submitLabel="Create planet"
          isSubmitting={createPlanet.isPending}
          onSubmit={handleSubmit}
        />
      </Card>
    </Screen>
  );
}
