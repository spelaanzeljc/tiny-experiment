import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { HomePage } from "@/components/features/home/HomePage";
import { AppHead } from "@/components/shared/head/AppHead";

function PageComponent() {
  const { t } = useTranslation();

  return (
    <>
      <AppHead
        title={t(($) => $.home.head.title)}
        description={t(($) => $.home.head.description)}
      />
      <HomePage />
    </>
  );
}

export const Route = createFileRoute("/(private)/")({
  component: PageComponent,
});
