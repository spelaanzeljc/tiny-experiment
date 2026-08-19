import { TextButton } from "@povio/ui";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

function CodeExamplesLayout() {
  return (
    <div>
      <header className="flex items-center justify-between border-elevation-outline-default-1 border-b bg-elevation-fill-default-2 p-5">
        <Link to="/">Home</Link>

        <nav className="flex gap-4">
          <TextButton link={{ to: "/code-examples" }}>Code Examples</TextButton>
          <TextButton link={{ to: "/code-examples/text" }}>Text</TextButton>
          <TextButton link={{ to: "/code-examples/buttons" }}>Buttons</TextButton>
          <TextButton link={{ to: "/code-examples/inputs" }}>Inputs</TextButton>
          <TextButton link={{ to: "/code-examples/overlays" }}>Overlays</TextButton>
          <TextButton link={{ to: "/code-examples/query-autocomplete" }}>Query Autocomplete</TextButton>
          <TextButton link={{ to: "/code-examples/toasts" }}>Toasts</TextButton>
          <TextButton link={{ to: "/code-examples/fake-mailbox" }}>Fake Mailbox</TextButton>
        </nav>
      </header>

      <Outlet />
    </div>
  );
}

export const Route = createFileRoute("/(public)/code-examples")({
  component: CodeExamplesLayout,
});
