import type { GeneratedRecommendation, RecommendationContext } from "../model/recommendation";

export function generateRecommendations({
  input,
  analysis,
}: RecommendationContext): GeneratedRecommendation[] {
  const recommendations: GeneratedRecommendation[] = [];

  if (analysis.profileType === "FRAGILE") {
    recommendations.push({
      title: "Stabiliser votre budget mensuel",
      description:
        "Vos dépenses atteignent ou dépassent votre capacité actuelle. Commencez par sécuriser les charges essentielles avant d’augmenter votre objectif d’épargne.",
      category: "PROFILE",
      priority: "CRITICAL",
      impact: "VERY_HIGH",
      difficulty: "MEDIUM",
      potentialSaving: 0,
    });
  }

  const discretionary = [
    ["restaurants", input.restaurantExpense],
    ["shopping", input.shoppingExpense],
    ["loisirs", input.hobbyExpense],
  ] as const;
  const [largestLabel, largestAmount] = [...discretionary].sort(
    (left, right) => right[1] - left[1],
  )[0] ?? ["dépenses variables", 0];
  const discretionaryTotal = discretionary.reduce((total, [, amount]) => total + amount, 0);
  if (analysis.monthlyIncome > 0 && discretionaryTotal / analysis.monthlyIncome >= 0.15) {
    const potentialSaving = money(largestAmount * 0.2);
    recommendations.push({
      title: `Réduire vos dépenses de ${largestLabel}`,
      description: `Ce poste représente ${formatMoney(largestAmount)} par mois. Une réduction progressive de 20 % libérerait environ ${formatMoney(potentialSaving)} chaque mois.`,
      category: "EXPENSES",
      priority: "HIGH",
      impact: potentialSaving >= 100 ? "HIGH" : "MEDIUM",
      difficulty: "MEDIUM",
      potentialSaving,
    });
  }

  if (
    input.subscriptionExpense >= 50 ||
    input.subscriptionExpense / analysis.monthlyIncome >= 0.03
  ) {
    const potentialSaving = money(input.subscriptionExpense * 0.2);
    recommendations.push({
      title: "Faire le tri dans vos abonnements",
      description: `Vos abonnements représentent ${formatMoney(input.subscriptionExpense)} par mois. Vérifiez ceux que vous utilisez réellement et supprimez les doublons.`,
      category: "EXPENSES",
      priority: "MEDIUM",
      impact: "MEDIUM",
      difficulty: "EASY",
      potentialSaving,
    });
  }

  if (["OFTEN", "VERY_OFTEN"].includes(input.impulsePurchase)) {
    recommendations.push({
      title: "Instaurer un délai avant les achats imprévus",
      description:
        "Vos achats impulsifs sont fréquents. Attendez 48 heures avant tout achat non essentiel afin de vérifier qu’il correspond toujours à un besoin réel.",
      category: "HABITS",
      priority: "HIGH",
      impact: "HIGH",
      difficulty: "EASY",
      potentialSaving: money((input.shoppingExpense + input.hobbyExpense) * 0.15),
    });
  }

  if (!input.hasBudget) {
    recommendations.push({
      title: "Mettre en place un budget mensuel simple",
      description:
        "Vous n’utilisez pas encore de budget. Fixez une limite pour vos dépenses essentielles, variables et votre épargne dès le début du mois.",
      category: "HABITS",
      priority: "HIGH",
      impact: "HIGH",
      difficulty: "EASY",
      potentialSaving: 0,
    });
  }

  if (["SOMETIMES", "OFTEN"].includes(input.installmentUsage)) {
    recommendations.push({
      title: "Limiter les paiements fractionnés",
      description:
        "Les paiements fractionnés réduisent la visibilité sur les mois suivants. Réservez-les aux achats indispensables déjà prévus dans votre budget.",
      category: "HABITS",
      priority: input.installmentUsage === "OFTEN" ? "HIGH" : "MEDIUM",
      impact: "MEDIUM",
      difficulty: "MEDIUM",
      potentialSaving: 0,
    });
  }

  if (input.bankCheckFrequency === "RARELY") {
    recommendations.push({
      title: "Consulter votre compte chaque semaine",
      description:
        "Un point hebdomadaire court permet de détecter rapidement un dépassement et d’ajuster les dépenses restantes.",
      category: "HABITS",
      priority: "MEDIUM",
      impact: "MEDIUM",
      difficulty: "VERY_EASY",
      potentialSaving: 0,
    });
  }

  if (analysis.savingRate < 10 && analysis.savingCapacity > 0) {
    recommendations.push({
      title: "Automatiser une première épargne",
      description: `Votre capacité estimée est de ${formatMoney(analysis.savingCapacity)} par mois. Programmez un virement de ${formatMoney(analysis.recommendedMonthlySaving)} après chaque rentrée d’argent.`,
      category: "SAVINGS",
      priority: "HIGH",
      impact: "HIGH",
      difficulty: "EASY",
      potentialSaving: analysis.recommendedMonthlySaving,
    });
  }

  if (input.currentSavings < analysis.monthlyExpenses) {
    recommendations.push({
      title: "Construire un fonds de sécurité",
      description: `Votre épargne couvre moins d’un mois de dépenses. Visez d’abord une réserve de ${formatMoney(analysis.monthlyExpenses)} avant d’accélérer les projets moins urgents.`,
      category: "SAVINGS",
      priority: "HIGH",
      impact: "VERY_HIGH",
      difficulty: "MEDIUM",
      potentialSaving: analysis.recommendedMonthlySaving,
    });
  }

  if (analysis.difficulty === "UNREALISTIC") {
    recommendations.push({
      title: "Ajuster la date de votre objectif",
      description:
        "La date choisie demanderait une épargne supérieure à votre capacité estimée. Conservez le montant cible et choisissez une échéance plus progressive.",
      category: "GOAL",
      priority: "CRITICAL",
      impact: "VERY_HIGH",
      difficulty: "EASY",
      potentialSaving: 0,
    });
  }

  return recommendations.sort(compareRecommendations);
}

const PRIORITY_WEIGHT = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 } as const;
const IMPACT_WEIGHT = { VERY_HIGH: 5, HIGH: 4, MEDIUM: 3, LOW: 2, VERY_LOW: 1 } as const;
const DIFFICULTY_WEIGHT = { VERY_EASY: 4, EASY: 3, MEDIUM: 2, HARD: 1 } as const;

function compareRecommendations(left: GeneratedRecommendation, right: GeneratedRecommendation) {
  return (
    IMPACT_WEIGHT[right.impact] - IMPACT_WEIGHT[left.impact] ||
    DIFFICULTY_WEIGHT[right.difficulty] - DIFFICULTY_WEIGHT[left.difficulty] ||
    PRIORITY_WEIGHT[right.priority] - PRIORITY_WEIGHT[left.priority] ||
    left.title.localeCompare(right.title, "fr")
  );
}

function money(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(value)} €`;
}
