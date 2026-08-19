import { Menu, TextButton } from "@povio/ui";
import { useNavigate } from "@tanstack/react-router";
import { User } from "lucide-react";
import type { Key } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/useAuth";

import { NavLink } from "./NavLink";

export function MobileNavigation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const accountLabel = user?.name || user?.email || t(($) => $.layout.header.profile);

  const handleMenuAction = (key: Key) => {
    if (key === "profile") {
      navigate({ to: "/profile" });
    } else if (key === "logout") {
      logout();
    }
  };

  return (
    <div className="-mx-4 flex w-[calc(100%+2rem)] basis-full flex-col gap-2 border-elevation-outline-default-1 border-t px-4 py-3 lg:hidden">
      <nav className="flex flex-col gap-1">
        <NavLink to="/">{t(($) => $.layout.header.nav.home)}</NavLink>
        <NavLink to="/planets">{t(($) => $.layout.header.nav.planets)}</NavLink>
        <NavLink to="/planets-feed">{t(($) => $.layout.header.nav.planetsFeed)}</NavLink>
      </nav>

      {isAuthenticated ? (
        <Menu
          items={[
            { id: "profile", label: t(($) => $.layout.header.profile) },
            { id: "logout", label: t(($) => $.layout.header.logout) },
          ]}
          trigger={
            <TextButton
              className="mr-auto"
              color="secondary"
              icon={User}
            >
              {accountLabel}
            </TextButton>
          }
          onAction={handleMenuAction}
        />
      ) : null}
    </div>
  );
}
