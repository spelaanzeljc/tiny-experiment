import { Typography } from "@povio/ui";
import { clsx } from "clsx";

interface Props {
  error?: string;
  isDisabled?: boolean;
  isHidden?: boolean;
  className?: string;
}

export const ErrorText = ({ error, isDisabled, isHidden, className }: Props) => {
  return (
    <Typography
      className={clsx("text-text-error-1", !error || isDisabled || isHidden ? "sr-only" : "mt-1-5", className)}
      size="label-3"
    >
      {error}
    </Typography>
  );
};
