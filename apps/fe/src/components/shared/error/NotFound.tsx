import { Button, Typography } from "@povio/ui";
import { useTranslation } from "react-i18next";

import { ThinPageWrapper } from "@/components/shared/layout/ThinPageWrapper";

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <ThinPageWrapper>
      <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
        <Typography
          size="title-1"
          variant="prominent-1"
          as="h2"
        >
          {t(($) => $.shared.notFound.heading)}
        </Typography>

        <Typography
          size="body-2"
          className="text-center text-text-error-1"
        >
          {t(($) => $.shared.notFound.subheading)}
        </Typography>

        <Button
          size="s"
          link={{ to: "/" }}
        >
          {t(($) => $.shared.notFound.homeBtn)}
        </Button>
      </div>
    </ThinPageWrapper>
  );
};
