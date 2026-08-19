import { Button, Typography, useToast } from "@povio/ui";
import { createFileRoute } from "@tanstack/react-router";

import type { FakeMailModels } from "@/openapi/fakeMail/fakeMail.models";
import { FakeMailQueries } from "@/openapi/fakeMail/fakeMail.queries";

const variants: { variant: FakeMailModels.FakeMailDemoVariant; label: string; description: string }[] = [
  { variant: "text", label: "Send plain text", description: "A basic message with a text body." },
  { variant: "html", label: "Send HTML", description: "HTML rendered inside a script-free sandbox." },
  { variant: "recipients", label: "Send to recipients", description: "Includes to, cc, bcc, and reply-to metadata." },
  {
    variant: "sequence",
    label: "Send three messages",
    description: "Attempts to open one new popup for every message.",
  },
];

function FakeMailboxExamplesPage() {
  const { successToast } = useToast();
  const sendDemo = FakeMailQueries.useSendDemo({
    onSuccess: ({ mailIds }) =>
      successToast({ text: `${mailIds.length} demo email${mailIds.length === 1 ? "" : "s"} sent` }),
  });

  return (
    <div className="flex flex-col gap-6 p-20">
      <div>
        <Typography
          as="h1"
          size="title-2"
        >
          Fake mailbox
        </Typography>
        <Typography
          as="p"
          className="mt-2 text-text-default-2"
          size="body-2"
        >
          Use these actions to exercise the same fake mail service that backend business logic calls.
        </Typography>
      </div>
      <div className="grid max-w-4xl gap-4 md:grid-cols-2">
        {variants.map((item) => (
          <section
            key={item.variant}
            className="flex flex-col gap-3 border-elevation-outline-default-1 border bg-elevation-fill-default-1 p-5"
          >
            <Typography
              as="h2"
              size="title-4"
            >
              {item.label}
            </Typography>
            <Typography
              as="p"
              className="text-text-default-2"
              size="body-2"
            >
              {item.description}
            </Typography>
            <Button
              isDisabled={sendDemo.isPending}
              onPress={() => sendDemo.mutate({ data: { variant: item.variant } })}
              width="hug"
            >
              {item.label}
            </Button>
          </section>
        ))}
      </div>
      <Typography
        as="p"
        className="text-text-default-2"
        size="body-2"
      >
        If the browser blocks an automatic popup, use the displayed prompt or allow popups for this origin. Every
        message remains available from the floating mailbox button.
      </Typography>
    </div>
  );
}

export const Route = createFileRoute("/(public)/code-examples/fake-mailbox")({
  component: FakeMailboxExamplesPage,
});
