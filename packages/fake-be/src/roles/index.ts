export interface UserRoleDefinition {
  name: string;
  description: string;
  isDefault?: boolean;
}

export const userRoles = [
  {
    name: "CLIENT",
    description: "Default role for regular users",
    isDefault: true,
  },
] as const satisfies readonly UserRoleDefinition[];

export type UserRoleName = (typeof userRoles)[number]["name"];
