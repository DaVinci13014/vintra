# Vintra — Folder Structure

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit l'organisation complète du projet Vintra.

L'objectif est de fournir une architecture claire, cohérente et évolutive afin que chaque développeur sache immédiatement où ajouter ou modifier du code.

Chaque dossier possède une responsabilité unique.

---

# Scope

Ce document couvre :

- L'organisation du projet
- Les conventions de nommage
- Les responsabilités des dossiers
- Les règles de développement

---

# Out of Scope

Ce document ne couvre pas :

- Les fonctionnalités métier
- Les calculs financiers
- La base de données
- Les composants UI détaillés

---

# Project Structure

```
vintra/

├── app/
├── components/
├── lib/
├── services/
├── hooks/
├── providers/
├── types/
├── schemas/
├── constants/
├── utils/
├── public/
├── docs/
├── supabase/
├── middleware.ts
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

# app/

Contient toutes les routes de l'application.

```
app/

(auth)/

dashboard/

goals/

notifications/

settings/

onboarding/

api/

layout.tsx

page.tsx

loading.tsx

error.tsx

not-found.tsx
```

---

# components/

Tous les composants React réutilisables.

```
components/

ui/

dashboard/

goals/

profile/

settings/

notifications/

layout/

forms/

charts/

common/
```

Les composants doivent être découplés de toute logique métier.

---

# lib/

Fonctions utilitaires et moteur métier.

```
lib/

analysis/

calculation/

auth/

database/

validation/

formatters/

helpers/
```

Ce dossier ne dépend jamais de React.

---

# services/

Services métier.

```
services/

analysis.service.ts

profile.service.ts

goal.service.ts

saving-plan.service.ts

recommendation.service.ts

notification.service.ts

dashboard.service.ts

settings.service.ts
```

Chaque service gère une seule responsabilité.

---

# hooks/

Custom React Hooks.

```
hooks/

useProfile.ts

useDashboard.ts

useGoal.ts

useNotifications.ts

useSavingPlan.ts

useTheme.ts
```

Les hooks ne doivent jamais contenir de logique métier complexe.

---

# providers/

Context Providers.

```
providers/

theme-provider.tsx

auth-provider.tsx

query-provider.tsx
```

---

# types/

Tous les types TypeScript.

```
types/

profile.ts

goal.ts

dashboard.ts

analysis.ts

recommendation.ts

notification.ts

settings.ts

api.ts
```

---

# schemas/

Validation Zod.

```
schemas/

auth.schema.ts

profile.schema.ts

goal.schema.ts

settings.schema.ts

onboarding.schema.ts
```

Toutes les validations sont centralisées ici.

---

# constants/

Constantes globales.

```
constants/

routes.ts

currencies.ts

countries.ts

goals.ts

notifications.ts

theme.ts
```

---

# utils/

Fonctions utilitaires.

```
utils/

currency.ts

date.ts

percentage.ts

format-number.ts

validators.ts
```

Aucune logique métier.

---

# public/

Fichiers statiques.

```
public/

images/

icons/

logo/

illustrations/

fonts/
```

---

# docs/

Documentation du projet.

```
docs/

01-Product/

02-UX/

03-Features/

04-Technical/

05-Design/
```

---

# supabase/

Configuration Supabase.

```
supabase/

migrations/

functions/

seed.sql

config.toml
```

---

# Naming Convention

## Files

Toujours :

kebab-case

Exemple

```
saving-plan.service.ts
```

---

## Components

Toujours :

PascalCase

Exemple

```
SavingPlanCard.tsx
```

---

## Hooks

Toujours :

useSomething

Exemple

```
useDashboard.ts
```

---

## Types

Toujours :

PascalCase

Exemple

```ts
interface FinancialProfile {}
```

---

## Variables

Toujours :

camelCase

---

## Constants

Toujours :

UPPER_SNAKE_CASE

Exemple

```ts
MAX_MONTHLY_INCOME
```

---

# Import Rules

Toujours utiliser des imports absolus.

Exemple

```ts
import { GoalCard } from "@/components/goals/GoalCard";
```

Les imports relatifs complexes (`../../../`) sont interdits.

---

# File Responsibilities

Chaque fichier possède une seule responsabilité.

Exemple

```
goal.service.ts

↓

Gestion des objectifs uniquement.
```

Aucun mélange de fonctionnalités.

---

# Component Rules

Un composant :

- ne contient pas de requête SQL ;
- ne contient pas de logique métier complexe ;
- reçoit ses données via props ou hooks.

---

# Service Rules

Les services :

- appellent la base de données ;
- exécutent les règles métier ;
- retournent des objets typés.

Ils ne connaissent jamais l'interface utilisateur.

---

# Validation Rules

Toutes les validations utilisent les schémas présents dans :

```
schemas/
```

Aucune validation dupliquée.

---

# Error Handling

Les erreurs métier sont gérées dans les services.

Les composants affichent uniquement des messages utilisateur.

---

# Testing Structure

```
tests/

unit/

integration/

e2e/
```

Les tests suivent la même structure que le projet.

---

# Code Standards

TypeScript Strict obligatoire.

Aucun `any`.

Aucun `console.log()` en production.

ESLint sans erreur.

Prettier obligatoire.

---

# Git Rules

Branches

```
main

develop

feature/*
```

Commits

Convention :

```
feat:

fix:

refactor:

docs:

test:

chore:
```

Exemple

```
feat: add saving plan calculation
```

---

# Scalability

L'architecture doit permettre :

- l'ajout de nouveaux modules ;
- la création d'un abonnement Premium ;
- l'ajout de nouvelles langues ;
- l'ajout de nouvelles devises ;
- l'ajout d'une application mobile.

Sans modifier l'organisation existante.

---

# Acceptance Criteria

✓ Structure claire.

✓ Responsabilités séparées.

✓ Imports cohérents.

✓ TypeScript strict.

✓ Validation centralisée.

✓ Architecture compatible avec Next.js App Router.

✓ Compatible avec Supabase.

✓ Documentation alignée avec toute l'architecture de Vintra.
