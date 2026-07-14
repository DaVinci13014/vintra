# Vintra — Analysis Engine

Version : 1.0

Status : Approved

---

# Purpose

L'Analysis Engine est le moteur d'analyse principal de Vintra.

Son rôle est de transformer les réponses fournies par l'utilisateur lors de l'onboarding en un profil financier exploitable.

À partir des données collectées, le moteur doit être capable de :

- Comprendre la situation financière actuelle.
- Estimer la capacité d'épargne.
- Identifier les points forts.
- Identifier les points faibles.
- Générer un profil financier.
- Définir un plan d'épargne personnalisé.
- Produire des recommandations pertinentes.

L'Analysis Engine est entièrement automatique.

Aucune intervention manuelle n'est nécessaire.

---

# Scope

Ce document couvre :

- Les données d'entrée
- Les étapes d'analyse
- Les calculs
- Les scores
- Les profils financiers
- Les recommandations
- Les résultats

---

# Out of Scope

Ce document ne couvre pas :

- L'affichage des résultats
- Le Dashboard
- Les API
- Les composants UI

---

# Analysis Pipeline

```
Onboarding terminé

↓

Validation des données

↓

Préparation des données

↓

Calculs

↓

Scoring

↓

Détermination du profil

↓

Création du plan d'épargne

↓

Génération des recommandations

↓

Enregistrement

↓

Dashboard
```

---

# Inputs

Le moteur reçoit les informations suivantes.

## Informations personnelles

- Date de naissance

- Pays

---

## Situation professionnelle

- Profession

- Type de revenus

- Fréquence de revenus

---

## Situation financière

- Revenus mensuels

- Revenus complémentaires

---

## Charges

- Logement

- Alimentation

- Transport

- Restaurants

- Shopping

- Loisirs

- Abonnements

---

## Habitudes

- Achats impulsifs

- Consultation bancaire

- Budget mensuel

- Paiement fractionné

- Difficulté à finir le mois

---

## Épargne

- Épargne actuelle

- Épargne mensuelle

---

## Objectif

- Motivation

- Montant cible

- Date cible

- Priorité

---

# Analysis Steps

Le moteur exécute les étapes suivantes dans l'ordre.

## STEP 1

Validation

Toutes les données sont vérifiées.

Les valeurs incohérentes sont rejetées.

---

## STEP 2

Nettoyage

Toutes les valeurs sont normalisées.

Exemple

2000€

↓

2000

---

## STEP 3

Calcul des dépenses

```
totalExpenses =
housing
+ food
+ transport
+ restaurants
+ shopping
+ hobbies
+ subscriptions
```

---

## STEP 4

Calcul des revenus

```
totalIncome =
monthlyIncome
+ additionalIncome
```

---

## STEP 5

Capacité d'épargne

```
savingCapacity =
totalIncome
-
totalExpenses
```

---

## STEP 6

Taux d'épargne

```
savingRate =
savingCapacity
/
totalIncome
*
100
```

---

## STEP 7

Calcul du reste à vivre

```
remainingBudget =
totalIncome
-
totalExpenses
```

---

## STEP 8

Analyse comportementale

Le moteur attribue un score selon :

- achats impulsifs
- budget
- consultation bancaire
- paiements fractionnés
- difficulté à finir le mois

---

## STEP 9

Création du profil financier

Le moteur détermine automatiquement :

- prudent
- équilibré
- dépensier
- épargnant

---

## STEP 10

Création du plan d'épargne

Le moteur estime :

- épargne mensuelle recommandée

- durée estimée

- objectif atteignable

---

## STEP 11

Génération des recommandations

Le moteur produit une liste ordonnée de recommandations.

---

# Financial Indicators

Les indicateurs calculés sont :

- Revenus

- Dépenses

- Capacité d'épargne

- Taux d'épargne

- Reste à vivre

- Niveau de risque

- Niveau de discipline

- Progression estimée

---

# Financial Profile

Chaque utilisateur reçoit un profil.

## Saver

L'utilisateur possède une excellente gestion.

---

## Balanced

Gestion saine.

Quelques optimisations possibles.

---

## Spender

Dépenses importantes.

Fort potentiel d'amélioration.

---

## Fragile

Situation financière fragile.

Priorité :

Stabiliser les finances.

---

# Recommendation Engine

Chaque recommandation possède :

Titre

Description

Impact

Difficulté

Priorité

Catégorie

---

Exemple

```
Réduire les dépenses restaurants.

Impact

Élevé

Difficulté

Faible
```

---

# Priority Levels

LOW

MEDIUM

HIGH

CRITICAL

---

# Business Rules

## BR-001

Tous les calculs utilisent les données les plus récentes.

---

## BR-002

Chaque modification du profil déclenche une nouvelle analyse.

---

## BR-003

Les recommandations sont toujours recalculées.

---

## BR-004

Le moteur ne doit jamais produire de valeurs négatives pour un objectif d'épargne recommandé.

---

## BR-005

Toutes les recommandations doivent être justifiées par les données de l'utilisateur.

---

# Technical Requirements

Architecture

Service Layer

---

Execution

Server Side

---

Trigger

Fin onboarding

Modification du profil

Modification des revenus

Modification des charges

Modification de l'objectif

---

Performance

Temps maximal

2 secondes

---

Cache

Aucun cache permanent.

Toujours recalculer.

---

# Suggested Architecture

```
AnalysisEngine

↓

IncomeAnalyzer

↓

ExpenseAnalyzer

↓

BehaviorAnalyzer

↓

ScoreCalculator

↓

ProfileBuilder

↓

RecommendationEngine

↓

SavingPlanBuilder
```

---

# TypeScript

```ts
interface AnalysisResult {

financialProfile: FinancialProfile;

savingCapacity: number;

savingRate: number;

remainingBudget: number;

recommendations: Recommendation[];

savingPlan: SavingPlan;

}
```

---

# Error Handling

Si une donnée obligatoire manque :

↓

Annuler l'analyse.

Afficher une erreur.

Journaliser l'événement.

---

# Analytics

Events

analysis_started

analysis_completed

analysis_failed

financial_profile_generated

recommendations_generated

---

# Acceptance Criteria

✓ Analyse entièrement automatique.

✓ Calculs cohérents.

✓ Profil généré.

✓ Plan d'épargne généré.

✓ Recommandations générées.

✓ Temps inférieur à deux secondes.

✓ Résultats enregistrés.
