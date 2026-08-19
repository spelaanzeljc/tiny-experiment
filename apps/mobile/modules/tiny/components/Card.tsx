import type { PropsWithChildren } from "react";

import { Box } from "@povio/rn-ui";

export function Card({ children }: PropsWithChildren) {
  return (
    <Box
      backgroundColor="elevation-surface-1"
      borderColor="elevation-outline-1"
      borderWidth={1}
      borderRadius="sm"
      p="4"
      gap="3"
    >
      {children}
    </Box>
  );
}
