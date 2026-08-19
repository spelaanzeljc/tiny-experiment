import { isContractProcedure, type AnyContractRouter } from "@orpc/contract";

import { contract } from "~/orpc/api/contract";

interface ORPCLogRoute {
  method: string;
  name: string;
  path: string;
  pattern: RegExp;
}

interface ORPCRequestLogMeta {
  method: string;
  route: string;
  requestPath: string;
  status: number;
}

interface ORPCRequestLogInput {
  query: Record<string, string | string[]>;
  body: unknown;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

function createRoutePattern(path: string) {
  const pattern = path
    .split("/")
    .map((part) => (part.startsWith("{") && part.endsWith("}") ? "[^/]+" : escapeRegExp(part)))
    .join("/");

  return new RegExp(`^${pattern}$`);
}

function collectRoutes(router: AnyContractRouter, path: string[] = []): ORPCLogRoute[] {
  if (isContractProcedure(router)) {
    const { "~orpc": definition } = router;
    const { route } = definition;
    if (!route?.method || !route.path) {
      return [];
    }

    const routePath = route.path.toString();
    const method = route.method.toUpperCase();

    return [
      {
        method,
        name: path.join("."),
        path: routePath,
        pattern: createRoutePattern(routePath),
      },
    ];
  }

  return Object.entries(router).flatMap(([key, child]) => {
    if (key === "~orpc") {
      return [];
    }

    return collectRoutes(child as AnyContractRouter, [...path, key]);
  });
}

const logRoutes = collectRoutes(contract);

function findRoute(method: string, requestPath: string) {
  return logRoutes.find((route) => route.method === method && route.pattern.test(requestPath));
}

function getQueryInput(searchParams: URLSearchParams): Record<string, string | string[]> {
  const query: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    const existing = query[key];
    if (Array.isArray(existing)) {
      existing.push(value);
      return;
    }
    if (existing !== undefined) {
      query[key] = [existing, value];
      return;
    }

    query[key] = value;
  });

  return query;
}

async function readJsonLikeBody(body: Body): Promise<unknown> {
  const text = await body.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function logORPCRequest(request: Request, response: Response) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const route = findRoute(method, url.pathname);
  const meta: ORPCRequestLogMeta = {
    method,
    route: route ? `${route.name} ${route.method} ${route.path}` : "unmatched",
    requestPath: `${url.pathname}${url.search}`,
    status: response.status,
  };
  const input: ORPCRequestLogInput = {
    query: getQueryInput(url.searchParams),
    body: await readJsonLikeBody(request.clone()),
  };
  const output = await readJsonLikeBody(response.clone());

  console.groupCollapsed(`[oRPC] ${meta.method} ${meta.requestPath} -> ${meta.status}`);
  console.info("meta", meta);
  console.info("input", input);
  console.info("output", output);
  console.groupEnd();
}
