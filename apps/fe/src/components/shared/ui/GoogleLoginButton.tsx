import { Button } from "@povio/ui";

import { AppConfig } from "@/config/app.config";

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    window.location.href = AppConfig.auth.googleRedirectUrl;
  };

  return (
    <Button
      size="s"
      width="hug"
      onPress={handleGoogleLogin}
    >
      Continue with Google
    </Button>
  );
}
