import { getItemAsync } from "expo-secure-store";
import { useCallback, useEffect, useReducer } from "react";
import { Platform } from "react-native";

import { removeStorageItemAsync, setStorageItemAsync } from "@/utils/secureStore";

interface StorageState<T> {
  isLoading: boolean;
  value: T | null;
}
type UseStateHook<T> = [StorageState<T>, (value: T | null) => void];

function useAsyncState<T>(initialValue: StorageState<T> = { isLoading: true, value: null }): UseStateHook<T> {
  return useReducer(
    (_state: StorageState<T>, action: T | null = null): StorageState<T> => ({ isLoading: false, value: action }),
    initialValue,
  ) as UseStateHook<T>;
}

export function useSecureStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          setState(localStorage.getItem(key));
        }
      } catch (error) {
        console.error("Local storage is unavailable:", error);
      }
    } else {
      void (async () => {
        try {
          const value = await getItemAsync(key);
          setState(value);
        } catch {
          // Keep the initial null value when secure storage is unavailable.
        }
      })();
    }
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: string | null) => {
      setState(value);
      if (value) {
        void setStorageItemAsync(key, value);
      } else {
        void removeStorageItemAsync(key);
      }
    },
    [key],
  );

  return [state, setValue];
}
