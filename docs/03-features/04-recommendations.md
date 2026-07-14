# Vintra — Recommendations

Version : 1.0

Status : Approved

---

# Purpose

Le système de recommandations est chargé de générer des conseils personnalisés permettant à l'utilisateur d'améliorer progressivement sa situation financière.

Contrairement à une simple liste de conseils génériques, chaque recommandation est construite à partir des données réelles de l'utilisateur.

Les recommandations doivent être :

- pertinentes ;
- personnalisées ;
- compréhensibles ;
- réalisables ;
- mesurables.

Le système ne doit jamais proposer un conseil qui ne repose pas sur les données analysées.

---

# Scope

Ce document couvre :

- Génération des recommandations
- Priorisation
- Affichage
- Cycle de vie
- États
- Interactions utilisateur

---

# Out of Scope

Ce document ne couvre pas :

- Dashboard
- Notifications
- Calcul des scores
- Financial Profile

---

# Recommendation Flow

```
Analysis Engine

↓

Financial Profile

↓

Recommendation Engine

↓

Priorisation

↓

Dashboard

↓

Interaction utilisateur

↓

Nouvelle analyse
```

---

# Recommendation Goals

Chaque recommandation doit répondre à un objectif clair.

Exemples :

- Réduire une dépense.
- Augmenter l'épargne.
- Améliorer les habitudes financières.
- Atteindre plus rapidement un objectif.

---

# Recommendation Structure

Chaque recommandation possède les propriétés suivantes.

## Title

Titre court.

Exemple

Réduire les dépenses de restaurants.

---

## Description

Explication détaillée.

Exemple

Vous dépensez actuellement environ 320 € par mois en restaurants.

En réduisant cette dépense à 220 €, vous pourriez économiser 1 200 € supplémentaires par an.

---

## Category

Valeurs possibles :

- Income
- Expenses
- Savings
- Habits
- Goal
- Profile

---

## Priority

Valeurs possibles :

LOW

MEDIUM

HIGH

CRITICAL

---

## Estimated Impact

Impact estimé.

Valeurs :

- Très faible
- Faible
- Moyen
- Élevé
- Très élevé

---

## Difficulty

Niveau de difficulté.

Valeurs :

- Très facile
- Facile
- Moyen
- Difficile

---

## Potential Saving

Montant estimé pouvant être économisé.

Exemple

75 €/mois

---

# Recommendation Categories

## Expenses

Réduction des dépenses.

Exemples :

- Restaurants
- Shopping
- Abonnements
- Loisirs

---

## Income

Amélioration des revenus.

Exemples :

- Revenus complémentaires
- Optimisation des rentrées d'argent

---

## Savings

Amélioration de l'épargne.

Exemples :

- Augmenter l'épargne mensuelle
- Créer un fonds d'urgence

---

## Habits

Amélioration des habitudes.

Exemples :

- Suivre un budget
- Consulter son compte régulièrement
- Limiter les achats impulsifs

---

## Goal

Optimisation de l'objectif.

Exemples :

- Modifier la date cible
- Adapter le montant mensuel

---

## Profile

Conseils adaptés au profil financier.

---

# Recommendation Generation Rules

Le moteur doit analyser :

- Revenus
- Dépenses
- Habitudes
- Épargne
- Objectif
- Profil financier

Chaque recommandation doit être justifiée par au moins une donnée utilisateur.

---

# Prioritization

Les recommandations sont triées selon :

1. Impact potentiel
2. Difficulté
3. Urgence
4. Priorité métier

Le Dashboard affiche uniquement les trois recommandations les plus importantes.

---

# Recommendation Lifecycle

```
Generated

↓

Displayed

↓

Opened

↓

Applied

↓

Archived
```

---

# Recommendation States

GENERATED

Créée par le moteur.

---

DISPLAYED

Visible dans l'application.

---

OPENED

Consultée par l'utilisateur.

---

APPLIED

L'utilisateur a appliqué la recommandation.

---

ARCHIVED

La recommandation n'est plus pertinente.

---

# Business Rules

## BR-001

Une recommandation doit toujours être basée sur les données réelles de l'utilisateur.

---

## BR-002

Aucune recommandation ne doit être générée sans justification.

---

## BR-003

Le Dashboard affiche au maximum trois recommandations prioritaires.

---

## BR-004

Les recommandations sont recalculées après chaque nouvelle analyse.

---

## BR-005

Une recommandation devenue obsolète est automatiquement archivée.

---

## BR-006

Deux recommandations identiques ne doivent jamais être affichées simultanément.

---

# User Actions

L'utilisateur peut :

- Consulter une recommandation
- Marquer une recommandation comme appliquée
- Ignorer une recommandation
- Voir toutes les recommandations

---

# UI Components

RecommendationsList

RecommendationCard

RecommendationDetails

PriorityBadge

ImpactBadge

DifficultyBadge

PotentialSavingCard

EmptyState

---

# Empty State

Titre

Aucune recommandation disponible.

Description

Votre situation actuelle ne nécessite aucune action particulière.

---

# Loading State

Afficher des Skeleton Loaders.

---

# Error State

Message

Impossible de charger les recommandations.

Action

Réessayer.

---

# Technical Requirements

Execution

Server Side

---

Trigger

Analysis Engine

---

Refresh

Après chaque recalcul du profil financier.

---

Performance

Temps maximal :

1 seconde

---

Caching

Recommandations invalidées après chaque nouvelle analyse.

---

# Suggested TypeScript

```ts
interface Recommendation {

id: string;

title: string;

description: string;

category:
| "INCOME"
| "EXPENSES"
| "SAVINGS"
| "HABITS"
| "GOAL"
| "PROFILE";

priority:
| "LOW"
| "MEDIUM"
| "HIGH"
| "CRITICAL";

impact:
| "VERY_LOW"
| "LOW"
| "MEDIUM"
| "HIGH"
| "VERY_HIGH";

difficulty:
| "VERY_EASY"
| "EASY"
| "MEDIUM"
| "HARD";

potentialSaving: number;

status:
| "GENERATED"
| "DISPLAYED"
| "OPENED"
| "APPLIED"
| "ARCHIVED";

createdAt: Date;

updatedAt: Date;

}
```

---

# Analytics

Events

recommendation_generated

recommendation_displayed

recommendation_opened

recommendation_applied

recommendation_archived

recommendation_ignored

---

# Acceptance Criteria

✓ Les recommandations sont générées automatiquement.

✓ Chaque recommandation est justifiée par les données utilisateur.

✓ Les recommandations sont priorisées.

✓ Le Dashboard affiche uniquement les recommandations prioritaires.

✓ Les recommandations sont recalculées après chaque nouvelle analyse.

✓ Les états sont correctement gérés.

✓ Les performances respectent les objectifs définis.

✓ Les données restent cohérentes avec le profil financier.
