import { createFileRoute } from "@tanstack/react-router";

import { RobodevPage } from "@/components/tiny/robodev/RobodevPage";

function PageComponent() {
  return <RobodevPage />;
}

export const Route = createFileRoute("/(public)/(tiny)/robodev")({
  component: PageComponent,
});
