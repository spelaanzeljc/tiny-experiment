#!/usr/bin/env zx

import { $ } from "zx";

await $`bun --filter fe rimraf ./src/openapi`;

await $`bun --filter fe openapi:gen`;
