# Vintra — Tech Stack

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit la stack technique officielle de Vintra.

Toutes les technologies utilisées dans le projet sont référencées ici.

L'objectif est de garantir une architecture moderne, cohérente et évolutive, tout en limitant les coûts au démarrage.

Aucune technologie ne doit être ajoutée ou remplacée sans validation.

---

# Engineering Principles

La stack doit respecter les principes suivants :

- Open Source dès que possible
- Gratuit ou avec un plan gratuit suffisant
- Type Safe
- Performante
- Moderne
- Stable
- Bien documentée
- Compatible avec les outils d'IA
- Facile à maintenir
- Évolutive

---

# Frontend

## Framework

Next.js 15

Pourquoi

- App Router
- React Server Components
- Server Actions
- Excellentes performances
- Standard actuel de l'écosystème React
- Déploiement optimisé sur Vercel

---

## Language

TypeScript

Configuration

Strict Mode obligatoire.

Aucun fichier JavaScript n'est autorisé.

---

## Styling

Tailwind CSS v4

Pourquoi

- Rapidité
- Cohérence
- Compatible Design System
- Excellente DX

Aucun CSS Framework supplémentaire.

---

## UI Components

shadcn/ui

Pourquoi

- Open Source
- Accessible
- Personnalisable
- Compatible Tailwind
- Aucun runtime supplémentaire

Tous les composants de Vintra doivent être construits à partir de shadcn/ui.

---

## Icons

Lucide React

Aucune autre bibliothèque d'icônes n'est autorisée.

---

## Animations

Framer Motion

Toutes les animations de l'application utilisent exclusivement Framer Motion.

---

## Forms

React Hook Form

Gestion unique de tous les formulaires.

---

## Validation

Zod

Toutes les validations sont partagées entre le client et le serveur.

---

## State Management

Zustand

Utilisation

- état utilisateur
- préférences
- UI locale

Redux est interdit.

---

## Server State

TanStack Query

Utilisation

- récupération des données
- cache
- mutations
- synchronisation

---

## Charts

Recharts

Toutes les visualisations financières utilisent Recharts.

---

## Theme

next-themes

Gestion officielle du thème.

---

## Notifications

Sonner

Gestion unique des Toasts.

---

## Tables

TanStack Table

Pour tous les tableaux avancés.

---

# Backend

## Runtime

Node.js LTS

Toujours utiliser la dernière version LTS.

---

## Framework

Next.js Route Handlers

Aucun backend séparé tant que cela n'est pas nécessaire.

---

## ORM

Prisma ORM

Pourquoi

- Type Safe
- Migrations
- Excellente DX
- Compatible PostgreSQL

---

## Database

PostgreSQL

Développement

Supabase PostgreSQL

Production

PostgreSQL managé.

---

## Authentication

Better Auth

Gestion

- Sessions
- OAuth
- Email
- Password
- MFA (future)

Better Auth est la seule solution d'authentification autorisée.

---

## Password Hashing

Argon2

Jamais bcrypt.

---

## Validation

Zod

Toutes les routes API valident leurs entrées.

---

# Storage

Cloudflare R2

Pourquoi

- Compatible S3
- Pas de frais de sortie
- Très économique
- Facilement remplaçable

Utilisation

- avatars
- pièces jointes
- exports
- documents

---

# Emails

Resend

Utilisation

- vérification email
- réinitialisation mot de passe
- notifications

---

# AI

## Provider

OpenAI

Architecture prévue pour supporter plusieurs fournisseurs.

---

## Future Compatibility

L'architecture devra permettre d'ajouter facilement :

- Anthropic
- Google Gemini
- Mistral
- DeepSeek

Sans modifier le reste de l'application.

---

# Analytics

PostHog

Pourquoi

- Open Source
- Hébergement possible
- Plan gratuit

---

# Monitoring

Sentry

Utilisation

- erreurs frontend
- erreurs backend
- performances

---

# Logging

Pino

Tous les logs serveur utilisent Pino.

---

# Scheduler

Trigger.dev

Pour

- tâches planifiées
- traitements asynchrones
- emails différés

---

# Testing

## Unit Tests

Vitest

---

## Component Tests

React Testing Library

---

## End-to-End

Playwright

---

# API

Architecture

REST

JSON uniquement.

Toutes les routes sont documentées.

---

# Documentation

OpenAPI

Documentation générée automatiquement.

---

# Package Manager

pnpm

npm et yarn sont interdits.

---

# Version Control

Git

Hébergement

GitHub

---

# CI/CD

GitHub Actions

Automatisation

- lint
- tests
- build
- preview

---

# Deployment

Frontend

Vercel

---

Database

Supabase PostgreSQL

---

Storage

Cloudflare R2

---

# Code Quality

Lint

ESLint

---

Formatting

Prettier

---

Git Hooks

Husky

---

Commit Convention

Conventional Commits

---

# Security

Secrets

Variables d'environnement uniquement.

Aucun secret dans le dépôt Git.

---

HTTPS obligatoire.

---

Toutes les dépendances doivent être régulièrement mises à jour.

---

# AI Development

Les assistants IA doivent respecter :

- cette documentation
- Feature-Sliced Design
- les fichiers AGENTS.md présents dans le dépôt

Les assistants IA ne doivent jamais générer du code en dehors de l'architecture définie.

---

# Architecture References

Feature-Sliced Design

https://feature-sliced.design/

---

AI Agents

https://agents.md/

---

# Forbidden Technologies

Interdit

- JavaScript
- Redux
- Bootstrap
- Material UI
- Ant Design
- jQuery
- Moment.js
- CSS Modules
- styled-components
- Emotion
- MobX
- Recoil

---

# Official Stack Summary

| Domaine | Technologie |
|----------|-------------|
| Frontend | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui |
| Icons | Lucide React |
| Animation | Framer Motion |
| Forms | React Hook Form |
| Validation | Zod |
| Local State | Zustand |
| Server State | TanStack Query |
| Charts | Recharts |
| Backend | Next.js Route Handlers |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | Better Auth |
| Storage | Cloudflare R2 |
| Emails | Resend |
| Analytics | PostHog |
| Monitoring | Sentry |
| Scheduler | Trigger.dev |
| Logs | Pino |
| Tests | Vitest + RTL + Playwright |
| Package Manager | pnpm |
| CI/CD | GitHub Actions |
| Hosting | Vercel |

---

# Acceptance Criteria

Une implémentation est conforme si :

- toutes les technologies proviennent de cette liste ;
- aucune dépendance interdite n'est utilisée ;
- l'application reste entièrement TypeScript ;
- toutes les nouvelles fonctionnalités respectent cette stack ;
- l'ensemble du projet est compatible avec Feature-Sliced Design et les workflows des assistants IA.
