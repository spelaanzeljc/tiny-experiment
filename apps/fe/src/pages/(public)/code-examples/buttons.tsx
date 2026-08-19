import { Button, IconButton, InlineIconButton, PillButton, TextButton, ToggleButton, Typography } from "@povio/ui";
import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";

function ButtonExamplesPage() {
  const [isToggleButtonToggled, setIsToggleButtonToggled] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-20">
      <section className="flex flex-col gap-2">
        <Typography
          as="h2"
          size="title-3"
        >
          Colors
        </Typography>

        <div className="flex flex-row items-center gap-4">
          <Button color="primary">Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button color="success">Success</Button>
          <Button color="warning">Warning</Button>
          <Button color="error">Error</Button>
          <Button color="dual">Dual</Button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        {/* Affects paddings */}
        <Typography
          as="h2"
          size="title-3"
        >
          Sizes
        </Typography>

        <div className="flex flex-row items-center gap-4">
          <Button size="xs">XS</Button>
          <Button size="s">S</Button>
          <Button size="m">M</Button>
          <Button size="l">L</Button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        {/* Buttons are by default full width. Use `width=`hug`` to make them fit the content. */}
        <Typography
          as="h2"
          size="title-3"
        >
          Width
        </Typography>

        <div className="flex flex-row items-center gap-4">
          <Button width="fill">Fill</Button>
          <Button width="hug">Hug</Button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Typography
          as="h2"
          size="title-3"
        >
          Variants
        </Typography>

        <div className="flex flex-row items-center gap-4">
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="text">Text</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Typography
          as="h2"
          size="title-3"
        >
          Icons
        </Typography>

        <div className="flex flex-row items-center gap-4">
          <Button icon={X}>Close</Button>
          <Button
            icon={X}
            iconPosition="right"
          >
            Close
          </Button>
          <Button
            icon={X}
            iconPosition="left"
          >
            Close
          </Button>
          {/* The label shows up as a Tooltip when hovering over the button */}
          <Button
            icon={X}
            iconOnly
          >
            Close
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Typography
          as="h2"
          size="title-3"
        >
          States
        </Typography>

        <div className="flex flex-row items-center gap-4">
          {/* Use real conditions to show loading and disabled states */}
          <Button isLoading>Loading</Button>
          <Button isDisabled>Disabled</Button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Typography
          as="h2"
          size="title-3"
        >
          Links
        </Typography>

        <div className="flex flex-row items-center gap-4">
          <Button link={{ to: "/" }}>Link</Button>
          <Button link={{ to: "/", target: "_blank" }}>Link on new tab</Button>
          <Button link={{ href: "https://www.google.com", target: "_blank" }}>External link on new tab</Button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <Typography
          as="h2"
          size="title-3"
        >
          Special Button Components
        </Typography>

        <div className="flex flex-row items-center gap-4">
          <IconButton
            icon={X}
            label="Close"
          />
          {/* InlineIconButton is a button that is used to display an icon only with no background color */}
          <InlineIconButton
            icon={X}
            label="Close"
          />
          <PillButton>Pill</PillButton>
          <TextButton>Text</TextButton>
          <ToggleButton
            isSelected={isToggleButtonToggled}
            onPress={() => setIsToggleButtonToggled(!isToggleButtonToggled)}
          >
            Toggle
          </ToggleButton>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/(public)/code-examples/buttons")({
  component: ButtonExamplesPage,
});
