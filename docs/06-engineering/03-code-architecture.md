# Vintra — Code Architecture

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit l'architecture officielle du code de Vintra.

Il précise :

- l'organisation du projet ;
- les responsabilités de chaque couche ;
- les dépendances autorisées ;
- les conventions de nommage ;
- les règles d'import.

L'objectif est de garantir une architecture stable, évolutive et prévisible.

Toutes les contributions doivent respecter ce document.

---

# Architecture Philosophy

Le projet est construit selon **Feature-Sliced Design (FSD)**.

L'architecture est organisée par responsabilités, et non par type de fichier.

Chaque couche possède une responsabilité unique.

Les dépendances suivent toujours la même direction.

Aucune exception.

---

# Official Reference

Feature-Sliced Design

https://feature-sliced.design/

---

# Layer Hierarchy

Les couches sont classées du plus générique au plus spécifique.

```

app
↓

processes (optionnel)

↓

pages

↓

widgets

↓

features

↓

entities

↓

shared

```

Une couche ne peut dépendre que d'une couche située en dessous.

---

# Project Structure

```text
src/

app/

pages/

widgets/

features/

entities/

shared/

processes/

```

---

# app/

Responsabilité :

Point d'entrée de l'application.

Contient :

- App Router
- Providers
- Layouts
- Routing
- Middleware

Ne contient jamais :

- logique métier
- appels Prisma
- logique de calcul

---

# pages/

Responsabilité :

Assembler les widgets.

Une page :

- ne calcule rien ;
- ne fait pas de logique métier ;
- orchestre uniquement l'interface.

---

# widgets/

Responsabilité :

Assembler plusieurs Features.

Exemples

Dashboard

GoalList

FinancialOverview

ProfileHeader

---

# features/

Responsabilité :

Une action utilisateur.

Exemples

Create Goal

Delete Goal

Update Profile

Login

Logout

Notifications

---

Une Feature peut utiliser :

Entities

Shared

---

# entities/

Responsabilité :

Représenter les objets métier.

Exemples

User

Goal

Saving Plan

Recommendation

Profile

Notification

---

Une Entity contient :

Model

API

Types

Hooks

UI

---

# shared/

Responsabilité :

Code totalement réutilisable.

Sous-dossiers

ui/

lib/

api/

hooks/

config/

constants/

types/

styles/

assets/

utils/

---

Shared ne connaît jamais les couches supérieures.

---

# processes/

Optionnel.

Utilisé uniquement pour les workflows complexes.

Exemple

Onboarding complet.

---

# Import Rules

Toujours utiliser :

Imports absolus.

```ts
import { Button } from "@/shared/ui/button"
```

Interdits

```ts
../../../button
```

---

# Dependency Rules

Autorisé

```
pages

↓

widgets

↓

features

↓

entities

↓

shared
```

Interdit

```
shared

↓

features
```

---

# Public API

Chaque dossier exporte uniquement ce qui est nécessaire.

Toujours utiliser :

index.ts

Exemple

```
features/

create-goal/

index.ts

ui/

model/

api/
```

Les imports internes sont interdits.

---

# Feature Structure

```
create-goal/

ui/

model/

api/

lib/

config/

index.ts
```

---

# Entity Structure

```
goal/

model/

api/

ui/

types/

index.ts
```

---

# Shared Structure

```
shared/

ui/

hooks/

utils/

api/

config/

styles/

constants/

types/

assets/
```

---

# Component Rules

Les composants sont :

- petits ;
- spécialisés ;
- indépendants.

Objectif

150 lignes.

Maximum

250.

---

# Hook Rules

Un Hook réalise une seule responsabilité.

Toujours commencer par :

use

Exemple

```
useGoal()

useDashboard()
```

---

# Service Rules

Toute logique métier complexe est placée dans :

model/

ou

lib/

Jamais dans les composants.

---

# API Rules

Les appels API sont isolés.

Jamais directement dans un composant React.

---

# Types

Tous les types sont :

explicites.

Pas de any.

---

# State Management

Local UI

Zustand

---

Server State

TanStack Query

---

Form State

React Hook Form

---

Validation

Zod

---

# Naming Convention

Folders

kebab-case

---

Files

kebab-case

---

Components

PascalCase

---

Hooks

useSomething

---

Constants

UPPER_SNAKE_CASE

---

Variables

camelCase

---

Interfaces

PascalCase

---

# Barrel Exports

Chaque module possède :

index.ts

Les imports passent uniquement par cette API publique.

---

# Aliases

Utiliser :

@

Exemple

```ts
@/features/create-goal
```

---

# Circular Dependencies

Strictement interdites.

---

# Environment Variables

Accès uniquement via :

shared/config

Jamais directement dans les composants.

---

# Error Handling

Les erreurs sont gérées dans :

model/

api/

Jamais dans les composants.

---

# Logging

Pino

Uniquement côté serveur.

---

# Documentation

Chaque Feature complexe possède un README.md.

---

# Scalability

L'architecture doit permettre :

- ajout d'une version Premium ;
- multi-langues ;
- multi-devises ;
- application mobile ;
- nouvelles fonctionnalités.

Sans restructurer le projet.

---

# AI Development

Les assistants IA doivent :

- respecter cette architecture ;
- ne jamais créer de dossier hors FSD ;
- ne jamais contourner une couche ;
- utiliser les APIs publiques uniquement.

---

# Forbidden

Interdit

- logique métier dans les pages
- logique métier dans les composants
- appels Prisma dans React
- imports relatifs profonds
- dépendances circulaires
- dossiers "utils" dans chaque feature
- composants géants
- duplication de logique
- exports sauvages

---

# Code Review Checklist

✓ La couche est correcte.

✓ Les dépendances sont respectées.

✓ Les imports passent par index.ts.

✓ Aucun any.

✓ Pas de duplication.

✓ Les responsabilités sont respectées.

✓ Les composants restent simples.

✓ Les règles FSD sont respectées.

---

# Acceptance Criteria

L'architecture est conforme si :

- chaque fichier est placé dans la bonne couche ;
- les dépendances suivent les règles FSD ;
- aucune logique métier n'est présente dans l'UI ;
- les APIs publiques sont respectées ;
- le projet reste facilement maintenable à long terme ;
- l'ajout d'une nouvelle fonctionnalité ne nécessite pas de restructurer le projet.
