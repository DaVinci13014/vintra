"use client";

import { MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { COUNTRY_OPTIONS } from "@/features/onboarding/model";
import { Input } from "@/shared/ui";

type CountryComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CountryCombobox({ value, onChange }: CountryComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filteredCountries = useMemo(() => {
    const query = normalize(value);
    if (!query) return COUNTRY_OPTIONS.slice(0, 8);
    return COUNTRY_OPTIONS.filter((country) => normalize(country).includes(query)).slice(0, 8);
  }, [value]);

  return (
    <div className="relative max-w-lg">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-4 z-10 text-muted"
        size={20}
      />
      <Input
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="country-listbox"
        aria-autocomplete="list"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        placeholder="Rechercher un pays..."
        autoComplete="country-name"
        className="h-14 pl-12"
      />

      {isOpen && filteredCountries.length > 0 && (
        <div
          id="country-listbox"
          role="listbox"
          className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-elevated p-2 shadow-sm"
        >
          {filteredCountries.map((country) => (
            <button
              key={country}
              type="button"
              role="option"
              aria-selected={value === country}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(country);
                setIsOpen(false);
              }}
              className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-secondary-text outline-none hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand"
            >
              <MapPin aria-hidden="true" size={16} />
              {country}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .trim();
}
