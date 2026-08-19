import { ActivityIndicator } from "react-native";

import { Box, Text } from "@povio/rn-ui";

interface StateViewProps {
  message?: string;
  loading?: boolean;
}

export function StateView({ message = "Loading...", loading = false }: StateViewProps) {
  return (
    <Box
      flex={1}
      minHeight={160}
      alignItems="center"
      justifyContent="center"
      gap="3"
    >
      {loading ? <ActivityIndicator /> : null}
      <Text
        variant="body-3-default"
        color="text-default-secondary"
      >
        {message}
      </Text>
    </Box>
  );
}
