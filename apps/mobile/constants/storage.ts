/**
 * Storage keys used across the application
 * Centralized constants for maintainability and consistency
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  // Add other storage keys here as needed
  // USER_PREFERENCES: "user_preferences",
  // THEME_SETTING: "theme_setting",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
