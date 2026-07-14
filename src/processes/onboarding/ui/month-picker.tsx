import { Input } from "@/shared/ui";

type MonthPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  return (
    <Input
      type="month"
      value={value}
      min={getNextMonth()}
      onChange={(event) => onChange(event.target.value)}
      className="h-14 max-w-sm font-mono text-base [color-scheme:dark]"
      aria-label="Mois et année de l’objectif"
    />
  );
}

function getNextMonth() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
