import { create } from "zustand";

import { STORAGE_KEYS } from "@/constants/storage";
import { removeStorageItemAsync, setStorageItemAsync } from "@/utils/secureStore";

interface AuthState {
  token?: string | null;
  isLoading: boolean;
}

interface AuthActions {
  login: (token: string) => void;
  logout: () => void;
  restore: (token: string | null) => void;
}

const createInitialState = (): AuthState => ({
  token: null,
  isLoading: true,
});

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...createInitialState(),
  login: (token: string) => {
    set({ token, isLoading: false });
    void setStorageItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
  },
  logout: () => {
    set({ token: null, isLoading: false });
    void removeStorageItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  },
  restore: (token: string | null) => {
    set({ token, isLoading: false });
  },
}));
