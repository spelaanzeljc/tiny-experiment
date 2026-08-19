import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UserModels } from "@/api/user/user.models";
import { UserQueries } from "@/api/user/user.queries";
import { Box, Button, Input, Text } from "@povio/rn-ui";
import { useAuthStore } from "@/modules/auth/stores/authStore";
import { Card } from "@/modules/tiny/components/Card";
import { PageHeader } from "@/modules/tiny/components/PageHeader";
import { Screen } from "@/modules/tiny/components/Screen";
import { StateView } from "@/modules/tiny/components/StateView";

export default function AccountPage() {
  const logout = useAuthStore((state) => state.logout);
  const { data: user, isLoading } = UserQueries.useGet();
  const updateProfile = UserQueries.useUpdate();
  const [message, setMessage] = useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<UserModels.UserMeUpdateRequest>({
    resolver: zodResolver(UserModels.UserMeUpdateRequestSchema),
    defaultValues: {
      name: null,
      email: null,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? null,
        email: user.email ?? null,
      });
    }
  }, [reset, user]);

  const handleSave = async (data: UserModels.UserMeUpdateRequest) => {
    setMessage(null);
    try {
      await updateProfile.mutateAsync({ data });
      setMessage("Profile saved");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save profile");
    }
  };

  return (
    <Screen>
      <PageHeader
        title="Profile"
        description="Update the same account details used on the web profile screen."
      />

      {isLoading && !user ? (
        <StateView
          loading
          message="Loading profile..."
        />
      ) : (
        <Card>
          {message ? (
            <Text
              variant="body-3-default"
              color={message === "Profile saved" ? "informational-success" : "informational-error"}
            >
              {message}
            </Text>
          ) : null}
          <Input
            formControl={control}
            name="email"
            label="Email"
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            formControl={control}
            name="name"
            label="Name"
            placeholder="Name"
          />
          <Box
            flexDirection="row"
            gap="2"
            flexWrap="wrap"
          >
            <Button
              label="Save"
              loading={updateProfile.isPending}
              disabled={updateProfile.isPending}
              onPress={handleSubmit(handleSave)}
            />
            <Button
              label="Logout"
              variant="outlined"
              onPress={logout}
            />
          </Box>
        </Card>
      )}
    </Screen>
  );
}
