import { createFileRoute } from "@tanstack/react-router";

import { ErDiagramPage } from "@/components/tiny/er-diagram/ErDiagramPage";

function PageComponent() {
  return <ErDiagramPage />;
}

export const Route = createFileRoute("/(public)/(tiny)/er-diagram")({
  component: PageComponent,
});
