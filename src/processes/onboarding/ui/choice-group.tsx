import { Check } from "lucide-react";

import { cn } from "@/shared/lib";
import type { Choice } from "@/processes/onboarding/model";

type ChoiceGroupProps = {
  choices: Choice[];
  value: string;
  onChange: (value: string) => void;
  columns?: 1 | 2;
};

export function ChoiceGroup({ choices, value, onChange, columns = 2 }: ChoiceGroupProps) {
  return (
    <div className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2")} role="radiogroup">
      {choices.map((choice) => {
        const isSelected = value === choice.value;

        return (
          <button
            key={choice.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(choice.value)}
            className={cn(
              "flex min-h-14 items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3 text-left text-sm font-medium outline-none transition duration-150 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isSelected
                ? "border-brand bg-brand/10 text-foreground"
                : "border-border text-secondary-text hover:border-divider hover:bg-elevated hover:text-foreground",
            )}
          >
            <span>{choice.label}</span>
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border",
                isSelected ? "border-brand bg-brand text-brand-foreground" : "border-divider",
              )}
            >
              {isSelected && <Check aria-hidden="true" size={14} strokeWidth={2.5} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
