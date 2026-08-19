import { Typography } from "@povio/ui";
import { useTranslation } from "react-i18next";

interface PlanetsTableSummaryProps {
  displayedCount: number;
  totalCount: number;
}

export function PlanetsTableSummary({ displayedCount, totalCount }: PlanetsTableSummaryProps) {
  const { t } = useTranslation();

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-sticky flex min-h-10 justify-end gap-2 border-elevation-outline-default-1 border-t bg-elevation-fill-default-1 px-2 py-3 shadow-1">
      {displayedCount >= totalCount ? (
        <Typography size="label-3">{t(($) => $.planets.table.allLoaded)}</Typography>
      ) : null}
      <Typography
        className="text-text-default-3"
        size="label-3"
      >
        {t(($) => $.planets.table.showing, { displayed: displayedCount, total: totalCount })}
      </Typography>
    </div>
  );
}
