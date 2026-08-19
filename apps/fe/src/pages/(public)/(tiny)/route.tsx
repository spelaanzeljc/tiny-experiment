import { Button, TextButton, Typography } from "@povio/ui";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

function TinyLayout() {
  return (
    <div className="min-h-screen bg-elevation-fill-default-2">
      <header className="sticky top-0 z-20 flex flex-col gap-3 border-b border-elevation-outline-default-1 bg-elevation-fill-default-1 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <Link
          to="/api-docs"
          className="w-fit"
        >
          <Typography
            as="span"
            size="body-1"
            variant="prominent-1"
            className="text-text-default-1"
          >
            Tiny Template
          </Typography>
        </Link>

        <nav className="flex flex-wrap items-center gap-3">
          <TextButton link={{ to: "/api-docs" }}>API Docs</TextButton>
          <TextButton link={{ to: "/er-diagram" }}>ER Diagram</TextButton>
          <TextButton link={{ to: "/robodev" }}>Robodev</TextButton>
          <TextButton link={{ href: "/api-docs/dbml", target: "_blank" }}>DBML</TextButton>
          <Button
            size="s"
            width="hug"
            variant="outlined"
            color="secondary"
            icon={ArrowLeft}
            link={{ to: "/" }}
          >
            Back to app
          </Button>
        </nav>
      </header>

      <Outlet />
    </div>
  );
}

export const Route = createFileRoute("/(public)/(tiny)")({
  component: TinyLayout,
});
