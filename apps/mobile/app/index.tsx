import { Link } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserAuthApi } from "@/api/userAuth/userAuth.api";
import { UserAuthModels } from "@/api/userAuth/userAuth.models";
import { Box, Button, Input, Text } from "@povio/rn-ui";
import { tinyDemoLogin } from "@/constants/tiny";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { Card } from "@/modules/tiny/components/Card";
import { Screen } from "@/modules/tiny/components/Screen";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<UserAuthModels.UserAuthPasswordLoginRequest>({
    resolver: zodResolver(UserAuthModels.UserAuthPasswordLoginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const completeLogin = async (data: { email: string; password: string }) => {
    setError(null);
    try {
      const tokens = await UserAuthApi.userAuthLocalPasswordLogin(data);
      login(tokens.accessToken);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to log in");
    }
  };

  return (
    <Screen>
      <Box
        flex={1}
        justifyContent="center"
        gap="5"
      >
        <Box gap="2">
          <Text
            variant="title-1-prominent-1"
            color="text-default-primary"
            textAlign="center"
          >
            Log in
          </Text>
          <Text
            variant="body-3-default"
            color="text-default-secondary"
            textAlign="center"
          >
            Use your account or the demo credentials to open Tiny Template.
          </Text>
        </Box>

        <Card>
          {error ? (
            <Text
              variant="body-3-default"
              color="informational-error"
            >
              {error}
            </Text>
          ) : null}

          <Input
            formControl={control}
            name="email"
            label="Email"
            placeholder="user@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            formControl={control}
            name="password"
            label="Password"
            placeholder="Password"
            secureTextEntry
          />

          <Button
            label="Log in"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSubmit(completeLogin)}
          />
          <Button
            label="Demo login"
            variant="outlined"
            disabled={isSubmitting}
            onPress={() => completeLogin(tinyDemoLogin)}
          />
        </Card>

        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap="1"
        >
          <Text
            variant="label-2-default"
            color="text-default-secondary"
          >
            No account?
          </Text>
          <Link href="/sign-up">
            <Text
              variant="label-2-prominent-1"
              color="interactive-text-on-bg-2"
            >
              Register
            </Text>
          </Link>
        </Box>
      </Box>
    </Screen>
  );
}
