import { storeHelpers } from "~/db/store";
import { mediaRepository } from "~/db/tables/media/media.repository";
import type { Media } from "~/db/tables/media/media.schema";
import { createMediaUploadToken } from "~/media/upload-token";
import type { MediaResourceName } from "~/orpc/api/media/media.models";
import { PLANET_IMAGE_MEDIA_RESOURCE } from "~/orpc/api/planets/planets.media-resource";
import type { ORPCRouterBuilder, RequireAuthMiddleware } from "~/orpc/api/router";
import { badRequest } from "~/orpc/helpers/errors";

const MEDIA_PROVIDER = "fake-indexeddb";
const UPLOAD_URL = "/api/media/provider/prisma/upload";

interface MediaResourcePolicy {
  maxFileSize: number;
  mimeTypes: readonly string[];
}

interface NamedMediaResourcePolicy extends MediaResourcePolicy {
  name: string;
}

const resourcePolicies = [
  {
    name: "small-image",
    maxFileSize: 2 * 1024 * 1024,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  {
    name: "large-image",
    maxFileSize: 20 * 1024 * 1024,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  {
    name: "compressed-file",
    maxFileSize: 50 * 1024 * 1024,
    mimeTypes: [
      "application/zip",
      "application/x-rar-compressed",
      "application/gzip",
      "application/x-7z-compressed",
      "application/x-bzip2",
    ],
  },
  {
    name: "document",
    maxFileSize: 50 * 1024 * 1024,
    mimeTypes: [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.oasis.opendocument.text",
      "application/vnd.oasis.opendocument.spreadsheet",
      "application/pdf",
    ],
  },
  {
    name: "any",
    maxFileSize: 100 * 1024 * 1024,
    mimeTypes: ["*/*"],
  },
  PLANET_IMAGE_MEDIA_RESOURCE,
] satisfies NamedMediaResourcePolicy[];

const resourcePolicy = Object.fromEntries(
  resourcePolicies.map(({ name, maxFileSize, mimeTypes }) => [name, { maxFileSize, mimeTypes }]),
) satisfies Record<string, MediaResourcePolicy>;

const MIME_TYPE_BY_EXTENSION: Record<string, string> = {
  "7z": "application/x-7z-compressed",
  bz2: "application/x-bzip2",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  gz: "application/gzip",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  odt: "application/vnd.oasis.opendocument.text",
  pdf: "application/pdf",
  png: "image/png",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  rar: "application/x-rar-compressed",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  zip: "application/zip",
};

function inferMimeType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return (extension ? MIME_TYPE_BY_EXTENSION[extension] : undefined) ?? "application/octet-stream";
}

function validateResourceUpload(input: {
  resourceName: MediaResourceName;
  fileName: string;
  fileSize: number;
  mimeType: string;
  resourcePolicy: Record<string, MediaResourcePolicy>;
}) {
  const policy = input.resourcePolicy[input.resourceName];
  if (!policy) {
    badRequest("Unknown media resource");
  }

  const isAllowedMimeType = policy.mimeTypes.some((allowedMimeType) => {
    const [allowedType, allowedSubtype] = allowedMimeType.split("/");
    const [inputType, inputSubtype] = input.mimeType.split("/");
    return allowedType === inputType && (allowedSubtype === "*" || allowedSubtype === inputSubtype);
  });

  if (!isAllowedMimeType) {
    badRequest("File type is not allowed for this media resource");
  }

  if (input.fileSize > policy.maxFileSize) {
    badRequest("File is too large for this media resource");
  }
}

export function createMediaRouter(os: ORPCRouterBuilder, requireAuth: RequireAuthMiddleware) {
  return {
    uploadRequest: os.media.uploadRequest.use(requireAuth).handler(async ({ input, context }) => {
      if (!input.resourceName) {
        badRequest("Missing ResourceName");
      }

      const mimeType = input.mimeType ?? inferMimeType(input.fileName);
      validateResourceUpload({ ...input, resourceName: input.resourceName, mimeType, resourcePolicy });

      const id = storeHelpers.uuid();
      const t = storeHelpers.now();
      const storageKey = `${input.resourceName}/${id}`;
      const row: Media = {
        id,
        key: storageKey,
        provider: MEDIA_PROVIDER,
        resourceName: input.resourceName,
        meta: null,
        fileName: input.fileName,
        fileSize: input.fileSize,
        mimeType,
        uploaded: null,
        validated: null,
        deleted: null,
        loOid: null,
        module: null,
        type: null,
        resourceId: null,
        userId: context.auth.user.id,
        createdAt: t,
        updatedAt: t,
      };

      await mediaRepository.create(row);

      return {
        id,
        method: "post",
        url: UPLOAD_URL,
        fields: [
          ["key", storageKey],
          ["fileSize", String(input.fileSize)],
          ["mimeType", mimeType],
          ["token", createMediaUploadToken(id, storageKey)],
        ],
      };
    }),
  };
}
