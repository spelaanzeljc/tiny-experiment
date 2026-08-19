import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { RegisterPage } from "@/components/features/auth/RegisterPage";
import { AppHead } from "@/components/shared/head/AppHead";

function PageComponent() {
  const { t } = useTranslation();

  return (
    <>
      <AppHead
        title={t(($) => $.auth.register.head.title)}
        description={t(($) => $.auth.register.head.description)}
      />
      <RegisterPage />
    </>
  );
}

export const Route = createFileRoute("/(guest)/register")({
  component: PageComponent,
});
