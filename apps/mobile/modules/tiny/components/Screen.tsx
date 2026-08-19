import type { PropsWithChildren } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@povio/rn-ui";

interface ScreenProps extends PropsWithChildren {
  scroll?: boolean;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
}

export function Screen({ children, scroll = true, contentContainerStyle }: ScreenProps) {
  const content = (
    <Box
      flex={1}
      backgroundColor="elevation-background"
      px="4"
      py="4"
      gap="4"
    >
      {children}
    </Box>
  );

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={["top"]}
    >
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}
