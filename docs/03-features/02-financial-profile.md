# Vintra — Financial Profile

Version : 1.0

Status : Approved

---

# Purpose

Le profil financier représente l'identité financière d'un utilisateur.

Il est généré automatiquement par l'Analysis Engine à partir des réponses fournies lors de l'onboarding et des futures mises à jour du profil.

Son objectif est de permettre à Vintra d'adapter toutes ses recommandations à la situation réelle de chaque utilisateur.

Le profil financier est recalculé automatiquement à chaque modification importante.

---

# Scope

Ce document couvre :

- Les profils financiers
- Les scores
- Les critères
- Les règles métier
- Les comportements associés
- Les impacts sur l'application

---

# Out of Scope

Ce document ne couvre pas :

- Les calculs du moteur d'analyse
- Le Dashboard
- Les recommandations détaillées
- Les statistiques

---

# Profile Generation Flow

```
Questionnaire terminé

↓

Analysis Engine

↓

Calcul des indicateurs

↓

Calcul des scores

↓

Attribution du profil

↓

Enregistrement

↓

Utilisation dans l'application
```

---

# Financial Indicators

Chaque profil est construit à partir des indicateurs suivants.

| Indicateur | Description |
|------------|-------------|
| Monthly Income | Revenus mensuels |
| Monthly Expenses | Dépenses mensuelles |
| Saving Capacity | Capacité d'épargne |
| Saving Rate | Taux d'épargne |
| Existing Savings | Épargne actuelle |
| Budget Discipline | Discipline budgétaire |
| Financial Stress | Niveau de stress financier |
| Goal Progress | Progression des objectifs |

---

# Financial Profiles

Vintra définit quatre profils financiers.

---

## PROFILE_001 — Saver

### Description

L'utilisateur possède une excellente gestion financière.

Il épargne régulièrement et contrôle ses dépenses.

---

### Characteristics

- Dépenses maîtrisées
- Objectifs réalistes
- Bonne discipline
- Achats impulsifs rares
- Situation stable

---

### Priority

Optimiser l'épargne.

---

## PROFILE_002 — Balanced

### Description

Situation saine avec plusieurs possibilités d'amélioration.

---

### Characteristics

- Revenus stables
- Quelques dépenses évitables
- Épargne occasionnelle
- Budget relativement suivi

---

### Priority

Développer une routine d'épargne.

---

## PROFILE_003 — Spender

### Description

L'utilisateur dépense une grande partie de ses revenus.

---

### Characteristics

- Dépenses variables importantes
- Achats impulsifs fréquents
- Difficulté à épargner
- Objectifs rarement atteints

---

### Priority

Réduire les dépenses non essentielles.

---

## PROFILE_004 — Fragile

### Description

Situation financière fragile.

---

### Characteristics

- Faible capacité d'épargne
- Difficultés en fin de mois
- Revenus insuffisants face aux dépenses
- Peu ou pas d'épargne

---

### Priority

Stabiliser la situation financière.

---

# Profile Scores

Le moteur attribue plusieurs scores.

## Budget Score

Mesure la qualité de gestion du budget.

Valeur

0 → 100

---

## Savings Score

Mesure la capacité à épargner.

Valeur

0 → 100

---

## Discipline Score

Mesure la régularité financière.

Valeur

0 → 100

---

## Financial Health Score

Score global.

Valeur

0 → 100

---

# Score Interpretation

| Score | Niveau |
|--------|---------|
| 0 - 24 | Très faible |
| 25 - 49 | Faible |
| 50 - 74 | Correct |
| 75 - 100 | Excellent |

---

# Profile Update Triggers

Le profil est recalculé lorsque :

- revenus modifiés ;
- dépenses modifiées ;
- objectif modifié ;
- épargne modifiée ;
- situation professionnelle modifiée.

---

# Application Usage

Le profil est utilisé pour :

- personnaliser le Dashboard ;
- personnaliser les recommandations ;
- adapter les conseils ;
- définir les priorités.

---

# Business Rules

## BR-001

Chaque utilisateur possède un seul profil actif.

---

## BR-002

Le profil est toujours recalculé après une modification importante.

---

## BR-003

Le profil est déterminé uniquement à partir des données utilisateur.

---

## BR-004

Le profil n'est jamais modifiable manuellement.

---

## BR-005

Un historique des profils précédents est conservé afin de suivre l'évolution de l'utilisateur.

---

# Technical Requirements

Execution

Server Side

---

Trigger

Analysis Engine

---

Persistence

Le profil est enregistré après chaque analyse.

---

History

Chaque version précédente est conservée.

---

# Suggested TypeScript

```ts
interface FinancialProfile {

id: string;

profile:
| "SAVER"
| "BALANCED"
| "SPENDER"
| "FRAGILE";

budgetScore: number;

savingScore: number;

disciplineScore: number;

financialHealthScore: number;

generatedAt: Date;

}
```

---

# Analytics

Events

financial_profile_created

financial_profile_updated

financial_profile_changed

---

# Acceptance Criteria

✓ Un profil est généré automatiquement.

✓ Les scores sont calculés.

✓ Les mises à jour sont automatiques.

✓ L'historique est conservé.

✓ Les profils sont utilisés par l'ensemble de l'application.

✓ Les données restent cohérentes entre les analyses.
