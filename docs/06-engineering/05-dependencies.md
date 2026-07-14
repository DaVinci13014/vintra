# Vintra — Dependencies

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit la politique officielle concernant les dépendances utilisées dans Vintra.

Chaque bibliothèque ajoutée au projet doit être justifiée, maintenue et compatible avec l'architecture officielle.

L'objectif est de conserver une base de code légère, stable et maintenable.

---

# Philosophy

Chaque dépendance est une responsabilité.

Ajouter une bibliothèque revient à intégrer du code externe dans le projet.

Avant toute installation, il faut vérifier qu'elle apporte une réelle valeur.

La meilleure dépendance est celle que l'on n'a pas besoin d'installer.

---

# General Rules

Avant d'ajouter une dépendance, vérifier :

- qu'elle résout un problème réel ;
- qu'elle est activement maintenue ;
- qu'elle est compatible TypeScript ;
- qu'elle est compatible avec notre stack ;
- qu'elle possède une documentation de qualité.

---

# Approved Dependencies

Les dépendances suivantes sont officiellement approuvées.

---

## Framework

Next.js

---

## Language

TypeScript

---

## Styling

Tailwind CSS

---

## UI

shadcn/ui

---

## Icons

Lucide React

---

## Animation

Framer Motion

---

## Forms

React Hook Form

---

## Validation

Zod

---

## ORM

Prisma

---

## Authentication

Better Auth

---

## Database

PostgreSQL

---

## Local State

Zustand

---

## Server State

TanStack Query

---

## Charts

Recharts

---

## Notifications

Sonner

---

## Theme

next-themes

---

## Tables

TanStack Table

---

## Testing

Vitest

React Testing Library

Playwright

---

## Logging

Pino

---

## Emails

Resend

---

## Analytics

PostHog

---

## Monitoring

Sentry

---

## Storage

Cloudflare R2 SDK

---

# Dependency Evaluation

Avant toute nouvelle dépendance, répondre aux questions suivantes.

1.

Existe-t-il déjà une solution dans le projet ?

---

2.

Peut-on résoudre le problème avec JavaScript ou TypeScript natif ?

---

3.

La bibliothèque est-elle activement maintenue ?

---

4.

Possède-t-elle une documentation officielle ?

---

5.

Est-elle TypeScript First ?

---

6.

Est-elle compatible avec Next.js App Router ?

---

7.

Est-elle compatible avec la licence du projet ?

---

8.

Est-elle réellement nécessaire ?

---

Si une réponse est négative, la dépendance doit être réévaluée.

---

# Version Policy

Toujours utiliser :

La dernière version stable.

Éviter :

- versions alpha ;
- versions beta ;
- versions expérimentales.

Sauf validation explicite.

---

# Installation Rules

Toutes les dépendances sont installées avec :

pnpm

Aucun autre gestionnaire de paquets n'est autorisé.

---

# Dependency Categories

Les dépendances sont classées selon leur rôle.

Production

Utilisées par l'application.

---

Development

Utilisées uniquement pendant le développement.

---

Testing

Utilisées uniquement pour les tests.

---

Build

Utilisées lors de la compilation.

---

# Updating Dependencies

Les mises à jour doivent être régulières.

Avant toute mise à jour majeure :

- lire les Release Notes ;
- vérifier les Breaking Changes ;
- exécuter tous les tests.

---

# Removing Dependencies

Une dépendance doit être supprimée lorsqu'elle :

- n'est plus utilisée ;
- est abandonnée ;
- présente une faille de sécurité ;
- est remplacée par une meilleure solution.

---

# Security

Toutes les dépendances doivent être surveillées.

Les vulnérabilités critiques doivent être corrigées rapidement.

Les dépendances non maintenues sont interdites.

---

# License

Toutes les dépendances doivent posséder une licence compatible avec un projet commercial.

Éviter les licences restrictives.

---

# Performance

Une dépendance ne doit jamais être ajoutée si elle augmente fortement :

- la taille du bundle ;
- le temps de compilation ;
- le temps de chargement.

---

# Bundle Size

Limiter le nombre de dépendances.

Privilégier :

Une bibliothèque polyvalente

plutôt que

plusieurs bibliothèques redondantes.

---

# Tree Shaking

Toutes les dépendances doivent être compatibles avec le Tree Shaking.

---

# Peer Dependencies

Respecter les versions recommandées.

Ne jamais forcer une résolution de dépendances.

---

# Deprecated Packages

Les bibliothèques dépréciées doivent être remplacées dès qu'une alternative stable est disponible.

---

# AI Rules

Les assistants IA ne doivent jamais :

- installer une nouvelle dépendance sans justification ;
- remplacer une bibliothèque officielle ;
- contourner la stack définie dans 01-tech-stack.md.

---

# Forbidden Dependencies

Interdit

- Bootstrap
- Material UI
- Ant Design
- jQuery
- Moment.js
- Redux
- MobX
- Recoil
- styled-components
- Emotion
- Lodash (si une alternative native existe)
- Axios (utiliser fetch lorsque possible)

---

# Review Checklist

Avant d'ajouter une dépendance :

✓ Besoin réel identifié

✓ Compatible TypeScript

✓ Documentation officielle

✓ Projet maintenu

✓ Compatible Next.js

✓ Compatible avec la stack

✓ Impact bundle acceptable

✓ Licence compatible

---

# Dependency Audit

Réaliser régulièrement :

- audit de sécurité ;
- suppression des dépendances inutilisées ;
- mise à jour des versions stables.

---

# Acceptance Criteria

Une nouvelle dépendance est acceptée si :

- elle respecte cette politique ;
- elle apporte une réelle valeur ;
- elle est compatible avec l'architecture de Vintra ;
- elle ne dégrade ni les performances, ni la maintenabilité du projet.
