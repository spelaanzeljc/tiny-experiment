import { storeHelpers } from "~/db/store";
import { mediaRepository } from "~/db/tables/media/media.repository";
import { putMediaBlob } from "~/media/blob-storage";
import { createMediaUploadToken } from "~/media/upload-token";

export const FAKE_MEDIA_UPLOAD_PATH = "/api/media/provider/prisma/upload";

let isInstalled = false;

function textResponse(message: string, status: number): Response {
  return new Response(message, {
    status,
    headers: {
      "content-type": "text/plain",
    },
  });
}

function getFormString(formData: { get: (key: string) => unknown }, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" ? value : null;
}

function shouldHandleFakeMediaUpload(input: RequestInfo | URL, request: Request): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const url = new URL(request.url);
  const inputUrl = typeof input === "string" || input instanceof URL ? input.toString() : input.url;

  return (
    url.pathname === FAKE_MEDIA_UPLOAD_PATH &&
    url.origin === window.location.origin &&
    !/^[a-z][a-z\d+\-.]*:\/\//i.test(inputUrl)
  );
}

export async function handleFakeMediaUploadRequest(request: Request): Promise<Response> {
  if (request.method.toUpperCase() !== "POST") {
    return textResponse("Method Not Allowed", 405);
  }

  const formData = (await request.formData()) as unknown as { get: (key: string) => unknown };
  const storageKey = getFormString(formData, "key");
  const fileSize = getFormString(formData, "fileSize");
  const mimeType = getFormString(formData, "mimeType");
  const token = getFormString(formData, "token");
  const file = formData.get("file");

  if (!storageKey || !fileSize || !mimeType || !token || !(file instanceof Blob)) {
    return textResponse("Invalid upload form data", 400);
  }

  const media = await mediaRepository.findFirst((item) => item.key === storageKey);
  if (!media || media.key !== storageKey || media.uploaded || media.deleted) {
    return textResponse("Invalid media upload", 400);
  }

  if (token !== createMediaUploadToken(media.id, media.key)) {
    return textResponse("Invalid upload token", 400);
  }

  if (
    Number(fileSize) !== media.fileSize ||
    mimeType !== media.mimeType ||
    file.size !== media.fileSize ||
    file.type !== media.mimeType
  ) {
    return textResponse("Uploaded file does not match media metadata", 400);
  }

  const now = storeHelpers.now();
  await putMediaBlob(media.key, file);
  await mediaRepository.update(media.id, {
    uploaded: now,
    validated: now,
    updatedAt: now,
  });

  return new Response(null, { status: 204 });
}

export function installFakeMediaUploadGateway(): void {
  if (isInstalled || typeof window === "undefined") {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = input instanceof Request ? input : new Request(input, init);

    if (shouldHandleFakeMediaUpload(input, request)) {
      return handleFakeMediaUploadRequest(request);
    }

    return originalFetch(input, init);
  };

  isInstalled = true;
}
