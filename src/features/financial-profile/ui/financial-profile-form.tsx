"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { financialProfileInputSchema, updateFinancialProfile, type FinancialProfileInput } from "@/features/financial-profile/client";
import { Button, Field, Input } from "@/shared/ui";

const EXPENSES: Array<{ key: keyof FinancialProfileInput; label: string }> = [
  { key: "housingExpense", label: "Logement" }, { key: "foodExpense", label: "Alimentation" },
  { key: "transportExpense", label: "Transport" }, { key: "restaurantExpense", label: "Restaurants" },
  { key: "shoppingExpense", label: "Shopping" }, { key: "hobbyExpense", label: "Loisirs" },
  { key: "subscriptionExpense", label: "Abonnements" },
];

export function FinancialProfileForm({ initialValues, currency }: { initialValues: FinancialProfileInput; currency: string }) {
  const router = useRouter(); const [values, setValues] = useState(initialValues); const [error, setError] = useState<string | null>(null); const [isPending, startTransition] = useTransition();
  function amount(key: keyof FinancialProfileInput, value: string) { setValues({ ...values, [key]: Number(value) }); setError(null); }
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const parsed = financialProfileInputSchema.safeParse(values); if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Vérifiez les montants."); return; } startTransition(async () => { const response = await updateFinancialProfile(parsed.data); if (!response.success) { setError(response.error.message); return; } router.push(response.data.destination); router.refresh(); }); }
  return <form className="grid gap-8" onSubmit={submit} noValidate>
    <Section title="Revenus" description="Vos rentrées mensuelles nettes moyennes."><Field label="Fréquence des revenus" htmlFor="incomeFrequency"><select id="incomeFrequency" value={values.incomeFrequency} onChange={(event) => setValues({ ...values, incomeFrequency: event.target.value as FinancialProfileInput["incomeFrequency"] })} className="h-12 w-full rounded-xl border border-border bg-card px-4"><option value="MONTHLY">Mensuelle</option><option value="BIWEEKLY">Toutes les deux semaines</option><option value="WEEKLY">Hebdomadaire</option><option value="VARIABLE">Variable</option></select></Field><AmountField id="monthlyIncome" label="Revenu principal" value={values.monthlyIncome} currency={currency} onChange={(value) => amount("monthlyIncome", value)} /><AmountField id="additionalIncome" label="Revenus complémentaires" value={values.additionalIncome} currency={currency} onChange={(value) => amount("additionalIncome", value)} /></Section>
    <Section title="Dépenses mensuelles" description="Mettez à jour vos moyennes réelles."><div className="grid gap-5 sm:grid-cols-2">{EXPENSES.map(({ key, label }) => <AmountField key={key} id={key} label={label} value={Number(values[key])} currency={currency} onChange={(value) => amount(key, value)} />)}</div></Section>
    <Section title="Épargne" description="Une modification créera un nouveau point dans votre historique."><AmountField id="currentSavings" label="Épargne actuelle" value={values.currentSavings} currency={currency} onChange={(value) => amount("currentSavings", value)} /><AmountField id="monthlySavings" label="Épargne mensuelle habituelle" value={values.monthlySavings} currency={currency} onChange={(value) => amount("monthlySavings", value)} /></Section>
    {error && <p className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger" role="alert">{error}</p>}
    <div className="sticky bottom-4 rounded-2xl border border-border bg-background/90 p-3 backdrop-blur"><Button type="submit" size="lg" className="w-full" disabled={isPending}>{isPending ? "Nouvelle analyse en cours..." : "Enregistrer et recalculer"}</Button></div>
  </form>;
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="rounded-3xl border border-border bg-surface p-5 sm:p-8"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-secondary-text">{description}</p><div className="mt-6 grid gap-5">{children}</div></section>; }
function AmountField({ id, label, value, currency, onChange }: { id: string; label: string; value: number; currency: string; onChange: (value: string) => void }) { return <Field label={`${label} (${currency})`} htmlFor={id}><Input id={id} type="number" inputMode="decimal" min={0} step="0.01" value={value} onChange={(event) => onChange(event.target.value)} required /></Field>; }
