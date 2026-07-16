# Vintra — Saving Plan

Version : 1.0

Status : Approved

---

# Purpose

Le Saving Plan est un plan d'épargne personnalisé généré automatiquement par Vintra.

Son objectif est de transformer l'analyse financière de l'utilisateur en un plan d'action concret, réaliste et évolutif.

Contrairement à un simple objectif d'épargne, le Saving Plan indique précisément :

- combien économiser ;
- pendant combien de temps ;
- quel sera le résultat attendu ;
- comment adapter le plan lorsque la situation financière évolue.

Chaque utilisateur possède un seul Saving Plan actif, rattaché à son objectif principal.
Les objectifs planifiés peuvent afficher une simulation, mais ne créent aucun Saving Plan actif.

---

# Scope

Ce document couvre :

- Génération du plan
- Calcul de l'épargne recommandée
- Estimation de la durée
- Jalons (Milestones)
- Ajustements automatiques
- Progression
- États du plan

---

# Out of Scope

Ce document ne couvre pas :

- Dashboard
- Notifications
- Calcul détaillé du moteur d'analyse
- Recommandations

---

# Saving Plan Flow

```
Analysis Engine

↓

Financial Profile

↓

Saving Plan Builder

↓

Saving Plan

↓

Dashboard

↓

Suivi quotidien

↓

Réévaluation automatique
```

---

# Saving Plan Goals

Le plan doit répondre aux questions suivantes.

- Combien dois-je mettre de côté chaque mois ?
- Quand atteindrai-je mon objectif ?
- Mon objectif est-il réaliste ?
- Que dois-je modifier si ma situation évolue ?

---

# Inputs

Le Saving Plan est construit à partir de :

- Revenus mensuels
- Dépenses mensuelles
- Capacité d'épargne
- Épargne actuelle
- Objectif choisi
- Montant cible
- Date cible
- Profil financier

---

# Generated Data

Le moteur génère automatiquement :

- Montant recommandé à épargner chaque mois
- Durée estimée
- Date estimée d'atteinte
- Taux de progression
- Jalons
- Niveau de difficulté

---

# Monthly Saving Recommendation

Le moteur calcule le montant recommandé.

Exemple

```
Capacité d'épargne

420 €

↓

Recommandation

350 €/mois
```

Le montant recommandé ne doit jamais dépasser la capacité d'épargne estimée.

---

# Estimated Completion

Calcul

```
Montant restant

/

Épargne mensuelle recommandée

=

Nombre de mois
```

Le résultat est converti en une date estimée.

---

# Difficulty Levels

Chaque plan reçoit un niveau de difficulté.

## EASY

Objectif facilement atteignable.

---

## NORMAL

Objectif atteignable avec une bonne discipline.

---

## CHALLENGING

Objectif ambitieux.

Nécessite des efforts réguliers.

---

## UNREALISTIC

Objectif actuellement irréaliste.

Le moteur proposera automatiquement des ajustements.

---

# Milestones

Le Saving Plan est découpé en étapes.

Par défaut :

25 %

50 %

75 %

100 %

Chaque jalon déclenche :

- une mise à jour du Dashboard ;
- une notification ;
- une nouvelle évaluation.

---

# Automatic Adjustments

Le Saving Plan est automatiquement recalculé lorsque :

- les revenus changent ;
- les dépenses changent ;
- l'objectif est modifié ;
- le profil financier évolue.

Le recalcul conserve autant que possible l'objectif initial.

---

# Progress Tracking

Le plan affiche en permanence :

- Montant épargné
- Montant restant
- Pourcentage atteint
- Nombre de jours restants
- Date estimée
- Prochaine étape

---

# Goal Feasibility

Avant de générer le plan, le moteur vérifie si l'objectif est réalisable.

Si la date cible est trop proche ou si le montant demandé dépasse largement la capacité d'épargne estimée, le plan est marqué comme :

UNREALISTIC

Dans ce cas, Vintra proposera automatiquement :

- une nouvelle date cible ;
- un montant mensuel recommandé plus réaliste.

Le choix final appartient toujours à l'utilisateur.

---

# Saving Plan States

## ACTIVE

Plan en cours.

---

## PAUSED

Plan suspendu.

Le calcul reste disponible.

---

## COMPLETED

Objectif atteint.

---

## CANCELLED

Plan abandonné.

---

# Business Rules

## BR-001

Un seul Saving Plan actif par utilisateur.

Chaque Saving Plan référence explicitement le Goal qui l'a généré.

---

## BR-002

Le plan est généré automatiquement après l'onboarding.

---

## BR-003

Toute modification importante déclenche un recalcul.

---

## BR-004

Le montant recommandé ne peut jamais être négatif.

---

## BR-005

La progression est recalculée en temps réel.

---

## BR-006

Les jalons sont automatiquement validés lorsque le pourcentage correspondant est atteint.

---

# Technical Requirements

Execution

Server Side

---

Trigger

Analysis Engine

---

Updates

Événementiel

Chaque modification du profil déclenche un recalcul.

---

Performance

Temps maximal :

2 secondes

---

# Suggested Components

SavingPlanCard

SavingProgress

MilestoneTimeline

SavingRecommendation

DifficultyBadge

EstimatedCompletionCard

ProgressChart

---

# TypeScript

```ts
interface SavingPlan {

id: string;

recommendedMonthlySaving: number;

estimatedCompletionDate: Date;

difficulty:
| "EASY"
| "NORMAL"
| "CHALLENGING"
| "UNREALISTIC";

status:
| "ACTIVE"
| "PAUSED"
| "COMPLETED"
| "CANCELLED";

progress: number;

milestones: Milestone[];

createdAt: Date;

updatedAt: Date;

}
```

---

# Analytics

Events

saving_plan_created

saving_plan_updated

saving_plan_completed

saving_plan_paused

saving_plan_cancelled

milestone_reached

---

# Acceptance Criteria

✓ Un Saving Plan est généré automatiquement.

✓ Le montant recommandé est calculé.

✓ La date estimée est calculée.

✓ Les jalons sont créés.

✓ Le niveau de difficulté est déterminé.

✓ Les recalculs sont automatiques.

✓ La progression est mise à jour en temps réel.

✓ Les données sont synchronisées avec le Dashboard.

✓ Le plan reste cohérent après chaque modification du profil.

✓ Le changement d'objectif principal annule l'ancien plan actif et génère le plan du nouvel
objectif dans une seule transaction.

---

# Manual Contributions

La progression réelle peut être alimentée par des versements manuels depuis l'objectif principal.
Chaque versement :

- incrémente le montant épargné ;
- recalcule la progression, le montant restant, les jalons et la date estimée ;
- alimente l'historique de la courbe d'épargne ;
- déclenche les notifications de jalon concernées ;
- termine le plan lorsque la cible est atteinte ou dépassée.
