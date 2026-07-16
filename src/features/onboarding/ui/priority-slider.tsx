type PrioritySliderProps = {
  value: number | null;
  onChange: (value: number) => void;
};

export function PrioritySlider({ value, onChange }: PrioritySliderProps) {
  const currentValue = value ?? 5;

  return (
    <div className="max-w-lg rounded-2xl border border-border bg-card p-5">
      <div className="mb-5 flex items-end justify-between gap-4">
        <span className="text-sm text-secondary-text">Importance</span>
        <span className="font-mono text-3xl font-semibold">{currentValue}/10</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        value={currentValue}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-brand"
        aria-label="Importance de l’objectif"
      />
      <div className="mt-3 flex justify-between text-xs text-muted">
        <span>Peu important</span>
        <span>Priorité absolue</span>
      </div>
    </div>
  );
}
