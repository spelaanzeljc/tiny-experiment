import { router } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { UserAuthApi } from "@/api/userAuth/userAuth.api";
import { UserAuthModels } from "@/api/userAuth/userAuth.models";
import { Box, Button, Input, Text } from "@povio/rn-ui";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { Card } from "@/modules/tiny/components/Card";
import { Screen } from "@/modules/tiny/components/Screen";

const registerFormSchema = UserAuthModels.UserAuthPasswordRegisterRequestSchema.extend({
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

type RegisterFormValue = z.infer<typeof registerFormSchema>;

export default function Register() {
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<RegisterFormValue>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      name: null,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData: RegisterFormValue) => {
    setError(null);
    const { confirmPassword: _confirmPassword, ...data } = formData;

    try {
      const tokens = await UserAuthApi.register(data);
      login(tokens.accessToken);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to register");
    }
  };

  return (
    <Screen>
      <Box
        flex={1}
        justifyContent="center"
        gap="5"
      >
        <Text
          variant="title-1-prominent-1"
          color="text-default-primary"
          textAlign="center"
        >
          Create account
        </Text>

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
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            formControl={control}
            name="name"
            label="Name"
            placeholder="Your name"
          />
          <Input
            formControl={control}
            name="password"
            label="Password"
            placeholder="At least 12 characters"
            secureTextEntry
          />
          <Input
            formControl={control}
            name="confirmPassword"
            label="Confirm password"
            placeholder="Repeat password"
            secureTextEntry
          />

          <Button
            label="Register"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
          <Button
            label="Back to login"
            variant="outlined"
            onPress={() => router.back()}
          />
        </Card>
      </Box>
    </Screen>
  );
}
