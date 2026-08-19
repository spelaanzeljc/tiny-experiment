import { init, wrap } from "@sentry/react-native";
import { Stack } from "expo-router";

import SplashScreenController from "@/modules/auth/components/SplashScreenController";
import { useAuthStore } from "@/modules/auth/stores/authStore";

import AppProviders from "../utils/providers/AppProviders";

init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: false,
});

const RootLayout = () => {
  return (
    <AppProviders>
      <SplashScreenController>
        <RootNavigator />
      </SplashScreenController>
    </AppProviders>
  );
};

function RootNavigator() {
  const token = useAuthStore((state) => state.token);
  return (
    <Stack screenOptions={{ headerShown: false, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="sign-up"
          options={{ title: "Sign Up", headerShown: true }}
        />
      </Stack.Protected>
    </Stack>
  );
}

export default wrap(RootLayout);
