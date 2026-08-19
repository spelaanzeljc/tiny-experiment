import { Button, TextInput, Typography, useForm, useToast } from "@povio/ui/tanstack";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import { PageHeader } from "@/components/shared/page/PageHeader";
import { Card } from "@/components/shared/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { UserModels } from "@/openapi/user/user.models";
import { UserQueries } from "@/openapi/user/user.queries";

export function ProfilePage() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { successToast, errorToast } = useToast();

  const { data: fetchedUser, isLoading } = UserQueries.useGet({ enabled: isAuthenticated });
  const fullUser = fetchedUser ?? user;
  const updateProfile = UserQueries.useUpdate();

  const form = useForm({
    zodSchema: UserModels.UserMeUpdateRequestSchema,
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (fullUser) {
      form.reset({
        name: fullUser.name ?? "",
        email: fullUser.email ?? "",
      });
    }
  }, [form, fullUser]);

  const onSubmit = async (data: UserModels.UserMeUpdateRequest) => {
    try {
      await updateProfile.mutateAsync({ data });
      successToast({ text: t(($) => $.profile.form.notifications.success) });
    } catch {
      errorToast({ text: t(($) => $.profile.form.notifications.error) });
    }
  };

  if (isLoading && !fullUser) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t(($) => $.profile.form.title)} />

      <Card>
        <div className="flex flex-col gap-4">
          <Typography
            size="body-3"
            className="text-text-default-2"
          >
            {t(($) => $.profile.form.description)}
          </Typography>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <TextInput
              field={{ form, name: "email" }}
              label={t(($) => $.profile.form.email)}
              placeholder={t(($) => $.profile.form.emailPlaceholder)}
            />
            <TextInput
              field={{ form, name: "name" }}
              label={t(($) => $.profile.form.name)}
              placeholder={t(($) => $.profile.form.namePlaceholder)}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                size="s"
                icon={Check}
                isDisabled={updateProfile.isPending}
                isLoading={updateProfile.isPending}
              >
                {updateProfile.isPending ? t(($) => $.profile.form.submitLoading) : t(($) => $.profile.form.submit)}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
