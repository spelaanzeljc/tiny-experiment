import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const fakeBeRoot = fileURLToPath(new URL("../packages/fake-be", import.meta.url));

export async function runTinyOpenApiFileGeneration() {
  const args = process.versions.bun
    ? ["../../scripts/tiny-openapi.ts"]
    : ["--import", "tsx", "../../scripts/tiny-openapi.ts"];

  await execFileAsync(process.execPath, args, {
    cwd: fakeBeRoot,
    env: process.env,
  });
}
