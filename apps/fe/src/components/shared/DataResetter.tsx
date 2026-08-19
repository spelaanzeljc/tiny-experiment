import { Confirmation, TextButton } from "@povio/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/useAuth";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/config/jwt.config";

import { resetStore } from "~/db/store";
import { clearMediaBlobStorage } from "~/media/blob-storage";

export function DataResetter() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { confirm } = Confirmation.useConfirmation();
  const { logout, isAuthenticated } = useAuth();

  const handleReset = async () => {
    const ok = await confirm({
      heading: t(($) => $.shared.seedData.confirmation.heading),
      description: t(($) => $.shared.seedData.confirmation.description),
      confirmLabel: t(($) => $.shared.seedData.confirmation.confirm),
      cancelLabel: t(($) => $.shared.seedData.confirmation.cancel),
      textAlign: "center",
      cancelVariant: "subtle",
      buttonSize: "s",
    });
    if (ok) {
      resetStore();
      await clearMediaBlobStorage();
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      queryClient.clear();
      if (isAuthenticated) {
        logout();
      }
    }
  };

  return (
    <TextButton
      onPress={handleReset}
      className="text-label-2 text-text-default-2"
    >
      {t(($) => $.shared.seedData.actionButton)}
    </TextButton>
  );
}
