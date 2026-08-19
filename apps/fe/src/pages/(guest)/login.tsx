import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { LoginPage } from "@/components/features/auth/LoginPage";
import { AppHead } from "@/components/shared/head/AppHead";

function PageComponent() {
  const { t } = useTranslation();

  return (
    <>
      <AppHead
        title={t(($) => $.auth.login.head.title)}
        description={t(($) => $.auth.login.head.description)}
      />
      <LoginPage />
    </>
  );
}

export const Route = createFileRoute("/(guest)/login")({
  component: PageComponent,
});
