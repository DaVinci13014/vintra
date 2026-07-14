# Vintra — Development Rules

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit les règles de développement officielles de Vintra.

Toutes les contributions, qu'elles proviennent d'un développeur humain ou d'un assistant IA, doivent respecter ces règles.

L'objectif est de produire un code :

- lisible ;
- maintenable ;
- évolutif ;
- cohérent ;
- performant.

La qualité du code est une priorité.

---

# Engineering Philosophy

Avant d'écrire du code, toujours se demander :

- Est-ce la solution la plus simple ?
- Est-ce qu'un autre développeur comprendra ce code dans un an ?
- Peut-on supprimer du code plutôt qu'en ajouter ?
- Cette solution respecte-t-elle l'architecture existante ?

Le meilleur code est souvent celui qui n'a pas besoin d'être écrit.

---

# General Principles

Toujours privilégier :

- simplicité ;
- lisibilité ;
- réutilisabilité ;
- cohérence ;
- performance.

Éviter les optimisations prématurées.

---

# SOLID

Tous les développements doivent respecter les principes SOLID.

- Single Responsibility
- Open / Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

---

# DRY

Ne jamais dupliquer du code.

Si une logique est utilisée plusieurs fois, elle doit être extraite.

---

# KISS

Toujours choisir la solution la plus simple.

Une solution complexe doit être justifiée.

---

# YAGNI

Ne jamais développer une fonctionnalité qui n'est pas nécessaire aujourd'hui.

Préparer l'architecture.

Ne pas implémenter des fonctionnalités hypothétiques.

---

# TypeScript

Strict Mode obligatoire.

Interdits :

- any
- @ts-ignore
- @ts-nocheck

Utiliser :

- unknown
- generics
- types explicites

---

# Components

Les composants doivent être :

- petits ;
- réutilisables ;
- prévisibles.

Un composant ne doit gérer qu'une seule responsabilité.

---

# Component Size

Objectif

150 lignes maximum.

Limite

250 lignes.

Au-delà :

Découper.

---

# Functions

Objectif

30 lignes maximum.

Limite

50 lignes.

Une fonction réalise une seule action.

---

# Files

Objectif

200 lignes maximum.

Limiter les fichiers "géants".

---

# Naming

Les noms doivent être explicites.

Préférer :

calculateMonthlySaving()

Plutôt que :

calc()

---

Pas d'abréviations inutiles.

---

# Boolean Variables

Toujours commencer par :

is

has

can

should

Exemple

isAuthenticated

hasGoal

canEdit

---

# Constants

Toujours en UPPER_SNAKE_CASE.

Exemple

MAX_GOALS

---

# Enums

Limiter leur utilisation.

Préférer les unions de types TypeScript lorsque possible.

---

# Comments

Les commentaires doivent expliquer le "pourquoi".

Jamais le "quoi".

Le code doit être suffisamment clair pour se comprendre seul.

---

# Imports

Toujours utiliser les imports absolus.

Exemple

@/shared/ui/button

Jamais

../../../../button

---

# Folder Rules

Respect strict de Feature-Sliced Design.

Aucune exception.

---

# Business Logic

La logique métier ne doit jamais être dans :

- les composants ;
- les pages ;
- les layouts.

Elle doit être isolée.

---

# Validation

Toutes les données externes sont validées avec Zod.

Jamais de confiance implicite.

---

# Error Handling

Toutes les erreurs doivent être gérées.

Jamais de catch vide.

Chaque erreur doit :

- être loggée ;
- être compréhensible ;
- être exploitable.

---

# Async Code

Toujours utiliser

async / await

Éviter les chaînes de .then()

---

# API

Toutes les routes doivent :

- valider les entrées ;
- retourner des réponses cohérentes ;
- gérer les erreurs ;
- retourner des codes HTTP corrects.

---

# Security

Ne jamais :

- exposer un secret ;
- faire confiance au client ;
- stocker des données sensibles dans le navigateur.

Toutes les validations importantes sont faites côté serveur.

---

# Performance

Limiter les re-render.

Utiliser :

- memo
- useMemo
- useCallback

Uniquement lorsqu'ils apportent un réel bénéfice.

---

# Accessibility

Tous les composants doivent être accessibles.

Obligatoire :

- navigation clavier ;
- aria-label ;
- focus visible ;
- contraste conforme.

---

# Styling

Utiliser uniquement :

Tailwind CSS

Aucun style inline complexe.

---

# Dependencies

Avant d'ajouter une dépendance :

1. Existe-t-elle déjà dans le projet ?

2. Peut-on résoudre le problème sans dépendance ?

3. Est-elle maintenue ?

4. Est-elle TypeScript First ?

5. Est-elle compatible avec la stack officielle ?

---

# Git

Branches

feature/

fix/

refactor/

docs/

---

Commits

Conventional Commits

Exemples

feat:

fix:

docs:

refactor:

test:

chore:

---

# Pull Requests

Une Pull Request doit :

- résoudre un seul problème ;
- être relue ;
- passer tous les tests ;
- compiler sans erreur.

---

# Testing

Chaque nouvelle logique métier doit être testée.

Les tests doivent être :

- simples ;
- rapides ;
- indépendants.

---

# Logging

Utiliser Pino.

Jamais

console.log()

dans le code de production.

---

# Documentation

Toute fonctionnalité complexe doit être documentée.

Un dossier complexe possède un README.md.

---

# AI Development

Les assistants IA doivent :

- respecter cette documentation ;
- ne jamais contourner les règles ;
- privilégier la cohérence plutôt que la créativité ;
- proposer une refactorisation si nécessaire.

---

# Code Review Checklist

Avant de valider un développement :

✓ Le code compile.

✓ Les tests passent.

✓ Aucun any.

✓ Aucun code dupliqué.

✓ Noms explicites.

✓ Architecture respectée.

✓ Pas de logique dans les composants.

✓ Validation avec Zod.

✓ Gestion des erreurs.

✓ Accessibilité respectée.

✓ Performance correcte.

✓ Documentation mise à jour.

---

# Forbidden

Interdit

- any
- console.log()
- code mort
- commentaires inutiles
- duplication de logique
- imports relatifs profonds
- composants géants
- fonctions géantes
- dépendances inutiles
- optimisation prématurée
- hacks temporaires laissés en production
- TODO sans ticket associé

---

# Acceptance Criteria

Le code est considéré conforme si :

- il respecte l'ensemble de ces règles ;
- il est lisible et maintenable ;
- il suit l'architecture officielle ;
- il est entièrement TypeScript ;
- il peut être compris rapidement par un nouveau développeur ou un assistant IA ;
- il contribue à maintenir un niveau de qualité constant sur l'ensemble de Vintra.
