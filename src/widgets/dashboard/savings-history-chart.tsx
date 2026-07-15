"use client";

import { PiggyBank } from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

type SavingsPoint = { amount: number; recordedAt: string };
type Period = 1 | 3 | 6 | 12;

export function SavingsHistoryChart({
  data,
  currency,
}: {
  data: SavingsPoint[];
  currency: string;
}) {
  const [period, setPeriod] = useState<Period>(6);
  const visibleData = useMemo(() => filterPeriod(data, period), [data, period]);
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency],
  );

  return (
    <section
      className="rounded-3xl border border-border bg-surface p-5 sm:p-7"
      aria-labelledby="history-title"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-brand">Votre progression</p>
          <h2 id="history-title" className="mt-1 text-xl font-semibold">
            Évolution de l’épargne
          </h2>
        </div>
        <div
          className="flex rounded-xl border border-border bg-card p-1"
          aria-label="Période du graphique"
        >
          {([1, 3, 6, 12] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              aria-pressed={period === value}
              className={`min-h-9 rounded-lg px-3 text-xs font-medium transition ${period === value ? "bg-foreground text-background" : "text-secondary-text hover:text-foreground"}`}
            >
              {value} m
            </button>
          ))}
        </div>
      </div>

      {visibleData.length < 2 ? (
        <div className="mt-6 grid min-h-64 place-items-center rounded-2xl border border-dashed border-border bg-card/40 px-5 text-center">
          <div className="max-w-sm">
            <PiggyBank className="mx-auto text-brand" size={28} aria-hidden="true" />
            <h3 className="mt-4 font-semibold">Votre historique commence ici</h3>
            <p className="mt-2 text-sm leading-6 text-secondary-text">
              Une deuxième mise à jour de votre épargne permettra d’afficher son évolution dans le
              temps.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="mt-6 h-64 w-full"
          role="img"
          aria-label="Courbe d’évolution de votre épargne"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visibleData} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
              <XAxis
                dataKey="recordedAt"
                tickFormatter={formatAxisDate}
                axisLine={false}
                tickLine={false}
                minTickGap={32}
                tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ stroke: "var(--border)" }}
                labelFormatter={(value) => formatFullDate(String(value))}
                formatter={(value) => [formatter.format(Number(value)), "Épargne"]}
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--text-primary)",
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--brand)"
                strokeWidth={3}
                fill="var(--brand)"
                fillOpacity={0.12}
                activeDot={{
                  r: 5,
                  fill: "var(--brand)",
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

function filterPeriod(data: SavingsPoint[], period: Period) {
  const newestPoint = data[data.length - 1];
  if (!newestPoint) return [];
  const threshold = new Date(newestPoint.recordedAt);
  threshold.setMonth(threshold.getMonth() - period);
  return data.filter((point) => new Date(point.recordedAt) >= threshold);
}

function formatAxisDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(new Date(value));
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
