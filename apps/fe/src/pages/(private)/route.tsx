import { AuthGuard } from "@povio/openapi-codegen-cli";
import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppLayout } from "@/components/layout/AppLayout";

function PrivateLayout() {
  return (
    <AuthGuard type="private">
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AuthGuard>
  );
}

export const Route = createFileRoute("/(private)")({
  component: PrivateLayout,
});
