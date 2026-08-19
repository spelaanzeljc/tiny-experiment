import { type AxiosAdapter, AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

import { handleORPCRequest } from "~/orpc/handler";

function headersToObject(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function normalizeRequestHeaders(headers: InternalAxiosRequestConfig["headers"]): Headers {
  const result = new Headers();
  const source =
    headers && "toJSON" in headers && typeof headers.toJSON === "function"
      ? (headers.toJSON() as Record<string, unknown>)
      : (headers as Record<string, unknown> | undefined);

  for (const [key, value] of Object.entries(source ?? {})) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      result.set(key, String(value));
    }
  }

  return result;
}

function appendParams(url: URL, params: unknown) {
  if (!params || typeof params !== "object") {
    return;
  }

  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    appendParamValue(url, key, value);
  }
}

function appendParamValue(url: URL, key: string, value: unknown) {
  if (value == null) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => appendParamValue(url, `${key}[${index}]`, item));
    return;
  }
  if (typeof value === "object") {
    Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
      appendParamValue(url, `${key}[${childKey}]`, childValue);
    });
    return;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    url.searchParams.set(key, String(value));
  }
}

function createBody(config: InternalAxiosRequestConfig): BodyInit | undefined {
  if (config.data == null) {
    return undefined;
  }
  if (typeof config.data === "string" || config.data instanceof FormData || config.data instanceof Blob) {
    return config.data;
  }
  return JSON.stringify(config.data);
}

export function createORPCAxiosAdapter(): AxiosAdapter {
  return async (config) => {
    const baseURL = config.baseURL ?? window.location.origin;
    const url = new URL(config.url ?? "/", baseURL);
    appendParams(url, config.params);

    const method = (config.method ?? "get").toUpperCase();
    const headers = normalizeRequestHeaders(config.headers);
    if (config.data != null && !headers.has("content-type") && !(config.data instanceof FormData)) {
      headers.set("content-type", "application/json");
    }

    const request = new Request(url.toString(), {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : createBody(config),
    });

    const response = await handleORPCRequest(request);
    const text = await response.text();
    const data = text ? JSON.parse(text) : "";

    const axiosResponse: AxiosResponse = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: headersToObject(response.headers),
      config,
      request,
    };

    const validateStatus = config.validateStatus ?? ((status: number) => status >= 200 && status < 300);
    if (!validateStatus(response.status)) {
      throw new AxiosError(response.statusText, undefined, config, request, axiosResponse);
    }

    return axiosResponse;
  };
}
