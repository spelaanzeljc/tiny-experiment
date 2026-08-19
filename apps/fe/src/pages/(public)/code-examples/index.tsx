import { Typography } from "@povio/ui";
import { createFileRoute } from "@tanstack/react-router";

function CodeExamplesPage() {
  return (
    <div className="flex flex-col gap-4 p-20">
      <Typography
        as="h1"
        size="title-4"
      >
        Code Examples
      </Typography>

      <Typography
        as="p"
        size="body-1"
      >
        This page contains code examples for the different components and hooks in the @povio/ui library.
      </Typography>
    </div>
  );
}

export const Route = createFileRoute("/(public)/code-examples/")({
  component: CodeExamplesPage,
});
