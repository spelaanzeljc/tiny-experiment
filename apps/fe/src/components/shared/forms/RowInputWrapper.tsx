import { Typography, type TypographyProps } from "@povio/ui";
import clsx from "clsx";
import type { ReactNode } from "react";

import { RequiredLabel } from "@/components/shared/forms/RequiredLabel";

interface RowInputWrapperProps {
  label: string;
  children: ReactNode;
  isRequired?: boolean;
  labelClassName?: string;
  labelSize?: TypographyProps["size"];
  variant?: TypographyProps["variant"];
  className?: string;
  fieldClassName?: string;
}

export function RowInputWrapper({
  label,
  children,
  isRequired = false,
  labelClassName = "w-[140px] sm:w-[180px]",
  labelSize = "label-2",
  variant = "default",
  className = "flex min-w-0 items-start",
  fieldClassName,
}: RowInputWrapperProps) {
  return (
    <div className={className}>
      <div className={clsx("flex h-[30px] shrink-0 items-center", labelClassName)}>
        {isRequired ? (
          <RequiredLabel
            size={labelSize}
            variant={variant}
          >
            {label}
          </RequiredLabel>
        ) : (
          <Typography
            size={labelSize}
            variant={variant}
          >
            {label}
          </Typography>
        )}
      </div>
      <div className={clsx("min-w-0 flex-1", fieldClassName)}>{children}</div>
    </div>
  );
}
