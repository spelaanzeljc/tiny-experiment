import { Link } from "expo-router";

import { Box, Button, Text } from "@povio/rn-ui";
import { Card } from "@/modules/tiny/components/Card";
import { PageHeader } from "@/modules/tiny/components/PageHeader";
import { Screen } from "@/modules/tiny/components/Screen";

export default function Home() {
  return (
    <Screen>
      <PageHeader
        title="Home"
        description="Welcome to Tiny Template. Manage your profile, browse planets, and follow the discovery feed."
      />

      <Card>
        <Text
          variant="title-3-prominent-1"
          color="text-default-primary"
        >
          Planet collection
        </Text>
        <Text
          variant="body-3-default"
          color="text-default-secondary"
        >
          The mobile app now mirrors the web app structure with authenticated home, planets, feed, details, edit, and
          profile screens.
        </Text>
        <Box
          flexDirection="row"
          gap="2"
          flexWrap="wrap"
        >
          <Link
            href={"/planets" as any}
            asChild
          >
            <Button label="Open planets" />
          </Link>
          <Link
            href={"/feed" as any}
            asChild
          >
            <Button
              label="Open feed"
              variant="outlined"
            />
          </Link>
        </Box>
      </Card>
    </Screen>
  );
}
