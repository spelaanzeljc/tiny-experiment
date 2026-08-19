import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("../../apps/fe/src", import.meta.url).pathname,
      "~": new URL("./src", import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    include: ["src/**/*.test.ts"],
    setupFiles: ["./src/test/vitest.setup.ts"],
    silent: true,
    sequence: {
      concurrent: false,
    },
  },
});
