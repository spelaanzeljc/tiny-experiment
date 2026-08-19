---
root: false
targets: ["claudecode", "codexcli", "cursor"]
description: "Conditional role-based frontend and oRPC module structure for apps with distinct user roles."
globs: ["apps/fe/src/**/*.{ts,tsx}", "packages/fake-be/src/orpc/**/*.ts"]
cursor:
  alwaysApply: false
  description: "Apply only when an app has multiple user roles with distinct UI surfaces or business workflows."
  globs: ["apps/fe/src/**/*.{ts,tsx}", "packages/fake-be/src/orpc/**/*.ts"]
---

# Role-Based App Structure

Apply this rule only when the app has multiple user roles with meaningfully different UI surfaces or business workflows. For single-role apps or small permission differences, keep normal feature-based structure and express authorization in handlers, ACL metadata, or UI affordances.

## Frontend Structure

Split role-specific frontend code by role first:

- `apps/fe/src/components/features/<role>/<feature>/...` for role-owned feature UI, such as `admin/companies`, `manager/projects`, or `worker/timesheets`.
- `apps/fe/src/pages/(private)/(<role>)/...` for role-owned private routes and layout guards.
- Shared auth, profile, layout, and role-neutral UI should stay outside role folders.

When two roles touch the same entity with different screens or permissions, prefer separate role-owned feature components over a single component with many role branches.

## oRPC Structure

Create role-prefixed API modules for role-owned behavior even when the backing database entity is shared. For example, use separate modules such as `managerProjects` and `workerProjects` when managers can create and manage projects while workers can only list assigned projects.

Define available user roles in `packages/fake-be/src/roles`. Mark roles that should apply to modules by default with `isDefault: true`. Assign role-specific modules explicitly with `robodevRoles` in the module definition; modules may list multiple roles.

Role-prefixed modules should keep the role visible across the API surface:

- Module folder and exports: `packages/fake-be/src/orpc/api/<role><Feature>/`, such as `managerTimesheets`.
- Contract tags and generated client modules: `managerTimesheets`, `workerTimesheets`, `adminCompanies`.
- HTTP paths: `/api/<role>/<resource>`, such as `/api/manager/projects/paginate`.
- ACL subjects: `<role><Feature>:<action>`, such as `managerProject:update` or `workerProject:list`.

Keep shared infrastructure modules such as `auth`, `user`, `media`, and `common` role-neutral unless their behavior truly diverges by role.
