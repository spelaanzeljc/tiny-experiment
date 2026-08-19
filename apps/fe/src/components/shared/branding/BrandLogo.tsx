import clsx from "clsx";
import type { HTMLAttributes } from "react";

export function BrandLogo({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx("inline-flex h-[34px] items-center font-semibold text-xl tracking-tight", className)}
      {...props}
    >
      Tiny
    </span>
  );
}
