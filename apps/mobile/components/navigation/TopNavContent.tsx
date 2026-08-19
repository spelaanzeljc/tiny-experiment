import { useTheme } from "@shopify/restyle";
import { Box, IconButton, Text, type IconButtonProps, type Theme } from "@povio/rn-ui";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";

const windowWidth = Dimensions.get("window").width;

export const CenterNavContent = ({
  routeName,
  actions,
}: {
  routeName: string;
  actions?: {
    icon: IconButtonProps["icon"];
    onPress: () => void;
  }[];
}) => {
  const theme = useTheme<Theme>();
  const router = useRouter();

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      padding="1-5"
      backgroundColor="elevation-background"
    >
      <Box
        flexDirection="row"
        alignItems="center"
        width={windowWidth / 3}
        p="1"
      >
        <IconButton
          variant="transparent"
          onPress={() => router.back()}
          icon={<ArrowLeftIcon color={theme.colors["interactive-icon-idle"]} />}
        />
      </Box>
      <Text
        variant="title-3-prominent-1"
        color="text-default-primary"
      >
        {routeName}
      </Text>
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-end"
        width={windowWidth / 3}
      >
        {actions?.map((action, index) => {
          const handleActionPress = action.onPress;

          return (
            <IconButton
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              variant="transparent"
              onPress={handleActionPress}
              icon={action.icon}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export const SideNavContent = ({
  routeName,
  actions,
}: {
  routeName: string;
  actions?: {
    icon: IconButtonProps["icon"];
    onPress: () => void;
  }[];
}) => {
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      padding="1-5"
      backgroundColor="elevation-background"
      style={{ paddingTop: top }}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        gap="3"
      >
        <Box
          flexDirection="row"
          alignItems="center"
          p="1"
        >
          <IconButton
            variant="transparent"
            onPress={() => router.back()}
            icon={<ArrowLeftIcon />}
          />
        </Box>
        <Text
          variant="title-3-prominent-1"
          color="text-default-primary"
        >
          {routeName}
        </Text>
      </Box>
      <Box
        flexDirection="row"
        alignItems="center"
      >
        {actions?.map((action, index) => {
          const handleActionPress = action.onPress;

          return (
            <IconButton
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              variant="transparent"
              onPress={handleActionPress}
              icon={action.icon}
            />
          );
        })}
      </Box>
    </Box>
  );
};
