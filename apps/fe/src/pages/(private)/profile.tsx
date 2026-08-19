import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { ProfilePage } from "@/components/features/profile/ProfilePage";
import { AppHead } from "@/components/shared/head/AppHead";

function PageComponent() {
  const { t } = useTranslation();

  return (
    <>
      <AppHead
        title={t(($) => $.profile.head.title)}
        description={t(($) => $.profile.head.description)}
      />
      <ProfilePage />
    </>
  );
}

export const Route = createFileRoute("/(private)/profile")({
  component: PageComponent,
});
