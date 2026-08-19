import { createFileRoute } from "@tanstack/react-router";

import { ApiDocsPage } from "@/components/tiny/api-docs/ApiDocsPage";

function PageComponent() {
  return <ApiDocsPage />;
}

export const Route = createFileRoute("/(public)/(tiny)/api-docs")({
  component: PageComponent,
});
