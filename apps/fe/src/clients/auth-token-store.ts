import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/config/jwt.config";

type TokenListener = () => void;

const listeners = new Set<TokenListener>();
let storageListenerCount = 0;

const isBrowser = () => typeof window !== "undefined";

const readToken = (key: string) => {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeToken = (key: string, token: string | null) => {
  if (!isBrowser()) {
    return;
  }

  try {
    if (token) {
      window.localStorage.setItem(key, token);
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Keep in-memory auth subscribers in sync even if storage is unavailable.
  }
};

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const onStorageChange = (event: StorageEvent) => {
  if (event.storageArea !== window.localStorage) {
    return;
  }

  if (event.key === ACCESS_TOKEN_KEY || event.key === REFRESH_TOKEN_KEY || event.key === null) {
    emitChange();
  }
};

export const authTokenStore = {
  getAccessToken: () => readToken(ACCESS_TOKEN_KEY),
  getRefreshToken: () => readToken(REFRESH_TOKEN_KEY),
  getServerSnapshot: () => null,
  subscribe: (listener: TokenListener) => {
    listeners.add(listener);

    if (isBrowser()) {
      if (storageListenerCount === 0) {
        window.addEventListener("storage", onStorageChange);
      }
      storageListenerCount += 1;
    }

    return () => {
      listeners.delete(listener);

      if (isBrowser()) {
        storageListenerCount -= 1;
        if (storageListenerCount === 0) {
          window.removeEventListener("storage", onStorageChange);
        }
      }
    };
  },
  setAccessToken: (token: string | null) => {
    writeToken(ACCESS_TOKEN_KEY, token);
    emitChange();
  },
  setRefreshToken: (token: string | null) => {
    writeToken(REFRESH_TOKEN_KEY, token);
    emitChange();
  },
  setTokens: (accessToken: string | null, refreshToken?: string | null) => {
    writeToken(ACCESS_TOKEN_KEY, accessToken);

    if (refreshToken !== undefined) {
      writeToken(REFRESH_TOKEN_KEY, refreshToken);
    }

    emitChange();
  },
  clear: () => {
    writeToken(ACCESS_TOKEN_KEY, null);
    writeToken(REFRESH_TOKEN_KEY, null);
    emitChange();
  },
};
