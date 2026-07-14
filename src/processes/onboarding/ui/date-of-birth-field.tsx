"use client";

import { useState } from "react";

import { Input } from "@/shared/ui";

type DateOfBirthFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DateOfBirthField({ value, onChange }: DateOfBirthFieldProps) {
  const initialParts = value.split("-");
  const [day, setDay] = useState(initialParts[2] ?? "");
  const [month, setMonth] = useState(initialParts[1] ?? "");
  const [year, setYear] = useState(initialParts[0] ?? "");
  const maximumYear = new Date().getFullYear() - 18;

  function updateDate(nextDay: string, nextMonth: string, nextYear: string) {
    if (nextDay.length === 2 && nextMonth.length === 2 && nextYear.length === 4) {
      onChange(`${nextYear}-${nextMonth}-${nextDay}`);
      return;
    }

    onChange("");
  }

  return (
    <div className="grid max-w-lg grid-cols-[0.8fr_0.8fr_1.4fr] gap-3">
      <DatePartInput
        label="Jour"
        value={day}
        maxLength={2}
        placeholder="JJ"
        onChange={(nextDay) => {
          setDay(nextDay);
          updateDate(nextDay, month, year);
        }}
      />
      <DatePartInput
        label="Mois"
        value={month}
        maxLength={2}
        placeholder="MM"
        onChange={(nextMonth) => {
          setMonth(nextMonth);
          updateDate(day, nextMonth, year);
        }}
      />
      <DatePartInput
        label="Année"
        value={year}
        maxLength={4}
        placeholder="AAAA"
        onChange={(nextYear) => {
          setYear(nextYear);
          updateDate(day, month, nextYear);
        }}
      />
      <p className="col-span-3 text-xs leading-5 text-muted">Année maximale : {maximumYear}</p>
    </div>
  );
}

type DatePartInputProps = {
  label: string;
  value: string;
  maxLength: number;
  placeholder: string;
  onChange: (value: string) => void;
};

function DatePartInput({ label, value, maxLength, placeholder, onChange }: DatePartInputProps) {
  return (
    <label className="grid gap-2 text-xs font-medium text-secondary-text">
      {label}
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, maxLength))}
        inputMode="numeric"
        autoComplete="bday"
        maxLength={maxLength}
        placeholder={placeholder}
        className="h-14 text-center font-mono text-lg"
      />
    </label>
  );
}
