import { Alert, Button, PasswordInput, TextButton, TextInput, Typography, useForm } from "@povio/ui/tanstack";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";
import { UserAuthModels } from "@/openapi/userAuth/userAuth.models";
import { UserAuthQueries } from "@/openapi/userAuth/userAuth.queries";

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateTokens, userPromise } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const registerMutation = UserAuthQueries.useRegister();
  const registerFormSchema = useMemo(
    () =>
      UserAuthModels.UserAuthPasswordRegisterRequestSchema.extend({
        confirmPassword: z.string().min(
          1,
          t(($) => $.auth.register.form.confirmPasswordRequired),
        ),
      }).refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: t(($) => $.auth.register.form.passwordsDoNotMatch),
      }),
    [t],
  );

  const form = useForm({
    zodSchema: registerFormSchema,
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof registerFormSchema>) => {
    setError(null);
    const data: UserAuthModels.UserAuthPasswordRegisterRequest = {
      email: formData.email,
      name: formData.name,
      password: formData.password,
    };

    try {
      const tokens = await registerMutation.mutateAsync({ data });
      updateTokens?.(tokens.accessToken, tokens.refreshToken);
      const user = await userPromise?.();
      if (user === null) {
        throw new Error(t(($) => $.auth.register.form.registrationFailed));
      }
      await navigate({ to: "/" });
    } catch (error) {
      setError(error instanceof Error ? error.message : t(($) => $.auth.register.form.registrationFailed));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Typography
        variant="prominent-1"
        size="title-2"
        as="h2"
        className="text-center text-text-default-1"
      >
        {t(($) => $.auth.register.form.title)}
      </Typography>

      {error && (
        <Alert
          color="error"
          text={error}
        />
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
      >
        <div className="flex flex-col gap-4">
          <TextInput
            field={{ form, name: "email" }}
            label={t(($) => $.auth.register.form.email)}
            placeholder={t(($) => $.auth.register.form.emailPlaceholder)}
          />

          <TextInput
            field={{ form, name: "name" }}
            label={t(($) => $.auth.register.form.name)}
            placeholder={t(($) => $.auth.register.form.namePlaceholder)}
          />

          <PasswordInput
            field={{ form, name: "password" }}
            label={t(($) => $.auth.register.form.password)}
            placeholder={t(($) => $.auth.register.form.passwordPlaceholder)}
          />

          <div className="flex flex-col gap-2">
            <PasswordInput
              field={{ form, name: "confirmPassword" }}
              label={t(($) => $.auth.register.form.confirmPassword)}
              placeholder={t(($) => $.auth.register.form.confirmPasswordPlaceholder)}
            />

            <Typography
              size="label-2"
              className="text-text-default-2"
            >
              {t(($) => $.auth.register.form.passwordRequirements)}
            </Typography>
          </div>
        </div>

        <Button
          width="fill"
          type="submit"
          isDisabled={registerMutation.isPending}
          isLoading={registerMutation.isPending}
        >
          {t(($) => $.auth.register.form.submit)}
        </Button>
      </form>

      <div className="flex justify-center gap-1">
        <Typography
          size="label-2"
          className="text-text-default-2"
        >
          {t(($) => $.auth.register.form.hasAccount)}
        </Typography>

        <TextButton link={{ to: "/login" }}>{t(($) => $.auth.register.form.loginLink)}</TextButton>
      </div>
    </div>
  );
}
