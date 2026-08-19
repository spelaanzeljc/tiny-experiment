import { Outlet, createFileRoute } from "@tanstack/react-router";

function PublicLayout() {
  return <Outlet />;
}

export const Route = createFileRoute("/(public)")({
  component: PublicLayout,
});
