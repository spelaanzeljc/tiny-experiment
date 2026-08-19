export function createMediaUploadToken(mediaId: string, storageKey: string): string {
  return btoa(`${mediaId}:${storageKey}`);
}
