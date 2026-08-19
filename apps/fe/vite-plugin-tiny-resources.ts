/**
 * Vite plugin that serves tiny-template resources consumed by the React app.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

import { runTinyOpenApiFileGeneration } from "../../scripts/tiny-openapi-runner";

const openApiJson = fileURLToPath(new URL("../../packages/fake-be/openapi.generated.json", import.meta.url));
const dbmlGenerator = fileURLToPath(new URL("../../packages/fake-be/src/db/dbml-generator.ts", import.meta.url));

interface DbmlGeneratorModule {
  generateDBML: () => string;
  generateErDiagramData: () => unknown;
}

export function tinyResourcesPlugin(): Plugin {
  let cachedSpec: string | null = null;
  let cachedDbml: string | null = null;

  return {
    name: "vite-plugin-tiny-resources",
    apply: "serve",
    configureServer(server) {
      const getDbml = async (): Promise<string> => {
        if (cachedDbml) {
          return cachedDbml;
        }
        const { generateDBML } = await server
          .ssrLoadModule(dbmlGenerator)
          .then((module) => module as DbmlGeneratorModule);
        cachedDbml = generateDBML();
        return cachedDbml;
      };
      const getSpec = async (): Promise<string> => {
        if (cachedSpec) {
          return cachedSpec;
        }
        try {
          cachedSpec = await readFile(openApiJson, "utf8").catch(async () => {
            await runTinyOpenApiFileGeneration();
            return readFile(openApiJson, "utf8");
          });
          return cachedSpec;
        } catch (error) {
          console.error("[tiny-resources] Failed to generate OpenAPI spec:", error);
          return JSON.stringify({
            openapi: "3.0.3",
            info: { title: "Error", description: String(error) },
            paths: {},
            components: { schemas: {} },
          });
        }
      };
      server.middlewares.use(async (req, res, next) => {
        if (req.url === "/api-docs/openapi.json") {
          const spec = await getSpec();
          res.setHeader("Content-Type", "application/json");
          res.end(spec);
          return;
        }
        if (req.url === "/api-docs/dbml") {
          try {
            const dbml = await getDbml();
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(dbml);
          } catch (error) {
            const message = String(error);
            console.error("[tiny-resources] Failed to generate DBML:", error);
            res.setHeader("Content-Type", "text/plain");
            res.statusCode = 500;
            res.end(`Error generating DBML: ${message}`);
          }
          return;
        }
        if (req.url === "/api-docs/dbml.txt") {
          try {
            const dbml = await getDbml();
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(dbml);
          } catch (error) {
            const message = String(error);
            console.error("[tiny-resources] Failed to generate DBML:", error);
            res.setHeader("Content-Type", "text/plain");
            res.statusCode = 500;
            res.end(`Error generating DBML: ${message}`);
          }
          return;
        }
        if (req.url === "/api-docs/er/data.json") {
          try {
            const { generateErDiagramData } = await server
              .ssrLoadModule(dbmlGenerator)
              .then((module) => module as DbmlGeneratorModule);
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify(generateErDiagramData()));
          } catch (error) {
            console.error("[tiny-resources] Failed to generate ER diagram data:", error);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(error) }));
          }
          return;
        }
        next();
      });

      server.watcher.on("change", (path) => {
        if (path.includes("packages/fake-be/src/orpc") && path.endsWith(".ts")) {
          cachedSpec = null;
        }
        if (path.includes("packages/fake-be/src/db") && path.endsWith(".ts")) {
          cachedDbml = null;
        }
      });
    },
  };
}
