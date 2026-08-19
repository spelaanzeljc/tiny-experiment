import { AuthGuard } from "@povio/openapi-codegen-cli";
import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AuthLayout } from "@/components/features/auth/AuthLayout";

function GuestLayout() {
  return (
    <AuthGuard type="public-only">
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    </AuthGuard>
  );
}

export const Route = createFileRoute("/(guest)")({
  component: GuestLayout,
});
