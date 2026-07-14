# Vintra — Security

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit la politique de sécurité de Vintra.

Son objectif est de protéger :

- Les données des utilisateurs
- Les sessions
- Les informations financières
- Les communications
- Les accès au système

Toutes les fonctionnalités de Vintra doivent respecter les règles décrites dans ce document.

---

# Scope

Ce document couvre :

- Authentification
- Autorisation
- Gestion des sessions
- Validation
- Protection des données
- Chiffrement
- Sécurité applicative
- Journalisation

---

# Out of Scope

Ce document ne couvre pas :

- Infrastructure cloud
- Sauvegardes
- Déploiement

Ces sujets sont documentés séparément.

---

# Security Principles

Vintra applique les principes suivants :

- Least Privilege
- Zero Trust
- Defense in Depth
- Secure by Default
- Privacy by Design

---

# Authentication

L'authentification est gérée par Supabase Auth.

Méthodes autorisées :

- Email / Mot de passe

Toutes les sessions sont vérifiées côté serveur.

---

# Authorization

Toutes les ressources sont privées.

Un utilisateur ne peut accéder qu'à ses propres données.

Toutes les vérifications d'autorisation sont réalisées côté serveur.

Le frontend ne doit jamais être considéré comme une source de confiance.

---

# Session Management

Les sessions sont gérées par Supabase.

Les tokens sont automatiquement renouvelés.

Les sessions expirées sont invalidées.

La déconnexion supprime immédiatement la session active.

---

# Password Policy

Minimum :

8 caractères

Obligatoire :

- 1 majuscule
- 1 minuscule
- 1 chiffre

Recommandé :

- 1 caractère spécial

Les mots de passe ne sont jamais stockés dans la base de données.

Le hash est entièrement géré par Supabase Auth.

---

# Data Validation

Toutes les données sont validées :

1. Côté client
2. Côté serveur

La validation serveur est obligatoire.

Toutes les validations utilisent Zod.

---

# Input Sanitization

Toutes les chaînes de caractères doivent être :

- trim()
- normalisées
- validées

Les caractères dangereux sont rejetés ou échappés.

---

# SQL Injection

Toutes les requêtes utilisent :

- Supabase Client
- Paramètres préparés

Aucune requête SQL dynamique construite par concaténation n'est autorisée.

---

# XSS Protection

Toutes les données affichées proviennent de composants React.

Ne jamais utiliser :

```ts
dangerouslySetInnerHTML
```

Sans validation stricte.

---

# CSRF Protection

Les Server Actions Next.js limitent naturellement le risque de CSRF.

Toute action sensible doit vérifier :

- la session utilisateur ;
- les permissions.

---

# Rate Limiting

Limiter les tentatives sur :

Connexion

Maximum :

5 tentatives / minute

---

Création de compte

Maximum :

3 comptes / heure / IP

---

Mot de passe oublié

Maximum :

5 demandes / heure

---

Analyse financière

Maximum :

30 analyses / heure

---

# Row Level Security

Toutes les tables métier utilisent RLS.

Règle générale :

```sql
auth.uid() = profile_id
```

Aucun utilisateur ne peut lire ou modifier les données d'un autre utilisateur.

---

# Secrets Management

Toutes les clés sensibles sont stockées dans les variables d'environnement.

Exemples :

SUPABASE_URL

SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

Aucune clé ne doit être présente dans le dépôt Git.

---

# HTTPS

Toutes les communications utilisent HTTPS.

Les connexions HTTP sont interdites en production.

---

# File Upload Security

Types autorisés :

- JPG
- PNG
- WEBP

Taille maximale :

5 MB

Le type MIME est vérifié côté serveur.

Les fichiers sont renommés avec un identifiant unique.

---

# Error Messages

Les messages affichés aux utilisateurs ne doivent jamais révéler :

- la structure interne ;
- la base de données ;
- les erreurs techniques ;
- les chemins système.

---

# Logging

Toutes les erreurs critiques sont journalisées.

Les logs ne doivent jamais contenir :

- mot de passe
- token
- clé API
- données bancaires

---

# Audit Trail

Les actions suivantes sont historisées :

- Connexion
- Déconnexion
- Modification du profil
- Modification de l'objectif
- Changement de mot de passe
- Suppression du compte

---

# Data Privacy

Toutes les données appartiennent exclusivement à l'utilisateur.

Vintra ne partage jamais les données personnelles avec un tiers sans consentement explicite.

---

# Dependencies

Toutes les dépendances doivent être maintenues à jour.

Les dépendances présentant des vulnérabilités critiques doivent être mises à jour avant toute mise en production.

---

# Security Headers

Les en-têtes HTTP suivants doivent être activés :

- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy
- Content-Security-Policy

---

# Security Checklist

Avant chaque mise en production :

✓ Toutes les variables d'environnement sont configurées.

✓ RLS est activé sur toutes les tables.

✓ Les dépendances sont à jour.

✓ Les secrets ne sont pas présents dans le dépôt.

✓ Les validations serveur sont fonctionnelles.

✓ Les routes protégées sont inaccessibles sans authentification.

✓ Les tests de sécurité sont validés.

---

# Acceptance Criteria

✓ Authentification sécurisée.

✓ Autorisations vérifiées.

✓ Sessions protégées.

✓ Validation côté serveur.

✓ RLS actif sur toutes les tables.

✓ Secrets sécurisés.

✓ HTTPS obligatoire.

✓ Téléversements sécurisés.

✓ Journalisation conforme.

✓ Respect des bonnes pratiques OWASP.
