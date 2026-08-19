import type { ExpoConfig } from "expo/config";

import { applyTinySpaEnv } from "./config/tiny-env.cjs";

applyTinySpaEnv();

const config = {
  name: "react-native-template",
  slug: "react-native-template",
  scheme: "react-native-template",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "", // add iOS bundle identifier
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
    package: "", // add Android package name
  },
  extra: {
    eas: {
      projectId: "", // run `eas init` and paste the project ID here
    },
  },
  experiments: {
    tsconfigPaths: true,
    reactCompiler: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-font",
    "@sentry/react-native/expo",
    "expo-router",
    "expo-secure-store",
    // If you are using EAS Build, you can set the environment variable by creating a secret named SENTRY_AUTH_TOKEN.
    // {
    //   organization: process.env.SENTRY_ORG,
    //   project: process.env.SENTRY_PROJECT,
    // },
  ],
} as ExpoConfig;

export default config;
