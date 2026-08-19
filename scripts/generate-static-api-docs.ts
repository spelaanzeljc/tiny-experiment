import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateDBML, generateErDiagramData } from "../packages/fake-be/src/db/dbml-generator";
import { generateTinyOpenApiSpec } from "./tiny-openapi";

const outputRoot = resolve(process.cwd(), "dist", "api-docs");

const spec = await generateTinyOpenApiSpec();
const erData = generateErDiagramData();

mkdirSync(resolve(outputRoot, "er"), { recursive: true });
rmSync(resolve(outputRoot, "index.html"), { force: true });
rmSync(resolve(outputRoot, "er", "index.html"), { force: true });

writeFileSync(resolve(outputRoot, "openapi.json"), `${JSON.stringify(spec, null, 2)}\n`);
writeFileSync(resolve(outputRoot, "dbml.txt"), generateDBML());
writeFileSync(resolve(outputRoot, "er", "data.json"), `${JSON.stringify(erData, null, 2)}\n`);
