# Vintra — Deployment Strategy

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit la stratégie officielle de déploiement de Vintra.

L'objectif est de garantir :

- des déploiements fiables ;
- des environnements cohérents ;
- une disponibilité maximale ;
- un retour arrière rapide en cas de problème.

Le processus doit être reproductible et entièrement automatisé.

---

# Deployment Philosophy

Le déploiement ne doit jamais être une étape manuelle.

Chaque version doit pouvoir être reconstruite et redéployée à tout moment.

La production doit toujours être dans un état stable.

---

# Environments

Vintra possède trois environnements.

---

## Development

Utilisation

Développement local.

Objectif

Créer de nouvelles fonctionnalités.

Base de données

Locale ou Supabase Development.

---

## Preview

Créé automatiquement pour chaque Pull Request.

Objectif

Validation.

Tests fonctionnels.

Relecture.

Chaque Preview est isolée.

---

## Production

Version publique de Vintra.

Toujours stable.

Aucun développement direct.

---

# Hosting

Frontend

Vercel

---

Backend

Next.js Route Handlers

Déployés sur Vercel.

---

Database

Supabase PostgreSQL.

---

Storage

Cloudflare R2.

---

Emails

Resend.

---

# Source Control

Repository

GitHub.

---

Branches

main

↓

production

---

develop

↓

développement

---

feature/*

↓

nouvelles fonctionnalités

---

fix/*

↓

correctifs

---

# Deployment Workflow

Feature Branch

↓

Pull Request

↓

Code Review

↓

Tests

↓

Preview Deployment

↓

Validation

↓

Merge

↓

Production Deployment

---

# Automatic Deployment

Chaque merge sur

main

déclenche automatiquement :

- build ;
- tests ;
- déploiement production.

---

# Preview Deployments

Chaque Pull Request génère automatiquement :

- une URL unique ;
- un environnement isolé ;
- une base de validation.

---

# Build Requirements

Le build doit échouer si :

- TypeScript contient des erreurs ;
- ESLint échoue ;
- les tests échouent ;
- la compilation échoue.

Aucun déploiement ne doit avoir lieu.

---

# Environment Variables

Toutes les variables sont stockées dans :

Vercel Environment Variables.

Jamais dans Git.

---

Variables sensibles

- DATABASE_URL
- BETTER_AUTH_SECRET
- OPENAI_API_KEY
- RESEND_API_KEY
- SENTRY_AUTH_TOKEN

---

# Secrets

Les secrets :

- ne sont jamais affichés ;
- ne sont jamais commités ;
- ne sont jamais écrits dans les logs.

---

# Database Migrations

Toutes les migrations passent par Prisma.

Workflow

Créer migration

↓

Tester

↓

Déployer

↓

Appliquer en production

---

Les migrations sont versionnées.

---

# Rollback Strategy

En cas d'incident critique :

1.

Identifier la version déployée.

↓

2.

Revenir à la dernière version stable.

↓

3.

Corriger le problème.

↓

4.

Redéployer.

---

Le rollback doit être rapide.

---

# Monitoring

Utiliser

Sentry

pour :

- erreurs
- exceptions
- performances

---

# Analytics

Utiliser

PostHog

pour :

- événements
- parcours utilisateur
- adoption des fonctionnalités

---

# Logging

Tous les logs serveur utilisent

Pino.

---

Les logs sensibles sont interdits.

---

# Health Checks

L'application doit permettre de vérifier :

- disponibilité ;
- connexion base de données ;
- état général.

---

# Backups

La base PostgreSQL doit être sauvegardée régulièrement.

Les sauvegardes doivent être testées.

Une sauvegarde inutilisable n'est pas une sauvegarde.

---

# Security

HTTPS obligatoire.

Cookies sécurisés.

Headers de sécurité activés.

Aucun secret exposé.

---

# Performance

Avant chaque mise en production :

Vérifier

- Lighthouse
- Bundle Size
- Temps de chargement
- Temps de build

---

# Versioning

Le projet suit

Semantic Versioning.

Format

MAJOR.MINOR.PATCH

Exemple

1.0.0

1.1.0

1.1.1

---

# Release Notes

Chaque version possède :

- résumé ;
- nouvelles fonctionnalités ;
- corrections ;
- breaking changes.

---

# Deployment Checklist

Avant de déployer :

✓ Build réussi

✓ TypeScript sans erreur

✓ ESLint sans erreur

✓ Tests validés

✓ Migrations vérifiées

✓ Variables d'environnement présentes

✓ Monitoring opérationnel

✓ Analytics actifs

✓ Documentation à jour

---

# Incident Management

En cas d'incident :

1.

Identifier.

↓

2.

Limiter l'impact.

↓

3.

Rollback si nécessaire.

↓

4.

Corriger.

↓

5.

Documenter.

---

# AI Rules

Les assistants IA :

- ne déploient jamais directement en production ;
- respectent le workflow Git ;
- ne modifient jamais les secrets ;
- ne contournent jamais les validations automatiques.

---

# Forbidden

Interdit

- déploiement manuel en production
- modification directe sur main
- secrets dans Git
- migrations non testées
- build avec erreurs
- désactivation des tests
- désactivation du monitoring

---

# Acceptance Criteria

Le processus de déploiement est conforme si :

- tous les environnements sont clairement définis ;
- les déploiements sont automatisés ;
- les validations sont obligatoires ;
- les secrets sont protégés ;
- un rollback est possible à tout moment ;
- la production reste stable et reproductible.
