#!/usr/bin/env node
/**
 * Custom static server with correct api-docs data paths + SPA fallback.
 */
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(join(process.cwd(), "package.json"));
const handler = require("serve-handler");

const root = join(process.cwd(), "dist");
const port = parseInt(process.env.PORT || "4173", 10);

const API_DOCS_PATHS = {
  "/api-docs/openapi.json": "/api-docs/openapi.json",
  "/api-docs/dbml": "/api-docs/dbml.txt",
  "/api-docs/dbml.txt": "/api-docs/dbml.txt",
  "/api-docs/er/data.json": "/api-docs/er/data.json",
};

const server = createServer(async (req, res) => {
  const path = new URL(req.url || "/", `http://localhost`).pathname;
  const target = API_DOCS_PATHS[path];

  if (target) {
    const filePath = join(root, target);
    try {
      const stats = statSync(filePath);
      const contentType = target.endsWith(".json") ? "application/json; charset=utf-8" : "text/plain; charset=utf-8";
      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": stats.size,
      });
      createReadStream(filePath).pipe(res);
      return;
    } catch {
      // fall through to handler
    }
  }

  await handler(req, res, {
    public: root,
    rewrites: [{ source: "**", destination: "/index.html" }],
  });
});

server.listen(port, () => {
  console.log(`Serving at http://localhost:${port}`);
});
