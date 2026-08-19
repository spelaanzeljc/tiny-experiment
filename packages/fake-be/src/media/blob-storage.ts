const DB_NAME = "fake-be-media";
const DB_VERSION = 1;
const STORE_NAME = "blobs";

const objectUrlCache = new Map<string, string>();

function clearObjectUrlCache(): void {
  if (typeof URL !== "undefined") {
    objectUrlCache.forEach((url) => URL.revokeObjectURL(url));
  }
  objectUrlCache.clear();
}

function isIndexedDbAvailable(): boolean {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDb(): Promise<IDBDatabase | null> {
  if (!isIndexedDbAvailable()) {
    return Promise.resolve(null);
  }

  // eslint-disable-next-line promise/avoid-new -- IndexedDB uses event callbacks in browser APIs.
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putMediaBlob(storageKey: string, blob: Blob): Promise<void> {
  const db = await openDb();
  if (!db) {
    return;
  }

  // eslint-disable-next-line promise/avoid-new -- IndexedDB transactions use event callbacks in browser APIs.
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(blob, storageKey);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
}

export async function clearMediaBlobStorage(): Promise<void> {
  clearObjectUrlCache();

  const db = await openDb();
  if (!db) {
    return;
  }

  // eslint-disable-next-line promise/avoid-new -- IndexedDB transactions use event callbacks in browser APIs.
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).clear();
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
}

async function getMediaBlob(storageKey: string): Promise<Blob | null> {
  const db = await openDb();
  if (!db) {
    return null;
  }

  // eslint-disable-next-line promise/avoid-new -- IndexedDB requests use event callbacks in browser APIs.
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(storageKey);
    request.onsuccess = () => resolve(request.result instanceof Blob ? request.result : null);
    request.onerror = () => reject(request.error);
  });

  db.close();
  return blob;
}

export async function getMediaBlobUrl(storageKey: string): Promise<string | null> {
  const cachedUrl = objectUrlCache.get(storageKey);
  if (cachedUrl) {
    return cachedUrl;
  }

  const blob = await getMediaBlob(storageKey);
  if (!blob || typeof URL === "undefined") {
    return null;
  }

  const url = URL.createObjectURL(blob);
  objectUrlCache.set(storageKey, url);
  return url;
}
