/* eslint-env node */
/* oxlint-disable import/no-nodejs-modules */
import path from "node:path";
import { getSentryExpoConfig } from "@sentry/react-native/metro";
import { applyTinySpaEnv } from "./config/tiny-env.cjs";

applyTinySpaEnv();

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

type SentryExpoMetroConfig = Record<string, unknown> & {
  resolver?: Record<string, unknown> & {
    extraNodeModules?: Record<string, string>;
    sourceExts?: readonly string[];
  };
  transformer?: Record<string, unknown>;
  server?: Record<string, unknown>;
};

const sentryExpoConfig = getSentryExpoConfig(projectRoot) as SentryExpoMetroConfig;
const sentryResolver = sentryExpoConfig.resolver;
const sentryTransformer = sentryExpoConfig.transformer;

const metroConfig = {
  ...sentryExpoConfig,
  watchFolders: [workspaceRoot],
  resolver: {
    ...sentryResolver,
    nodeModulesPaths: [path.resolve(projectRoot, "node_modules"), path.resolve(workspaceRoot, "node_modules")],
    extraNodeModules: {
      ...sentryResolver?.extraNodeModules,
      "~": path.resolve(workspaceRoot, "packages/fake-be/src"),
    },
    sourceExts: [...(sentryResolver?.sourceExts ?? []), "mjs"],
  },
  transformer: {
    ...(sentryTransformer as Record<string, unknown> | undefined),
    unstable_allowRequireContext: true,
  },
};

export default metroConfig;
