# Vintra — Calculation Engine

Version : 1.0

Status : Approved

---

# Purpose

Le Calculation Engine est responsable de tous les calculs financiers réalisés dans Vintra.

Il transforme les données brutes du profil utilisateur en indicateurs exploitables par le moteur d'analyse.

Tous les calculs doivent être :

- déterministes ;
- reproductibles ;
- indépendants de l'interface utilisateur ;
- exécutés côté serveur.

Le Calculation Engine ne prend aucune décision métier.

Il fournit uniquement des valeurs calculées.

---

# Scope

Ce document couvre :

- Calcul des revenus
- Calcul des dépenses
- Capacité d'épargne
- Taux d'épargne
- Reste à vivre
- Faisabilité des objectifs
- Progression
- Scores financiers

---

# Out of Scope

Ce document ne couvre pas :

- Les recommandations
- Le Dashboard
- L'affichage
- Les notifications

---

# Calculation Pipeline

```
Profile Data

↓

Validation

↓

Normalization

↓

Financial Calculations

↓

Score Calculations

↓

Saving Plan

↓

Analysis Engine
```

---

# Currency Rules

Tous les montants sont stockés sous forme décimale.

Format :

```ts
number
```

Toutes les valeurs sont exprimées dans la devise du profil utilisateur.

Les calculs sont toujours effectués avant tout formatage.

---

# Monthly Income

## Formula

```ts
monthlyIncome =
salary +
additionalIncome
```

---

# Monthly Expenses

## Formula

```ts
monthlyExpenses =
housing +
food +
transport +
restaurants +
shopping +
hobbies +
subscriptions
```

---

# Saving Capacity

## Formula

```ts
savingCapacity =
monthlyIncome -
monthlyExpenses
```

---

## Rules

Si le résultat est inférieur à zéro :

```ts
savingCapacity = 0
```

La capacité d'épargne ne peut jamais être négative.

---

# Saving Rate

## Formula

```ts
savingRate =
(savingCapacity / monthlyIncome) * 100
```

---

## Rules

Si :

```ts
monthlyIncome = 0
```

Alors :

```ts
savingRate = 0
```

---

# Remaining Budget

## Formula

```ts
remainingBudget =
monthlyIncome -
monthlyExpenses
```

---

# Expense Ratio

Pourcentage du revenu utilisé pour les dépenses.

```ts
expenseRatio =
(monthlyExpenses / monthlyIncome) * 100
```

---

# Goal Remaining Amount

```ts
remainingAmount =
targetAmount -
currentSavings
```

---

## Rules

Valeur minimale :

```ts
0
```

---

# Estimated Completion

Nombre de mois nécessaires.

```ts
estimatedMonths =
remainingAmount /
recommendedMonthlySaving
```

---

## Rules

Arrondi :

Toujours à l'entier supérieur.

Exemple :

12.2

↓

13 mois

---

# Goal Progress

```ts
progress =
(currentSavings / targetAmount) * 100
```

---

## Rules

Progression maximale :

100 %

---

# Budget Score

Score compris entre :

0

↓

100

Critères :

- dépenses
- revenus
- stabilité

---

# Saving Score

Score basé sur :

- capacité d'épargne
- régularité
- montant épargné

---

# Discipline Score

Critères :

- budget
- achats impulsifs
- consultation bancaire
- paiements fractionnés

---

# Financial Health Score

Le score global est calculé à partir de :

```text
40 %

Saving Score

+

30 %

Budget Score

+

30 %

Discipline Score
```

---

# Difficulty Calculation

Le Saving Plan reçoit un niveau de difficulté.

Critères :

Montant cible

↓

Temps disponible

↓

Capacité d'épargne

↓

Résultat

```
EASY

NORMAL

CHALLENGING

UNREALISTIC
```

---

# Goal Feasibility

Objectif réalisable si :

```ts
recommendedMonthlySaving
<=
savingCapacity
```

Sinon :

Objectif irréaliste.

---

# Financial Stress

Déterminé selon :

- difficulté fin de mois
- capacité d'épargne
- taux d'épargne

Résultat :

LOW

MEDIUM

HIGH

CRITICAL

---

# Financial Profile

Le Calculation Engine fournit les indicateurs.

Le choix du profil financier est réalisé par le Financial Profile Engine.

---

# Precision Rules

Tous les montants :

2 décimales.

Tous les pourcentages :

2 décimales.

Toutes les divisions :

Protection contre la division par zéro.

---

# Validation Rules

Aucun calcul ne doit être effectué si :

- revenu manquant
- dépenses manquantes
- objectif manquant

Retourner une erreur métier.

---

# Technical Requirements

Execution

Server Side uniquement.

---

Language

TypeScript

---

Floating Point

Utiliser Decimal.js ou une bibliothèque équivalente pour éviter les erreurs d'arrondi sur les calculs financiers.

---

Performance

Temps maximal :

100 ms

pour un calcul complet.

---

Determinism

À données identiques,

les résultats doivent toujours être identiques.

---

# Suggested Folder Structure

```
lib/

calculation/

income.ts

expenses.ts

saving-capacity.ts

saving-rate.ts

goal-progress.ts

scores.ts

financial-health.ts

index.ts
```

---

# Suggested TypeScript

```ts
interface CalculationResult {

monthlyIncome: number;

monthlyExpenses: number;

savingCapacity: number;

savingRate: number;

remainingBudget: number;

expenseRatio: number;

budgetScore: number;

savingScore: number;

disciplineScore: number;

financialHealthScore: number;

goalProgress: number;

estimatedMonths: number;

}
```

---

# Unit Tests

Chaque formule doit posséder des tests unitaires.

Exemples :

✓ Revenus à zéro.

✓ Dépenses supérieures aux revenus.

✓ Objectif déjà atteint.

✓ Division par zéro.

✓ Revenus complémentaires.

✓ Arrondis.

---

# Acceptance Criteria

✓ Toutes les formules sont déterministes.

✓ Aucun montant négatif.

✓ Gestion des divisions par zéro.

✓ Calculs en moins de 100 ms.

✓ Résultats identiques pour les mêmes données.

✓ Compatible avec l'Analysis Engine.

✓ Couverture des tests unitaires supérieure à 95 %.
