interface ColumnBadgeProps {
  children: string;
  tone: "primary" | "secondary" | "success" | "warning";
}

export function ColumnBadge({ children, tone }: ColumnBadgeProps) {
  const toneClasses = {
    primary: "bg-interactive-subtle-primary-idle text-interactive-subtle-primary-on-idle",
    secondary: "bg-interactive-subtle-secondary-idle text-interactive-subtle-secondary-on-idle",
    success: "bg-interactive-subtle-success-idle text-interactive-subtle-success-on-idle",
    warning: "bg-interactive-subtle-warning-idle text-interactive-subtle-warning-on-idle",
  };

  return <span className={`rounded-xs px-1-5 py-0-5 font-medium text-label-3 ${toneClasses[tone]}`}>{children}</span>;
}
