/* oxlint-disable import/no-nodejs-modules */
const path = require("node:path");
const { applyEnv, resolveConfigSync } = require("@povio/resolve-config");

const repoRoot = path.resolve(__dirname, "../../..");

function applyTinySpaEnv() {
  const env = resolveConfigSync({ cwd: repoRoot, module: "spa", target: "resolved" });
  applyEnv(env, "__");

  return env;
}

module.exports = { applyTinySpaEnv };
