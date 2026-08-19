---
name: media-feature
description: "Use when adding or changing feature-level media/file upload support, media resource names, media validation policies, domain associations to media, frontend FileUpload handling, or media URL resolution."
targets: ["claudecode", "codexcli", "cursor"]
codexcli:
  short-description: Add or update media upload support for features.
---

# Media Feature Skill

Use this workflow when a feature needs images, files, or other media.

## Core Contract

Preserve the real-template upload contract:

1. Frontend selects a `File`.
2. Frontend calls `MediaQueries.useUploadRequest` with metadata only.
3. Frontend uploads bytes separately to the returned upload URL.
4. Feature create/update submits only a media reference such as `image: { id }`.
5. Feature reads resolve that ID to an object such as `image: { id, url }`.

Never send `File`, `Blob`, base64, or raw bytes in a feature create/update request.

## Fake Backend Media System

- Media metadata lives in `packages/fake-be/src/db/tables/media`, shaped close to the real Prisma `Media` model while using fake DB camelCase fields.
- Blob bytes live in IndexedDB through `packages/fake-be/src/media/blob-storage.ts`, keyed by `media.key`.
- Raw upload requests are intercepted by `packages/fake-be/src/media/upload-gateway.ts`, which is installed by the web and mobile app dev adapters.
- The reset seed data action must clear both the fake DB state and IndexedDB media blobs.

## Choosing A Media Resource

Use existing generic values from `MEDIA_RESOURCE_NAMES` in `packages/fake-be/src/orpc/api/media/media.models.ts` for reusable upload policies.

- For ordinary uploads, pick the closest existing generic resource such as `small-image`, `large-image`, `compressed-file`, `document`, or `any`.
- In frontend code, use generated values from `MediaModels.MediaResourceName` instead of hardcoded strings.
- If a genuinely new feature-specific upload policy is required, define a single shared resource constant in that feature's `*.media-resource.ts` with the resource `name`, persisted FK `field`, API `dtoField`, `mimeTypes`, and `maxFileSize`.
- Reuse that shared resource constant from the feature module's `robodevMediaResources`, router validation, and media upload policy. Do not duplicate feature-specific resource names or policy objects in multiple files.
- Only add to `MEDIA_RESOURCE_NAMES` and generic media router policy when the resource is intentionally reusable across features.

## Robodev Spec JSON Generation

When generating app/spec JSON for a feature with media upload, add a `mediaResources` array to the owning API module.

Each media resource must include:

- `name`: stable resource name, for example `profile-avatar`, `post-image`, or `receipt-photo`.
- `field`: DB foreign key column, for example `avatarId`, `imageId`, or `receiptPhotoId`.
- `dtoField`: API media object field, for example `avatar`, `image`, or `receiptPhoto`.
- `mimeTypes`: allowed MIME types.
- `maxFileSize`: max file size in bytes.

Do not put `ownerModule` inside module-local `mediaResources`; the enclosing module is the owner.

DBML should include the configured `field` as a nullable string/UUID foreign key to `Media.id` when media is optional. Do not add the `dtoField` object to DBML; it is API-only.

The request DTO should include the configured `dtoField` as an object like `{ id: string }`.
The response DTO should include the configured `dtoField` as an object like `{ id: string, url: string }`.

## Connecting Media To A Feature

Backend:

- Persist only a scalar foreign key such as `imageId` or `documentId` on the domain table.
- Keep nested media objects out of DB row schemas; they are API-only.
- In write schemas, accept a small reference object such as `image: z.object({ id: z.string() }).nullish()`.
- In read schemas, return a resolved object such as `image: { id, url } | null`.
- In router handlers, validate the media exists, belongs to the expected resource name, is uploaded and validated, is not deleted, and belongs to the authenticated user when ownership matters.
- Resolve URLs with `getMediaBlobUrl(media.key)`.

Frontend:

- In the web app, use `useMediaUploadHandler` from `apps/fe/src/utils/media-upload.ts` with a generated `MediaModels.MediaResourceName` value.
- In React Native mobile apps, do not trust camera or image-picker metadata when requesting a signed upload URL. Read the actual local file size and detect the MIME type from the file bytes before calling the upload-request endpoint.
- In React Native mobile apps, avoid creating upload `Blob`s from `ArrayBuffer` or `ArrayBufferView`; those paths are not portable across Expo/React Native runtimes. Use native file upload support such as `expo-file-system` `File.upload` with multipart `fieldName: "file"` when posting to the real backend upload URL.
- The metadata used for `MediaQueries.useUploadRequest` or generated `MediaApi.uploadRequest` must match the bytes uploaded afterward. Real backends may validate signed `fileSize`, `mimeType`, and `key` against the received multipart file.
- On upload success, set the form field to `{ id: media.id }`.
- On submit, send only the media reference object.
- On reads/previews, use the resolved `entity.image?.url` or a shared fallback helper.

## Validation

After media changes:

1. Run `bun openapi:gen` when contracts or resource-name schemas change.
2. Run `bun ts:check`.
3. Run lint/format checks for broad edits.
4. Manually verify create/edit if the change affects the upload UI or URL resolution.
