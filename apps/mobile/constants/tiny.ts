export const tinyApiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";
export const tinyApiMode = process.env.EXPO_PUBLIC_API_MODE ?? "fake";
export const useTinyFakeBackend = tinyApiMode === "fake";

export const tinyDemoLogin = {
  email: "user@example.com",
  password: "user-password",
} as const;
