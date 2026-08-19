import clsx from "clsx";
import type { HTMLAttributes } from "react";

export function TableActions({ children, className, onClick, onKeyDown, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      role="presentation"
      className={clsx("flex items-center justify-end gap-1", className)}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
        onKeyDown?.(event);
      }}
    >
      {children}
    </div>
  );
}
