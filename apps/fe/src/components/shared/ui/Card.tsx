import { Typography, type TypographyProps } from "@povio/ui";
import { type VariantProps, cva } from "class-variance-authority";

const cardVariants = cva(
  "flex flex-1 flex-col gap-5 rounded-sm border-elevation-outline-default-1 border-b bg-elevation-fill-default-1 shadow-1",
  {
    variants: {
      padding: {
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
      },
    },
    defaultVariants: {
      padding: "md",
    },
  },
);

interface CardVariantProps extends VariantProps<typeof cardVariants>, React.HTMLAttributes<HTMLDivElement> {}

export interface CardProps extends CardVariantProps {
  children: React.ReactNode;
  title?: string;
  titleSize?: TypographyProps["size"];
  titleVariant?: TypographyProps["variant"];
  isDisabled?: boolean;
}

export function Card({
  children,
  className,
  padding,
  title,
  titleSize = "title-5",
  titleVariant = "prominent-1",
  isDisabled = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cardVariants({
        padding,
        className: [className, isDisabled && "pointer-events-none opacity-50"],
      })}
    >
      {title && (
        <Typography
          size={titleSize}
          variant={titleVariant}
          {...props}
        >
          {title}
        </Typography>
      )}

      {children}
    </div>
  );
}
