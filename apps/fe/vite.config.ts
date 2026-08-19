import { applyEnv, resolveConfigSync, getNumber, getString } from "@povio/resolve-config";
import reactScan from "@povio/vite-plugin-react-scan";
import tailwindCSS from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig as defineViteConfig, mergeConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig as defineVitestConfig } from "vitest/config";
import { reactIconsSprite } from "react-icons-sprite/vite";
import { tinyOpenApiCodegen } from "@povio/openapi-codegen-cli/vite";
import openApiCodegenConfig from "./openapi-codegen.config";

import { tinyResourcesPlugin } from "./vite-plugin-tiny-resources";

const repoRoot = new URL("../..", import.meta.url).pathname;
const env = resolveConfigSync({ cwd: repoRoot, module: "spa", target: "resolved" }) as any;

applyEnv(env, "__");

const isInTestMode = process.env.VITEST === "true";
const iconsSpritePlugin = reactIconsSprite();
const iconsSpriteTransform = iconsSpritePlugin.transform;

if (typeof iconsSpriteTransform === "function") {
  iconsSpritePlugin.transform = function transformAppIcons(code, id, ...args) {
    if (id.includes("/node_modules/")) {
      return null;
    }

    return iconsSpriteTransform.call(this, code, id, ...args);
  };
}

// https://vitejs.dev/config/
const createViteConfig = (isDevServer: boolean) => ({
  plugins: [
    isDevServer && reactScan(),
    !isInTestMode &&
      tinyOpenApiCodegen(
        { ...openApiCodegenConfig },
        {
          apiMode: process.env.VITE_PUBLIC_API_MODE,
          cwd: "../../packages/fake-be",
          generateOpenApiSpecModule: {
            path: "../../scripts/tiny-openapi.ts",
            exportName: "generateTinyOpenApiSpec",
          },
          watchFolders: ["../../.config", "../../packages/fake-be/src"],
        },
      ),
    !isInTestMode && tinyResourcesPlugin(),
    !isInTestMode &&
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./src/pages",
      }),
    devtools({
      // The optional event bus binds a fixed port (42069) and crashes when another
      // local app already owns it. Query/Router devtools do not require this server.
      eventBusConfig: { enabled: false },
    }),
    iconsSpritePlugin,
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindCSS(),
    !isInTestMode && devtoolsJson(),
  ],
  server: {
    open: false,
    port: getNumber(env, "VITE_DEV_PORT"),
    strictPort: false,
    proxy: {
      "^/api(?:/|$)": {
        target: getString(env, "VITE_PUBLIC_API_URL"),
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    entries: ["src/**/*.{ts,tsx}"],
  },
  worker: {
    format: "es",
  },
  resolve: {
    alias: {
      "@": new URL("src", import.meta.url).pathname,
      "~": new URL("../../packages/fake-be/src", import.meta.url).pathname,
    },
    dedupe: ["react", "react-dom", "i18next", "react-i18next"],
    tsconfigPaths: true,
  },
});

// https://vitest.dev/config/
const vitestConfig = defineVitestConfig({
  test: {
    root: "./",
    include: ["src/**/*.test.{ts,tsx}"],
    watch: false,
    globals: true,
    reporters: ["default"],
  },
});

export default defineViteConfig(({ command }) =>
  mergeConfig(createViteConfig(command === "serve"), vitestConfig),
);
