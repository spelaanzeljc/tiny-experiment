const { execFile } = require("node:child_process");
const path = require("node:path");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);
const fakeBeRoot = path.resolve(__dirname, "../packages/fake-be");

async function runTinyOpenApiFileGeneration() {
  const args = process.versions.bun
    ? ["../../scripts/tiny-openapi.ts"]
    : ["--import", "tsx", "../../scripts/tiny-openapi.ts"];

  await execFileAsync(process.execPath, args, {
    cwd: fakeBeRoot,
    env: process.env,
  });
}

module.exports = {
  runTinyOpenApiFileGeneration,
};
