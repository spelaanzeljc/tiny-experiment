#!/usr/bin/env zx

import { $ } from "zx";

await $`cd apps/fe && bunx --bun vite build`;
