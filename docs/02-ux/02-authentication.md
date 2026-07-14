# Vintra — Authentication

Version : 1.0

Status : Approved

---

# Purpose

Ce document décrit l'ensemble du système d'authentification de Vintra.

L'objectif est de permettre à un utilisateur de créer un compte sécurisé, vérifier son adresse email, se connecter et récupérer son accès en cas d'oubli du mot de passe.

L'authentification est totalement indépendante de l'onboarding financier.

Un utilisateur authentifié n'est pas forcément un utilisateur ayant terminé son onboarding.

---

# Scope

Ce document couvre :

- Création de compte
- Vérification email
- Connexion
- Déconnexion
- Mot de passe oublié
- Réinitialisation
- Gestion de session
- Redirections
- États utilisateur

---

# Authentication Flow

```
Landing
      │
      ▼
Créer un compte
      │
      ▼
Validation formulaire
      │
      ▼
Création utilisateur
      │
      ▼
Email Verification
      │
      ▼
Email validé
      │
      ▼
Connexion
      │
      ▼
Onboarding
```

Utilisateur existant

```
Landing

↓

Connexion

↓

Session valide ?

↓

Oui

↓

Onboarding terminé ?

↓

Oui → Dashboard

↓

Non → Reprendre Onboarding
```

---

# User State

Chaque utilisateur possède un état.

```
REGISTERED

↓

EMAIL_VERIFIED

↓

AUTHENTICATED

↓

ONBOARDING_IN_PROGRESS

↓

ONBOARDING_COMPLETED

↓

ACTIVE
```

Ces états servent aux redirections automatiques.

---

# AUTH_001 — Register

## Purpose

Créer un nouveau compte utilisateur.

---

## Screen

Titre

Créer votre compte

Description

Bienvenue sur Vintra.

Commençons par créer votre espace personnel.

---

## Components

- First Name Input
- Last Name Input
- Email Input
- Password Input
- Confirm Password Input
- Primary Button
- Login Link

---

## Fields

### First Name

Type

text

Required

Yes

Validation

Minimum 2 caractères

Maximum 50 caractères

Trim automatique

Première lettre en majuscule

---

### Last Name

Même validation.

---

### Email

Type

email

Validation

RFC Email

Lowercase automatique

Unique

Trim

---

### Password

Minimum

8 caractères

Obligatoire

Contenir

- une majuscule
- une minuscule
- un chiffre

---

### Confirm Password

Doit être identique.

---

# Form Validation

Le bouton

Créer mon compte

reste désactivé tant que :

- un champ est vide
- email invalide
- mot de passe faible
- confirmation différente

---

# Password Rules UI

Afficher en temps réel :

✓ 8 caractères

✓ Une majuscule

✓ Une minuscule

✓ Un chiffre

---

# Loading State

Pendant la création :

Le bouton devient

Loading

Texte

Création du compte...

Tous les champs deviennent désactivés.

---

# Success

Création du compte.

↓

Email envoyé.

↓

Redirection vers AUTH_002.

---

# Failure

Afficher le message adapté.

Ne jamais effacer les champs.

---

# AUTH_002 — Email Verification

## Purpose

Vérifier l'adresse email.

---

## Screen

Titre

Vérifiez votre adresse email.

Description

Nous venons d'envoyer un email de confirmation.

---

## Components

Illustration

Bouton

Renvoyer l'email

Bouton

Changer d'adresse email

---

## Auto Refresh

Toutes les 5 secondes

Vérifier si l'email est confirmé.

Dès validation :

↓

Connexion automatique.

↓

Redirection vers Onboarding.

---

# AUTH_003 — Login

## Purpose

Authentifier un utilisateur existant.

---

## Components

Email

Password

Remember Me

Forgot Password

Primary Button

---

## Validation

Email obligatoire.

Password obligatoire.

---

## Success

Connexion.

↓

Si onboarding terminé

↓

Dashboard

Sinon

↓

Reprise Onboarding.

---

# AUTH_004 — Forgot Password

## Purpose

Envoyer un email de réinitialisation.

---

## Components

Email

Submit Button

Retour connexion

---

# Success

Afficher

Nous avons envoyé un email de réinitialisation.

---

# AUTH_005 — Reset Password

## Components

Nouveau mot de passe

Confirmation

Button

---

Validation identique au Register.

---

# Session Management

Session persistante.

Expiration selon Supabase Auth.

Refresh Token automatique.

Déconnexion sur token invalide.

---

# Route Protection

Routes publiques

/

login

register

forgot-password

reset-password

Routes protégées

/dashboard

/settings

/goals

/profile

Onboarding

Si utilisateur connecté

mais onboarding incomplet

↓

Redirection automatique

/onboarding

---

# Business Rules

BR-001

Une adresse email ne peut posséder qu'un seul compte.

---

BR-002

Email obligatoire.

---

BR-003

Email vérifié obligatoire.

---

BR-004

Impossible d'accéder au Dashboard sans onboarding terminé.

---

BR-005

Impossible de revenir au Register lorsqu'on est connecté.

---

BR-006

Un utilisateur déjà connecté est automatiquement redirigé.

---

# Error States

Email déjà utilisé

↓

Afficher erreur sous le champ.

-------------------

Mot de passe incorrect

↓

Erreur générique.

Ne jamais préciser quel champ est incorrect.

-------------------

Lien expiré

↓

Afficher

Votre lien a expiré.

Demander un nouveau lien.

-------------------

Erreur serveur

↓

Toast

Une erreur est survenue.

Veuillez réessayer.

---

# Security Rules

Hash password

Jamais stocker en clair.

Validation serveur obligatoire.

Protection CSRF.

Protection XSS.

Protection brute force.

Rate limit sur Login.

Rate limit sur Register.

Rate limit sur Forgot Password.

---

# Analytics

Events

auth_register_started

auth_register_success

auth_login

auth_logout

auth_password_reset

auth_email_verified

---

# Acceptance Criteria

✓ Création de compte fonctionnelle

✓ Validation des champs

✓ Email obligatoire

✓ Vérification email

✓ Connexion

✓ Déconnexion

✓ Réinitialisation mot de passe

✓ Gestion automatique des sessions

✓ Redirection correcte selon l'état utilisateur

✓ Sécurité conforme

✓ Aucun accès aux routes protégées sans authentification
