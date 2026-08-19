import { Typography } from "@povio/ui";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/shared/page/PageHeader";

export function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t(($) => $.home.title)} />

      <Typography
        size="body-2"
        as="p"
      >
        {t(($) => $.home.message)}
      </Typography>
    </div>
  );
}
