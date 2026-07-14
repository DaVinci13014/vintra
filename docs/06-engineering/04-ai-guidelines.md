# Vintra — AI Guidelines

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit les règles que doivent respecter tous les assistants IA participant au développement de Vintra.

Il garantit que le code généré reste cohérent avec l'architecture, le Design System et les standards d'ingénierie du projet.

Tous les assistants IA doivent considérer cette documentation comme la source de vérité.

---

# Scope

Ces règles s'appliquent à :

- Codex
- ChatGPT
- Cursor
- Claude Code
- Gemini CLI
- tout autre assistant IA utilisé sur le projet

---

# AI Philosophy

Les assistants IA sont des outils d'assistance.

Ils ne prennent jamais de décisions d'architecture.

Ils appliquent uniquement les règles définies dans la documentation officielle de Vintra.

En cas de doute :

Ne pas inventer.

Demander une clarification.

---

# Documentation Priority

L'assistant IA doit toujours respecter l'ordre suivant :

1. Product Documentation

↓

2. UX Documentation

↓

3. Features Documentation

↓

4. Technical Documentation

↓

5. Design Documentation

↓

6. Engineering Documentation

↓

7. Demande utilisateur

Si deux règles sont en conflit, la documentation la plus spécifique est prioritaire.

---

# Architecture

Toutes les générations de code doivent respecter :

- Feature-Sliced Design
- Next.js App Router
- TypeScript Strict
- Architecture officielle du projet

Aucune exception.

---

# Technology Stack

L'assistant ne doit utiliser que les technologies validées dans :

01-tech-stack.md

Aucune nouvelle dépendance ne peut être ajoutée sans validation.

---

# Code Quality

Le code généré doit être :

- lisible
- simple
- fortement typé
- documenté lorsque nécessaire
- facilement testable

Le code complexe doit être évité.

---

# TypeScript

Obligatoire.

Interdit :

- any
- ts-ignore
- ts-nocheck

Préférer :

- unknown
- Generic Types
- Types explicites

---

# Components

Les composants doivent :

- être petits
- être réutilisables
- respecter le Design System

Ils ne contiennent jamais de logique métier.

---

# Business Logic

Toute logique métier doit être placée dans la couche appropriée.

Jamais dans :

- Components
- Pages
- Layouts

---

# Validation

Toutes les données utilisateur doivent être validées avec Zod.

Aucune donnée externe ne doit être considérée comme fiable.

---

# Styling

Toutes les interfaces utilisent :

- Tailwind CSS
- shadcn/ui
- Lucide React

Aucun autre framework UI.

---

# Design System

L'assistant IA doit respecter :

- les Design Tokens
- les Components
- le Motion System
- les Brand Guidelines

Aucune décision visuelle ne doit être improvisée.

---

# Naming

Respecter les conventions officielles.

Folders

kebab-case

Components

PascalCase

Hooks

useSomething

Variables

camelCase

Constants

UPPER_SNAKE_CASE

---

# Imports

Toujours utiliser les imports absolus.

Les imports relatifs profonds sont interdits.

---

# Public API

Chaque module est utilisé via son fichier index.ts.

L'assistant ne doit jamais importer directement un fichier interne d'un module.

---

# Error Handling

Toutes les erreurs doivent être gérées.

Jamais de catch vide.

Les erreurs doivent être :

- compréhensibles
- exploitables
- loggées

---

# Security

L'assistant ne doit jamais :

- exposer une clé API
- écrire un secret dans le code
- faire confiance au client
- contourner l'authentification

---

# Performance

Le code doit éviter :

- les re-render inutiles
- les calculs répétés
- les dépendances inutiles

Les optimisations doivent rester simples et justifiées.

---

# Dependencies

Avant de proposer une nouvelle dépendance, vérifier :

- existe-t-il déjà une solution dans le projet ?
- la dépendance est-elle réellement nécessaire ?
- est-elle TypeScript First ?
- est-elle maintenue ?

---

# Tests

Toute nouvelle logique métier doit être accompagnée de tests adaptés.

Les tests doivent rester simples et indépendants.

---

# Documentation

Toute fonctionnalité importante doit être accompagnée d'une documentation si nécessaire.

La documentation officielle doit rester synchronisée avec le code.

---

# Refactoring

L'assistant peut proposer une refactorisation uniquement si :

- elle simplifie le code ;
- elle améliore la lisibilité ;
- elle respecte l'architecture existante.

Elle ne doit jamais modifier le comportement fonctionnel sans demande explicite.

---

# Forbidden

Interdit :

- changer l'architecture
- modifier le Design System
- ajouter une dépendance non validée
- ignorer TypeScript
- contourner Better Auth
- contourner Prisma
- contourner Feature-Sliced Design
- générer du code non documenté lorsque la logique est complexe

---

# Code Generation Checklist

Avant de générer du code, vérifier :

✓ Architecture respectée

✓ Stack officielle utilisée

✓ TypeScript Strict

✓ Design System respecté

✓ Nommage conforme

✓ Validation avec Zod

✓ Gestion des erreurs

✓ Accessibilité

✓ Responsive

✓ Performance

---

# Acceptance Criteria

Une contribution IA est conforme si :

- elle respecte toute la documentation officielle de Vintra ;
- elle n'introduit aucune dette technique ;
- elle reste cohérente avec l'architecture existante ;
- elle peut être intégrée sans modification majeure.
