#!/usr/bin/env zx

import { $ } from "zx";

// generate OpenAPI data layer
await $`bun --filter fe openapi:gen`;
