import { NumberUtils } from "@/utils/number.utils";

interface StatProps {
  label: string;
  value: number;
}

export function Stat({ label, value }: StatProps) {
  return (
    <div className="grid grid-cols-[auto_auto] items-baseline gap-x-2 rounded-xs border border-elevation-outline-default-1 bg-elevation-fill-default-2 px-2-5 py-1-5">
      <span className="font-semibold text-label-2 text-text-default-1">{NumberUtils.formatInteger(value)}</span>
      <span className="text-label-3 text-text-default-2">{label}</span>
    </div>
  );
}
