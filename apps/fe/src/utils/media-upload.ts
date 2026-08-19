import type { FileUploadRequest } from "@povio/ui";

import type { MediaModels } from "@/openapi/media/media.models";
import { MediaQueries } from "@/openapi/media/media.queries";

interface UseMediaUploadHandlerOptions {
  resourceName: MediaModels.MediaResourceName;
  method?: string;
  onUploaded: (media: { id: string; previewUrl: string }) => void;
}

interface FileUploadOptions {
  abortController?: AbortController;
  onUploadProgress?: (progress: { loaded: number; total: number }) => void;
}

export function useMediaUploadHandler({ resourceName, method, onUploaded }: UseMediaUploadHandlerOptions) {
  const uploadRequest = MediaQueries.useUploadRequest();

  return async (request: FileUploadRequest, file: File, options?: FileUploadOptions): Promise<{ id: string }> => {
    options?.onUploadProgress?.({ loaded: 1, total: 100 });

    const instructions = await uploadRequest.mutateAsync({
      data: {
        ...request.data,
        resourceName,
        mimeType: file.type || "application/octet-stream",
        method: method ?? "post",
      },
    });

    if (!instructions.url || !instructions.method || !instructions.id || !instructions.fields) {
      throw new Error("Media upload instructions are incomplete");
    }

    const formData = new FormData();
    instructions.fields.forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);

    const response = await fetch(instructions.url, {
      method: instructions.method.toUpperCase(),
      body: formData,
      signal: options?.abortController?.signal,
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      throw new Error(`Media upload failed (${response.status})${responseText ? `: ${responseText}` : ""}`);
    }

    options?.onUploadProgress?.({ loaded: 100, total: 100 });
    onUploaded({ id: instructions.id, previewUrl: URL.createObjectURL(file) });

    return { id: instructions.id };
  };
}
