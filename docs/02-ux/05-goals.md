# Vintra — Goals

Version : 1.0

Status : Approved

---

# Purpose

Le système d'objectifs permet à chaque utilisateur de définir une cible d'épargne concrète.

Toutes les analyses de Vintra sont construites autour de cet objectif.

Un objectif représente une destination financière.

Exemples :

- Constituer une épargne de sécurité
- Acheter une voiture
- Acheter un logement
- Voyager
- Financer un projet
- Préparer sa retraite
- Autre

---

# Scope

Ce document couvre :

- Création d'objectif
- Consultation
- Modification
- Suppression
- Progression
- Estimation de la date d'atteinte

---

# Out of Scope

Ce document ne couvre pas :

- Les recommandations
- Les calculs financiers détaillés
- Les statistiques

---

# Goal Lifecycle

```
Créer

↓

Actif

↓

Progression

↓

Atteint

↓

Archivé
```

---

# GOAL_001 — Create Goal

## Purpose

Créer le premier objectif financier.

---

## Fields

### Goal Name

Type

Select

---

### Available Goals

- Épargne de sécurité
- Acheter une voiture
- Acheter un logement
- Voyager
- Études
- Projet personnel
- Retraite
- Autre

---

### Target Amount

Type

Currency

Required

Yes

Minimum

100 €

---

### Target Date

Type

Month / Year Picker

Required

Yes

Future uniquement.

---

## Optional Field

Description

Permettre à l'utilisateur d'ajouter une note.

Maximum

250 caractères.

---

# Business Rules

Un seul objectif principal est actif.

---

# GOAL_002 — Goal Details

## Informations affichées

Nom

Montant cible

Montant déjà épargné

Montant restant

Date estimée

Temps restant

Progression

---

## Progress Formula

```
(currentAmount / targetAmount) * 100
```

---

## Components

Goal Card

Progress Bar

Statistics

Quick Actions

---

# GOAL_003 — Update Goal

## Modifiable

Nom

Montant cible

Date cible

Description

---

## Non modifiable

Date de création

Historique

---

## Business Rules

Toute modification entraîne :

- Recalcul de la progression
- Recalcul de la date estimée
- Mise à jour du Dashboard

---

# GOAL_004 — Archive Goal

## Purpose

Archiver un objectif terminé.

---

## Conditions

Objectif atteint.

OU

Archivage manuel.

---

## Résultat

L'objectif est déplacé dans l'historique.

---

# GOAL_005 — Delete Goal

## Purpose

Supprimer définitivement un objectif.

---

## Confirmation obligatoire

Titre

Supprimer cet objectif ?

Description

Cette action est irréversible.

---

## Action

Supprimer

Annuler

---

# Goal States

ACTIVE

Objectif en cours.

---

COMPLETED

Objectif atteint.

---

ARCHIVED

Objectif conservé dans l'historique.

---

DELETED

Objectif supprimé.

---

# Goal Progress

Le Dashboard affiche :

Montant actuel

↓

Objectif

↓

Progression

↓

Temps estimé

---

# Estimated Completion

Calcul basé sur :

Capacité d'épargne mensuelle

↓

Montant restant

↓

Nombre de mois estimés

---

# Empty State

Aucun objectif.

Afficher :

Créez votre premier objectif.

---

# Business Rules

## BR-001

Un seul objectif principal actif.

---

## BR-002

Impossible de créer un objectif avec une date passée.

---

## BR-003

Impossible de créer un objectif inférieur à 100 €.

---

## BR-004

Toute modification déclenche un recalcul.

---

## BR-005

Un objectif terminé est automatiquement marqué comme Completed.

---

# UI Components

GoalCard

ProgressBar

GoalTimeline

GoalStats

GoalActions

DeleteDialog

ArchiveDialog

---

# Technical Requirements

Framework

Next.js App Router

---

Data Fetching

Server Actions

---

State

Optimistic Update

---

Validation

Zod

---

Currency

Toujours selon la devise du profil.

---

# TypeScript

```ts
interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  progress: number;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
}
```

---

# Analytics

Events

goal_created

goal_updated

goal_archived

goal_deleted

goal_completed

---

# Acceptance Criteria

✓ Création d'objectif

✓ Modification

✓ Archivage

✓ Suppression

✓ Calcul de progression

✓ Calcul de la date estimée

✓ Synchronisation avec le Dashboard

✓ Gestion des états

✓ Responsive mobile / tablette / desktop
