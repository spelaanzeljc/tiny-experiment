import { Button, IconButton, Link, Menu } from "@povio/ui";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { ChevronDown, MenuIcon, X } from "lucide-react";
import { type Key, useState } from "react";
import { useTranslation } from "react-i18next";

import { BrandLogo } from "@/components/shared/branding/BrandLogo";
import { useAuth } from "@/hooks/useAuth";

import { MobileNavigation } from "./MobileNavigation";
import { NavLink } from "./NavLink";

export function AppHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: t(($) => $.layout.header.profile), id: "profile" },
    { label: t(($) => $.layout.header.logout), id: "logout" },
  ];

  const accountLabel = user?.name || user?.email || t(($) => $.layout.header.profile);

  const handleMenuAction = (key: Key) => {
    if (key === "profile") {
      navigate({ to: "/profile" });
    } else if (key === "logout") {
      logout();
    }
  };

  return (
    <header
      className={clsx(
        "relative z-11 flex shrink-0 items-center gap-4 border-elevation-outline-default-1 border-b bg-elevation-fill-default-1 px-4",
        isMobileMenuOpen && "flex-wrap",
      )}
    >
      <Link
        to="/"
        aria-label={t(($) => $.layout.header.logo)}
        className="flex shrink-0 items-center no-underline!"
      >
        <BrandLogo className="text-interactive-contained-primary-idle" />
      </Link>

      <div className="hidden min-w-0 lg:block">
        <nav className="flex flex-row items-center gap-1 overflow-visible border-elevation-outline-default-1 px-0">
          <NavLink to="/">{t(($) => $.layout.header.nav.home)}</NavLink>
          <NavLink to="/planets">{t(($) => $.layout.header.nav.planets)}</NavLink>
          <NavLink to="/planets-feed">{t(($) => $.layout.header.nav.planetsFeed)}</NavLink>
        </nav>
      </div>

      {isAuthenticated && (
        <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
          <Menu
            trigger={
              <div className="flex cursor-pointer items-center gap-1">
                <Button
                  type="button"
                  color="secondary"
                  variant="text"
                  size="xs"
                  className="items-center gap-1 overflow-hidden whitespace-nowrap text-text-default-1 [&>span]:font-labels-default!"
                >
                  {accountLabel}
                </Button>
                <ChevronDown className="size-5 shrink-0" />
              </div>
            }
            items={menuItems}
            onAction={handleMenuAction}
          />
        </div>
      )}

      <IconButton
        className="ml-auto lg:hidden"
        color="primary"
        icon={isMobileMenuOpen ? X : MenuIcon}
        label={t(($) => (isMobileMenuOpen ? $.layout.header.closeMenu : $.layout.header.openMenu))}
        size="xs"
        variant="ghost"
        onPress={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
      />
      {isMobileMenuOpen ? <MobileNavigation /> : null}
    </header>
  );
}
