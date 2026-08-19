import {
  BottomSheet,
  Button,
  Confirmation,
  Drawer,
  Menu,
  type MenuProps,
  Modal,
  ResponsivePopover,
  Tooltip,
  Typography,
} from "@povio/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const menuItems: MenuProps["items"] = [
  {
    id: "view",
    label: "View details",
  },
  {
    id: "edit",
    label: "Edit item",
  },
  {
    id: "share",
    label: "Share",
    children: [
      {
        id: "share-email",
        label: "Email",
      },
      {
        id: "share-link",
        label: "Copy link",
      },
    ],
  },
  {
    id: "archive",
    label: "Archive",
  },
];

function OverlaysExamplesPage() {
  const { confirm } = Confirmation.useConfirmation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [lastMenuAction, setLastMenuAction] = useState("No menu action selected yet.");

  const handleConfirm = async () => {
    const confirmed = await confirm({
      heading: "Confirmation",
      description: "Are you sure you want to confirm?",
      buttonSize: "m",
      textAlign: "center",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
    });

    if (!confirmed) {
      console.log("Cancelled");
      return;
    }

    console.log("Confirmed");
  };

  return (
    <div className="flex flex-col gap-6 p-20">
      <Typography
        as="h1"
        size="title-4"
      >
        Overlays
      </Typography>

      <div className="flex flex-wrap items-center gap-4">
        <Button onPress={() => setIsModalOpen(true)}>Open Modal</Button>
        <Button onPress={handleConfirm}>Open Confirmation</Button>

        <Drawer
          label="Example drawer"
          trigger={<Button>Open Drawer</Button>}
        >
          {(close) => (
            <div className="flex w-80 flex-col gap-4 p-6">
              <Typography
                as="h2"
                size="title-4"
              >
                Drawer content
              </Typography>
              <Typography
                as="p"
                size="body-2"
              >
                Drawers work well for focused side panels and contextual forms.
              </Typography>
              <Button onPress={close}>Close Drawer</Button>
            </div>
          )}
        </Drawer>

        <BottomSheet
          label="Example bottom sheet"
          trigger={<Button>Open BottomSheet</Button>}
          footer={<Button width="fill">Footer action</Button>}
        >
          {(close) => (
            <div className="flex flex-col gap-4 p-6">
              <Typography
                as="h2"
                size="title-4"
              >
                BottomSheet content
              </Typography>
              <Typography
                as="p"
                size="body-2"
              >
                Bottom sheets are especially useful for compact mobile flows.
              </Typography>
              <Button onPress={close}>Close BottomSheet</Button>
            </div>
          )}
        </BottomSheet>

        <ResponsivePopover
          trigger={<Button>Open ResponsivePopover</Button>}
          isOpen={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          sheetLabel="Responsive popover"
          popoverClassName="w-72"
        >
          <div className="flex flex-col gap-3 p-4">
            <Typography
              as="h2"
              size="title-4"
            >
              Responsive content
            </Typography>
            <Typography
              as="p"
              size="body-2"
            >
              This renders as a popover on larger screens and as a sheet on smaller ones.
            </Typography>
          </div>
        </ResponsivePopover>

        <Tooltip text="Helpful extra context">
          <Button>Hover Tooltip</Button>
        </Tooltip>

        <Menu
          trigger={<Button>Open Menu</Button>}
          items={menuItems}
          placement="bottom start"
          onAction={(key) => setLastMenuAction(`Selected ${String(key)}`)}
        />
      </div>

      <Typography
        as="p"
        size="body-2"
      >
        {lastMenuAction}
      </Typography>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showCloseIcon
      >
        <div className="flex w-[20rem] justify-center">
          <Typography
            as="p"
            size="body-1"
          >
            Modal content
          </Typography>
        </div>
      </Modal>
    </div>
  );
}

export const Route = createFileRoute("/(public)/code-examples/overlays")({
  component: OverlaysExamplesPage,
});
