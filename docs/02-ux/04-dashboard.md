# Vintra — Dashboard

Version : 1.0

Status : Approved

---

# Purpose

Le Dashboard est la page principale de Vintra.

Il constitue le point d'entrée après la connexion de l'utilisateur.

Son objectif est de fournir une vue claire et synthétique de la situation financière actuelle, de la progression vers les objectifs et des recommandations générées par Vintra.

Le Dashboard doit permettre à l'utilisateur de comprendre sa situation en moins de 30 secondes.

---

# Scope

Ce document couvre :

- Structure du Dashboard
- Composants
- États
- Navigation
- Règles métier
- Interactions utilisateur

---

# Out of Scope

Ce document ne couvre pas :

- Les calculs du moteur d'analyse
- Les paramètres
- Les notifications
- Les appels API

---

# Dashboard Flow

```
Connexion

↓

Dashboard

↓

Consultation

↓

Action utilisateur

↓

Navigation
```

---

# Dashboard Structure

Le Dashboard est composé de 8 sections principales.

```
Header

↓

Financial Summary

↓

Current Goal

↓

Planned Goals

↓

Monthly Savings

↓

Recommendations

↓

Quick Actions

↓

Bottom Navigation
```

---

# DASHBOARD_001 — Header

## Purpose

Présenter les informations principales de l'utilisateur.

---

## Components

- Avatar
- Prénom
- Message de bienvenue
- Icône Notifications

---

## Welcome Message

Exemple :

Bonjour Thomas 👋

ou

Bonsoir Thomas 👋

Le message varie selon l'heure locale.

---

## Actions

Avatar

↓

Ouvre les paramètres.

L'avatar affiche la photo enregistrée. Sans photo, il affiche les initiales du prénom et du nom.

Notifications

↓

Ouvre les notifications.

---

# DASHBOARD_002 — Financial Summary

## Purpose

Afficher la situation financière actuelle.

---

## Components

Savings Capacity Card

Current Savings Card

Monthly Income Card

Monthly Expenses Card

---

## Display

Capacité d'épargne

Exemple

320 €/mois

---

Épargne actuelle

Exemple

4 250 €

---

Revenus

Exemple

2 350 €

---

Charges

Exemple

1 980 €

---

## Business Rules

Toutes les données proviennent du profil financier.

Les montants sont toujours affichés dans la devise du profil.

---

# DASHBOARD_003 — Current Goal

## Purpose

Afficher l'objectif principal.

---

## Components

Goal Card

---

## Informations

Nom de l'objectif

Montant cible

Montant actuel

Progression

Temps restant estimé

---

## Progress Bar

Calcul

```
(currentAmount / targetAmount) * 100
```

---

## Actions

Voir le détail

Modifier l'objectif

---

# DASHBOARD_003B — Planned Goals

## Purpose

Donner une vue synthétique des autres projets enregistrés sans les confondre avec l'objectif
principal.

## Informations

- Nom
- Montant cible
- Épargne actuelle de référence
- Progression estimée
- Date cible

## Business Rules

- Afficher au maximum les 3 objectifs planifiés les plus récents.
- Un objectif planifié ne possède pas de Saving Plan actif.
- L'accès au détail permet de le définir comme nouvel objectif principal.
- La promotion planifie automatiquement l'ancien objectif principal et recalcule le Dashboard.

---

# DASHBOARD_004 — Monthly Savings

## Purpose

Afficher l'évolution de l'épargne.

---

## Components

Graph

Monthly Evolution

---

## Périodes

- 1 mois
- 3 mois
- 6 mois
- 12 mois

---

## Data

Historique des économies réalisées.

---

# DASHBOARD_005 — Recommendations

## Purpose

Afficher les recommandations prioritaires.

---

## Components

Recommendation Cards

---

Chaque carte contient :

Titre

Description

Impact estimé

Niveau de difficulté

Bouton

Voir le détail

---

## Maximum

Afficher les 3 recommandations les plus importantes.

---

# DASHBOARD_006 — Quick Actions

## Purpose

Permettre un accès rapide aux fonctionnalités principales.

---

## Components

Modifier mes revenus

↓

Modifier mes dépenses

↓

Modifier mon objectif

↓

Mettre à jour mon profil

---

# DASHBOARD_007 — Bottom Navigation

## Tabs

Dashboard

Goals

Statistics

Profile

Settings

---

## Navigation Rules

Chaque onglet conserve son état.

Le Dashboard est toujours la page d'accueil après connexion.

---

# Loading States

Au chargement :

Afficher des Skeletons.

Ne jamais afficher une page vide.

---

# Empty States

## Aucun objectif

Afficher :

Créer votre premier objectif.

---

## Aucune recommandation

Afficher :

Tout semble bien se passer pour le moment.

---

## Aucune donnée

Afficher :

Complétez votre profil.

---

# Refresh Strategy

Les données sont rechargées :

- À l'ouverture du Dashboard
- Après une modification du profil
- Après modification d'un objectif
- Après actualisation manuelle

---

# Business Rules

## BR-001

Le Dashboard est inaccessible si l'onboarding est incomplet.

---

## BR-002

Toujours afficher un objectif principal.

---

## BR-003

Les recommandations sont triées par impact.

---

## BR-004

La capacité d'épargne est affichée avant les revenus.

---

## BR-005

Tous les montants utilisent la devise du profil.

---

# Security

Toutes les données affichées appartiennent uniquement à l'utilisateur connecté.

Aucune donnée ne doit être mise en cache côté client sans validation.

---

# Technical Requirements

Framework

Next.js App Router

---

State Management

Server Components

Client Components uniquement lorsque nécessaire.

---

Fetching

Server Actions

---

Caching

Revalidate après chaque modification.

---

Error Handling

Afficher une erreur utilisateur.

Permettre un rechargement.

---

# Suggested Components

```
DashboardLayout

Header

Greeting

NotificationButton

FinancialSummaryCard

SavingsCapacityCard

IncomeCard

ExpensesCard

GoalCard

ProgressBar

RecommendationsList

RecommendationCard

QuickActions

BottomNavigation
```

---

# Types

```ts
interface DashboardData {
  profile: Profile;
  financialSummary: FinancialSummary;
  currentGoal: Goal;
  recommendations: Recommendation[];
}
```

---

# Analytics

Events

dashboard_opened

goal_clicked

recommendation_clicked

profile_updated

quick_action_clicked

---

# Acceptance Criteria

✓ Le Dashboard est accessible uniquement après un onboarding terminé.

✓ Toutes les données sont correctement affichées.

✓ Les recommandations sont triées.

✓ Le chargement affiche des Skeletons.

✓ Les erreurs sont gérées.

✓ Toutes les actions redirigent vers la bonne page.

✓ Le Dashboard reste responsive sur mobile, tablette et desktop.
