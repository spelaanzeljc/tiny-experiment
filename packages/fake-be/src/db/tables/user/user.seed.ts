import type { User } from "~/db/tables/user/user.schema";

export const PRESET_USER_PASSWORD = "user-password";

/** Credentials for the demo user in seed data (for login page "Login as demo" button). */
export const DEMO_LOGIN = {
  email: "user@example.com",
  password: PRESET_USER_PASSWORD,
} as const;

export function createUserSeed(createdAt: string): User[] {
  const t = createdAt;
  return [
    {
      id: "demo-user-0000-0000-0000-000000000001",
      email: DEMO_LOGIN.email,
      name: "Demo User",
      roles: ["CLIENT"],
      password: DEMO_LOGIN.password,
      createdAt: t,
      updatedAt: t,
    },
  ];
}
