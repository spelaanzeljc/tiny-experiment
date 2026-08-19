import { Button, useToast } from "@povio/ui";
import { Check } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

function ToastsExamplesPage() {
  const { successToast, errorToast, warningToast, neutralToast } = useToast();

  const handleSuccessToast = () => {
    successToast({ text: "Success", icon: Check, variant: "contained" });
  };

  const handleErrorToast = () => {
    errorToast({ text: "Error", position: "bottom-left" });
  };

  const handleWarningToast = () => {
    warningToast({ text: "Warning", isLoading: true });
  };

  const handleNeutralToast = () => {
    neutralToast({ text: "Info", actions: [{ text: "Action", onPress: () => console.log("Action pressed") }] });
  };

  return (
    <div className="flex gap-4 p-20">
      <Button
        onPress={handleSuccessToast}
        color="success"
      >
        Success
      </Button>
      <Button
        onPress={handleErrorToast}
        color="error"
      >
        Error
      </Button>
      <Button
        onPress={handleWarningToast}
        color="warning"
      >
        Warning
      </Button>
      <Button
        onPress={handleNeutralToast}
        color="secondary"
      >
        Neutral
      </Button>
    </div>
  );
}

export const Route = createFileRoute("/(public)/code-examples/toasts")({
  component: ToastsExamplesPage,
});
