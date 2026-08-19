import { Typography, type TypographyProps } from "@povio/ui";
import type { ComponentProps } from "react";

interface RequiredLabelProps extends Omit<TypographyProps, "variant" | "size"> {
  variant?: ComponentProps<typeof Typography>["variant"];
  size?: ComponentProps<typeof Typography>["size"];
}

export function RequiredLabel({ variant = "prominent-1", size = "label-1", children, ...props }: RequiredLabelProps) {
  return (
    <div className="flex items-center">
      <Typography
        variant={variant}
        size={size}
        {...props}
      >
        {children}
        <span className="text-text-error-3">*</span>
      </Typography>
    </div>
  );
}
