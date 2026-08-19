import { Button, Menu } from "@povio/ui";
import { ChevronDown } from "lucide-react";
import { type Key, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type PlanetsView = "grid" | "table" | "infinite";

interface PlanetsViewTabsProps {
  value: PlanetsView;
  onChange: (view: PlanetsView) => void;
}

export function PlanetsViewTabs({ value, onChange }: PlanetsViewTabsProps) {
  const { t } = useTranslation();
  const [isCompact, setIsCompact] = useState(false);
  const items: { value: PlanetsView; label: string }[] = [
    { value: "grid", label: t(($) => $.planets.views.grid) },
    { value: "table", label: t(($) => $.planets.views.table) },
    { value: "infinite", label: t(($) => $.planets.views.infinite) },
  ];
  const activeItem = items.find((item) => item.value === value) ?? items[0];

  useEffect(() => {
    const update = () => setIsCompact(window.innerWidth < 850);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (isCompact) {
    return (
      <Menu
        items={items.map((item) => ({ id: item.value, label: item.label }))}
        onAction={(key: Key) => onChange(key as PlanetsView)}
        trigger={
          <Button
            type="button"
            color="primary"
            variant="ghost"
            size="xs"
            toggle
            isSelected
            icon={ChevronDown}
            iconPosition="right"
          >
            {activeItem.label}
          </Button>
        }
      />
    );
  }

  return (
    <div
      aria-label={t(($) => $.planets.views.label)}
      className="flex shrink-0 gap-1"
      role="group"
    >
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <Button
            key={item.value}
            type="button"
            color="primary"
            variant="ghost"
            size="xs"
            toggle
            isSelected={isActive}
            onPress={() => onChange(item.value)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}
