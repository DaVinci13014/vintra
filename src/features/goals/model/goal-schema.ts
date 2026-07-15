import { z } from "zod";

export const goalInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Indiquez le nom de l’objectif.")
    .max(80, "Le nom est trop long."),
  description: z.string().trim().max(250, "La description ne doit pas dépasser 250 caractères."),
  targetAmount: z.number().finite().min(100, "Le montant minimum est de 100 €.").max(100_000_000),
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .refine(isFutureMonth, "Choisissez un mois à venir."),
});

export type GoalInput = z.infer<typeof goalInputSchema>;

function isFutureMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  if (!year || !month || month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1);
}
