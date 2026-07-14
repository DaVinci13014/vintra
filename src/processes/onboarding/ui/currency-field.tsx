import { Input } from "@/shared/ui";

type CurrencyFieldProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder: string;
  id?: string;
};

export function CurrencyField({ value, onChange, placeholder, id = "amount" }: CurrencyFieldProps) {
  return (
    <div className="relative max-w-md">
      <Input
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange(parseAmount(event.target.value))}
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        className="h-14 pr-14 font-mono text-lg"
        aria-label="Montant mensuel en euros"
      />
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center font-mono text-secondary-text">
        €
      </span>
    </div>
  );
}

function parseAmount(value: string) {
  const normalizedValue = value
    .replace(/\s/g, "")
    .replace(",", ".")
    .replace(/[^\d.]/g, "");
  if (!normalizedValue) return null;

  const amount = Number(normalizedValue);
  return Number.isFinite(amount) ? amount : null;
}
