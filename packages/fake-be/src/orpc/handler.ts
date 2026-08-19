import { OpenAPIHandler } from "@orpc/openapi/fetch";

import { router } from "~/orpc/api/router";
import { FAKE_MEDIA_UPLOAD_PATH, handleFakeMediaUploadRequest } from "~/media/upload-gateway";
import { logORPCRequest } from "~/orpc/request-logger";
import type { ORPCContext } from "~/orpc/types";

export const orpcOpenAPIHandler = new OpenAPIHandler<ORPCContext>(router);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function normalizeErrorResponse(response: Response): Promise<Response> {
  if (response.status < 400) {
    return response;
  }

  const text = await response.text();
  if (!text) {
    return new Response(text, response);
  }

  const body = (() => {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return null;
    }
  })();
  if (!body) {
    return new Response(text, response);
  }

  if (!isObject(body) || !isObject(body.data) || typeof body.data.code !== "string") {
    return new Response(text, response);
  }

  return Response.json(
    {
      ...body.data,
      message: typeof body.message === "string" ? body.message : undefined,
      orpcCode: body.code,
    },
    {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    },
  );
}

export async function handleORPCRequest(request: Request): Promise<Response> {
  const requestForLog = request.clone();
  if (new URL(request.url).pathname === FAKE_MEDIA_UPLOAD_PATH) {
    const response = await handleFakeMediaUploadRequest(request);
    await logORPCRequest(requestForLog, response);
    return response;
  }

  const result = await orpcOpenAPIHandler.handle(request, {
    context: { request },
  });

  if (!result.matched) {
    const response = new Response("Not Found", { status: 404 });
    await logORPCRequest(requestForLog, response);
    return response;
  }

  const response = await normalizeErrorResponse(result.response);
  await logORPCRequest(requestForLog, response);
  return response;
}
