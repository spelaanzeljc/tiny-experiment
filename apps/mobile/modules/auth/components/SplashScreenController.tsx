import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { type PropsWithChildren, useEffect } from "react";

import { STORAGE_KEYS } from "@/constants/storage";
import { useSecureStorageState } from "@/hooks/useSecureStorageState";
import { useAuthStore } from "@/modules/auth/stores/authStore";

void SplashScreen.preventAutoHideAsync();

export default function SplashScreenController({ children }: PropsWithChildren) {
  const [{ isLoading, value: token }] = useSecureStorageState(STORAGE_KEYS.AUTH_TOKEN);
  const { restore } = useAuthStore();
  const [fontsLoaded, fontError] = useFonts({
    "Inter-SemiBold": require("../../../assets/fonts/Inter-SemiBold.otf"),
    "Inter-SemiBold-Italic": require("../../../assets/fonts/Inter-SemiBold-Italic.otf"),
    "Inter-Medium": require("../../../assets/fonts/Inter-Medium.otf"),
    "Inter-Medium-Italic": require("../../../assets/fonts/Inter-Medium-Italic.otf"),
    "Inter-Regular": require("../../../assets/fonts/Inter-Regular.otf"),
    "Inter-Regular-Italic": require("../../../assets/fonts/Inter-Regular-Italic.otf"),
    "Syne-Medium": require("../../../assets/fonts/Syne-Medium.ttf"),
    "Syne-SemiBold": require("../../../assets/fonts/Syne-SemiBold.ttf"),
  });

  useEffect(() => {
    if (isLoading || !token) {
      return;
    }
    restore(token);
  }, [isLoading, token]);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoading]);

  return <>{children}</>;
}
