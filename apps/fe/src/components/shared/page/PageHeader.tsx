import { InlineIconButton, Typography } from "@povio/ui";
import { type LinkProps, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

type PageHeaderBackProps =
  | {
      backLink: LinkProps;
      onBack?: never;
    }
  | {
      backLink?: never;
      onBack: () => void;
    };

interface PageHeaderProps {
  title: ReactNode;
  actions?: ReactNode;
  enableBack?: boolean;
  backProps?: PageHeaderBackProps;
}

export function PageHeader({ title, actions, enableBack = false, backProps }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backProps?.onBack) {
      backProps.onBack();
      return;
    }

    if (window.history.length > 1) {
      router.history.back();
      return;
    }

    if (backProps?.backLink) {
      router.navigate(backProps.backLink);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          {enableBack && (
            <InlineIconButton
              label="Back"
              icon={ChevronLeft}
              color="secondary"
              onPress={handleBack}
            />
          )}

          <Typography
            as="h1"
            size="title-4"
            variant="prominent-1"
            className="min-w-0 text-text-default-1"
          >
            {title}
          </Typography>
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
