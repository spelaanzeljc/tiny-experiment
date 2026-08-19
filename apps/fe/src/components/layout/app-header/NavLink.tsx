import { Link, type LinkProps, Typography } from "@povio/ui";
import { useMatchRoute } from "@tanstack/react-router";
import clsx from "clsx";

export function NavLink({ to, children, ...props }: LinkProps) {
  const matchRoute = useMatchRoute();
  const isActive = Boolean(matchRoute({ to, fuzzy: true }));

  return (
    <Link
      to={to}
      className={clsx(
        "no-underline! flex min-h-auto items-center rounded-xs px-button-side-xs py-button-height-xs font-medium transition-colors",
        isActive
          ? "bg-elevation-fill-default-4 font-semibold text-interactive-text-primary-idle"
          : "text-text-default-2 hover:bg-elevation-fill-default-2 hover:text-text-default-1",
      )}
      {...props}
    >
      <Typography
        className="relative whitespace-nowrap no-underline! after:invisible after:block after:h-0 after:overflow-hidden after:font-semibold after:content-[attr(data-text)]"
        size="label-2"
        data-text={children}
      >
        {children}
      </Typography>
    </Link>
  );
}
