import type { ReactNode } from "react";

import { Box, Text } from "@povio/rn-ui";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Box
      gap="2"
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <Box
        flex={1}
        gap="1"
      >
        <Text
          variant="title-2-prominent-1"
          color="text-default-primary"
        >
          {title}
        </Text>
        {description ? (
          <Text
            variant="body-3-default"
            color="text-default-secondary"
          >
            {description}
          </Text>
        ) : null}
      </Box>
      {action ? <Box flexShrink={0}>{action}</Box> : null}
    </Box>
  );
}
