import { Link, Tag, Typography } from "@povio/ui";
import { createFileRoute } from "@tanstack/react-router";

function TypographyExample() {
  return (
    <section className="flex flex-col gap-4">
      <Typography
        as="h2"
        size="title-3"
      >
        Typography
      </Typography>
      <Typography
        as="p"
        size="body-3"
      >
        The Typography component is used to display text with consistent styling across the application. The larger the
        number, the smaller the text.
      </Typography>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Typography
            as="h3"
            size="title-4"
          >
            Title Sizes
          </Typography>
          <Typography
            as="h1"
            size="title-1"
          >
            Title 1
          </Typography>
          <Typography
            as="h2"
            size="title-2"
          >
            Title 2
          </Typography>
          <Typography
            as="h3"
            size="title-3"
          >
            Title 3 - Baseline
          </Typography>
          <Typography
            as="h4"
            size="title-4"
          >
            Title 4
          </Typography>
          <Typography
            as="h5"
            size="title-5"
          >
            Title 5
          </Typography>
          <Typography
            as="h6"
            size="title-6"
          >
            Title 6
          </Typography>
        </div>

        <div className="flex flex-col gap-2">
          <Typography
            as="h3"
            size="title-4"
          >
            Body Sizes
          </Typography>
          <Typography
            as="p"
            size="body-1"
          >
            Body 1 - Largest paragraph text
          </Typography>
          <Typography
            as="p"
            size="body-2"
          >
            Body 2 - Large paragraph text
          </Typography>
          <Typography
            as="p"
            size="body-3"
          >
            Body 3 - Default paragraph text - Baseline
          </Typography>
          <Typography
            as="p"
            size="body-4"
          >
            Body 4 - Small paragraph text
          </Typography>
        </div>

        <div className="flex flex-col gap-2">
          <Typography
            as="h3"
            size="title-4"
          >
            Label Sizes
          </Typography>
          <Typography
            as="p"
            size="label-1"
          >
            Label 1 - Large label text
          </Typography>
          <Typography
            as="p"
            size="label-2"
          >
            Label 2 - Default label text - Baseline
          </Typography>
          <Typography
            as="p"
            size="label-3"
          >
            Label 3 - Small label text
          </Typography>
        </div>

        <div className="flex flex-col gap-2">
          <Typography
            as="h3"
            size="title-4"
          >
            ClassName Overrides
          </Typography>
          <Typography
            as="p"
            size="body-3"
            className="text-blue-500"
          >
            Custom text color
          </Typography>
          <Typography
            as="p"
            size="body-3"
            className="text-center"
          >
            Center aligned text
          </Typography>
          <Typography
            as="p"
            size="body-3"
            className="font-bold"
          >
            Bold text
          </Typography>
        </div>
      </div>
    </section>
  );
}

function TagExample() {
  return (
    <section className="flex flex-col gap-4">
      <Typography
        as="h2"
        size="title-3"
      >
        Tag
      </Typography>
      <Typography
        as="p"
        size="body-3"
      >
        The Tag component is used to display labels, badges, or status indicators.
      </Typography>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Typography
            as="h3"
            size="title-4"
          >
            Colors
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Tag color="primary">Primary</Tag>
            <Tag color="secondary">Secondary</Tag>
            <Tag color="success">Success</Tag>
            <Tag color="warning">Warning</Tag>
            <Tag color="error">Error</Tag>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Typography
            as="h3"
            size="title-4"
          >
            Dismissable Tags
          </Typography>
          <Typography
            as="p"
            size="body-3"
          >
            Tags can be made dismissable with an X button
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Tag
              color="primary"
              dismissable
              onDismiss={() => console.log("Dismissed")}
            >
              Dismissable Tag
            </Tag>
            <Tag
              color="success"
              dismissable
              onDismiss={() => console.log("Dismissed")}
            >
              Click X to dismiss
            </Tag>
          </div>
        </div>
      </div>
    </section>
  );
}

function LinkExample() {
  return (
    <section className="flex flex-col gap-4">
      <Typography
        as="h2"
        size="title-3"
      >
        Link
      </Typography>
      <Typography
        as="p"
        size="body-3"
      >
        The Link component is used for external links.
      </Typography>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Typography
            as="h3"
            size="title-4"
          >
            Examples
          </Typography>
          <div className="flex flex-col gap-2">
            <Link
              href="https://example.com"
              target="_blank"
            >
              External link (opens in new tab)
            </Link>
            <Link
              href="https://example.com"
              isDisabled
            >
              Disabled link (not clickable)
            </Link>
            <Link
              href="https://example.com"
              className="font-semibold text-content-brand hover:underline"
            >
              Custom styled link
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TextExamplesPage() {
  return (
    <div className="flex flex-col gap-8 p-20">
      <TypographyExample />
      <div className="border-elevation-stroke-default border-t" />
      <TagExample />
      <div className="border-elevation-stroke-default border-t" />
      <LinkExample />
    </div>
  );
}

export const Route = createFileRoute("/(public)/code-examples/text")({
  component: TextExamplesPage,
});
