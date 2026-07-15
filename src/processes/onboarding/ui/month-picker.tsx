"use client";

import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/shared/ui";

type MonthPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const monthOptions = useMemo(() => getMonthOptions(), []);
  const filteredMonths = useMemo(() => {
    const normalizedQuery = normalize(query);

    if (!normalizedQuery) return monthOptions.slice(0, 8);

    return monthOptions
      .filter((option) => normalize(option.label).includes(normalizedQuery))
      .slice(0, 8);
  }, [monthOptions, query]);
  const selectedLabel = monthOptions.find((option) => option.value === value)?.label ?? "";

  return (
    <div className="relative max-w-lg">
      <CalendarDays
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-4 z-10 text-muted"
        size={20}
      />
      <Input
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="goal-month-listbox"
        aria-autocomplete="list"
        value={isOpen ? query : selectedLabel}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setIsOpen(true);
        }}
        onBlur={() => {
          setQuery("");
          setIsOpen(false);
        }}
        placeholder="Rechercher un mois ou une année..."
        autoComplete="off"
        className="h-14 pl-12"
        aria-label="Mois et année de l’objectif"
      />

      {isOpen && filteredMonths.length > 0 && (
        <div
          id="goal-month-listbox"
          role="listbox"
          className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-elevated p-2 shadow-sm"
        >
          {filteredMonths.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(option.value);
                setQuery("");
                setIsOpen(false);
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-secondary-text outline-none hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
            >
              <CalendarDays aria-hidden="true" size={16} />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getMonthOptions() {
  const date = new Date();
  date.setMonth(date.getMonth() + 1, 1);

  return Array.from({ length: 360 }, (_, index) => {
    const optionDate = new Date(date.getFullYear(), date.getMonth() + index, 1);

    return {
      value: `${optionDate.getFullYear()}-${String(optionDate.getMonth() + 1).padStart(2, "0")}`,
      label: new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric",
      }).format(optionDate),
    };
  });
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim();
}
