import { Typography, type TypographyProps } from "@povio/ui";

interface RequiredLabelProps extends Omit<TypographyProps, "size" | "variant"> {
  size?: TypographyProps["size"];
  variant?: TypographyProps["variant"];
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
        <span className="ml-1 text-text-error-3">*</span>
      </Typography>
    </div>
  );
}
