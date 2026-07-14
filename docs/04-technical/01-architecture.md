# Vintra — System Architecture

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit l'architecture technique globale de Vintra.

Il décrit les technologies utilisées, l'organisation des différentes couches de l'application, les responsabilités de chaque module et les règles d'architecture à respecter pendant tout le développement.

L'objectif est de construire une application évolutive, maintenable, performante et sécurisée.

---

# Scope

Ce document couvre :

- Architecture globale
- Stack technique
- Organisation des couches
- Flux de données
- Communication entre les modules
- Bonnes pratiques

---

# Out of Scope

Ce document ne couvre pas :

- La base de données
- Les routes API
- La sécurité détaillée
- Les calculs métier

Ces sujets sont documentés dans leurs fichiers respectifs.

---

# Technical Stack

## Frontend

Framework

Next.js 15

---

Language

TypeScript

---

Styling

Tailwind CSS

---

UI Components

shadcn/ui

---

Icons

Lucide React

---

Animations

Framer Motion

---

Forms

React Hook Form

---

Validation

Zod

---

Charts

Recharts

---

Authentication

Supabase Auth

---

Backend

Next.js Server Actions

---

Database

Supabase PostgreSQL

---

Storage

Supabase Storage

---

Realtime

Supabase Realtime

---

Hosting

Vercel

---

# Global Architecture

```
Client

↓

Next.js

↓

Server Actions

↓

Business Services

↓

Supabase

↓

PostgreSQL
```

---

# Layer Architecture

L'application est découpée en plusieurs couches.

```
Presentation Layer

↓

Application Layer

↓

Business Layer

↓

Data Layer

↓

Infrastructure Layer
```

---

# Presentation Layer

Responsabilités :

- Affichage
- Navigation
- UX
- Validation visuelle

Ne contient jamais de logique métier.

---

# Application Layer

Responsabilités :

- Gestion des formulaires
- Appels serveur
- Gestion des états
- Orchestration

---

# Business Layer

Responsabilités :

- Calculs
- Analyse financière
- Recommandations
- Saving Plan
- Profils financiers

Toute la logique métier est centralisée ici.

---

# Data Layer

Responsabilités :

- Lecture des données
- Écriture
- Requêtes SQL
- Mapping

Aucune logique métier.

---

# Infrastructure Layer

Responsabilités :

- Supabase
- Auth
- Storage
- Realtime
- Services externes

---

# Data Flow

```
User

↓

UI

↓

Server Action

↓

Business Service

↓

Repository

↓

Database

↓

Business Service

↓

UI
```

---

# Feature Architecture

Chaque fonctionnalité est indépendante.

Exemple

```
Authentication

Dashboard

Goals

Analysis

Recommendations

Settings

Notifications
```

Chaque module possède :

- ses composants
- ses services
- ses types
- ses validations

---

# Project Principles

## Single Responsibility

Chaque fichier possède une seule responsabilité.

---

## Reusability

Tous les composants sont réutilisables.

---

## Separation of Concerns

La logique métier est totalement séparée de l'interface.

---

## Type Safety

Tout le projet est écrit en TypeScript strict.

Le type `any` est interdit.

---

## Server First

Les calculs sont effectués côté serveur.

Le client reste léger.

---

## Security First

Aucune donnée sensible n'est traitée uniquement côté client.

Toutes les validations importantes sont répétées côté serveur.

---

# Business Services

Les principaux services sont :

AuthenticationService

ProfileService

AnalysisService

SavingPlanService

RecommendationService

GoalService

DashboardService

NotificationService

SettingsService

---

# Error Handling

Toutes les erreurs doivent être :

- journalisées ;
- typées ;
- affichées avec un message utilisateur compréhensible.

Les erreurs techniques ne doivent jamais être affichées à l'utilisateur.

---

# Logging

Chaque erreur critique est enregistrée.

Les événements importants sont historisés.

Les informations sensibles ne sont jamais enregistrées dans les logs.

---

# Performance Rules

Lazy Loading des pages.

---

Server Components par défaut.

---

Client Components uniquement lorsque nécessaire.

---

Pagination sur toutes les listes importantes.

---

Optimisation automatique des images.

---

Mise en cache uniquement lorsque cela ne compromet pas la cohérence des données.

---

# Code Quality

ESLint obligatoire.

---

Prettier obligatoire.

---

TypeScript Strict Mode activé.

---

Aucun warning autorisé avant un merge.

---

# Testing Strategy

Tests unitaires

↓

Tests d'intégration

↓

Tests End-to-End

---

# Scalability

L'architecture doit permettre :

- l'ajout de nouvelles fonctionnalités ;
- la création d'un abonnement Premium ;
- l'internationalisation ;
- l'ajout de nouvelles devises ;
- l'ajout de nouvelles langues ;
- l'évolution du moteur d'analyse.

Sans modification majeure de l'architecture existante.

---

# Acceptance Criteria

✓ Architecture modulaire.

✓ Séparation claire des responsabilités.

✓ TypeScript strict.

✓ Logique métier centralisée.

✓ Architecture évolutive.

✓ Compatible avec l'ensemble des fonctionnalités documentées.

✓ Optimisée pour Next.js App Router.

✓ Compatible avec Supabase.
