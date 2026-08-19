import { Alert, Button, PasswordInput, TextButton, TextInput, Typography, useForm } from "@povio/ui/tanstack";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DataResetter } from "@/components/shared/DataResetter";
import { useAuth } from "@/hooks/useAuth";
import { UserAuthModels } from "@/openapi/userAuth/userAuth.models";
import { UserAuthQueries } from "@/openapi/userAuth/userAuth.queries";

import { DEMO_LOGIN } from "~/db/tables/user/user.seed";

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateTokens, userPromise } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const loginMutation = UserAuthQueries.useUserAuthLocalPasswordLogin();

  const form = useForm({
    zodSchema: UserAuthModels.UserAuthPasswordLoginRequestSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const completeLogin = async (tokens: UserAuthModels.AuthnTokenResponse) => {
    updateTokens?.(tokens.accessToken, tokens.refreshToken);
    const user = await userPromise?.();
    if (user === null) {
      throw new Error(t(($) => $.auth.login.form.loginFailed));
    }
    await navigate({ to: "/" });
  };

  const onSubmit = async (data: UserAuthModels.UserAuthPasswordLoginRequest) => {
    setError(null);
    try {
      const tokens = await loginMutation.mutateAsync({ data });
      await completeLogin(tokens);
    } catch (error) {
      setError(error instanceof Error ? error.message : t(($) => $.auth.login.form.loginFailed));
    }
  };

  const onDemoLogin = async () => {
    setError(null);

    try {
      const tokens = await loginMutation.mutateAsync({
        data: { email: DEMO_LOGIN.email, password: DEMO_LOGIN.password },
      });
      await completeLogin(tokens);
    } catch (error) {
      setError(error instanceof Error ? error.message : t(($) => $.auth.login.form.loginFailed));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Typography
          variant="prominent-1"
          size="title-2"
          as="h2"
          className="text-text-default-1"
        >
          {t(($) => $.auth.login.form.title)}
        </Typography>
      </div>

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
            label={t(($) => $.auth.login.form.email)}
            placeholder={t(($) => $.auth.login.form.emailPlaceholder)}
            size="default"
          />

          <PasswordInput
            field={{ form, name: "password" }}
            label={t(($) => $.auth.login.form.password)}
            placeholder={t(($) => $.auth.login.form.passwordPlaceholder)}
            size="default"
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button
            width="fill"
            type="submit"
            isDisabled={loginMutation.isPending}
            isLoading={loginMutation.isPending}
          >
            {t(($) => $.auth.login.form.submit)}
          </Button>

          <Button
            width="fill"
            type="button"
            variant="outlined"
            isDisabled={loginMutation.isPending}
            onPress={onDemoLogin}
          >
            {t(($) => $.auth.login.form.demoLogin)}
          </Button>
        </div>
      </form>

      <div className="flex justify-center gap-1 border-elevation-outline-default-1 border-t pt-6">
        <Typography
          size="label-2"
          className="text-text-default-2"
        >
          {t(($) => $.auth.login.form.noAccount)}
        </Typography>

        <TextButton link={{ to: "/register" }}>{t(($) => $.auth.login.form.registerLink)}</TextButton>
      </div>

      <div className="flex justify-center">
        <DataResetter />
      </div>
    </div>
  );
}
