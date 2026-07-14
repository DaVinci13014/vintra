# Vintra — Settings

Version : 1.0

Status : Approved

---

# Purpose

La page Paramètres permet à l'utilisateur de gérer son compte, son profil, ses préférences et la sécurité de son espace personnel.

Elle centralise toutes les informations pouvant être modifiées après l'onboarding.

Les modifications effectuées ici doivent être immédiatement prises en compte par l'ensemble de l'application.

---

# Scope

Ce document couvre :

- Profil utilisateur
- Préférences
- Sécurité
- Données personnelles
- Déconnexion
- Suppression du compte

---

# Out of Scope

Ce document ne couvre pas :

- Dashboard
- Objectifs
- Analyse financière
- Authentification (hors changement de mot de passe)

---

# Navigation

```
Dashboard

↓

Settings

↓

Choix d'une section

↓

Modification

↓

Sauvegarde

↓

Retour Dashboard
```

---

# Settings Structure

Le menu Paramètres est composé de 6 sections.

```
Mon Profil

↓

Préférences

↓

Sécurité

↓

Confidentialité

↓

Support

↓

Compte
```

---

# SETTINGS_001 — Mon Profil

## Purpose

Permettre à l'utilisateur de modifier ses informations personnelles.

---

## Editable Fields

Prénom

Nom

Photo de profil

Date de naissance

Pays de résidence

Situation professionnelle

Revenus

Charges

---

## Business Rules

Toute modification impactant l'analyse financière déclenche automatiquement un nouveau calcul du profil.

---

## Components

Avatar Upload

Text Inputs

Select

Currency Inputs

Primary Button

---

# SETTINGS_002 — Préférences

## Purpose

Personnaliser l'expérience utilisateur.

---

## Options

Langue

Devise

Thème

- Clair
- Sombre
- Système

---

## Business Rules

Les préférences sont appliquées immédiatement.

Aucun redémarrage n'est nécessaire.

---

# SETTINGS_003 — Sécurité

## Purpose

Permettre à l'utilisateur de sécuriser son compte.

---

## Actions

Modifier le mot de passe

Voir les sessions actives

Déconnecter toutes les sessions

---

## Password Rules

Minimum

8 caractères

Au moins

- une majuscule
- une minuscule
- un chiffre

---

# SETTINGS_004 — Confidentialité

## Purpose

Donner le contrôle des données personnelles.

---

## Actions

Télécharger mes données

Exporter mon profil

Consulter la politique de confidentialité

---

## Business Rules

Toutes les données exportées doivent appartenir uniquement à l'utilisateur connecté.

---

# SETTINGS_005 — Support

## Actions

Contacter le support

FAQ

Signaler un problème

Donner un avis

Version de l'application

---

# SETTINGS_006 — Compte

## Actions

Déconnexion

Supprimer mon compte

---

# Delete Account

## Confirmation

Titre

Supprimer définitivement votre compte ?

Description

Cette action est irréversible.

Toutes vos données seront définitivement supprimées.

---

## Confirmation Field

L'utilisateur doit saisir :

SUPPRIMER

---

## Components

Confirmation Dialog

Danger Button

Cancel Button

---

# Business Rules

BR-001

Impossible de supprimer un compte sans confirmation.

---

BR-002

La suppression est irréversible.

---

BR-003

Toutes les données utilisateur sont supprimées.

---

BR-004

Toutes les sessions actives sont invalidées.

---

# Loading States

Toutes les actions affichent :

Loading Spinner

Boutons désactivés

---

# Success States

Profil mis à jour.

Préférences enregistrées.

Mot de passe modifié.

Compte supprimé.

---

# Error States

Erreur réseau.

Erreur serveur.

Mot de passe incorrect.

Fichier avatar invalide.

---

# UI Components

SettingsLayout

SettingsSidebar

SettingsSection

ProfileCard

AvatarUploader

PreferencesCard

SecurityCard

PrivacyCard

SupportCard

DangerZone

ConfirmationDialog

PrimaryButton

DangerButton

---

# Technical Requirements

Framework

Next.js App Router

---

Validation

Zod

---

State

Optimistic Updates

---

Fetching

Server Actions

---

Images

Upload sécurisé

Compression automatique

Formats autorisés :

JPG

PNG

WEBP

Maximum :

5 MB

---

# Suggested Routes

/settings

/settings/profile

/settings/preferences

/settings/security

/settings/privacy

/settings/support

---

# TypeScript

```ts
interface UserSettings {

profile: Profile;

preferences: Preferences;

security: SecuritySettings;

}
```

---

# Analytics

Events

settings_opened

profile_updated

preferences_updated

password_changed

avatar_updated

account_deleted

logout_clicked

---

# Acceptance Criteria

✓ Toutes les sections sont accessibles.

✓ Les informations sont modifiables.

✓ Les préférences sont sauvegardées.

✓ Le mot de passe peut être modifié.

✓ Les données peuvent être exportées.

✓ Le compte peut être supprimé.

✓ Toutes les modifications sont immédiatement prises en compte.

✓ Responsive mobile.

✓ Responsive tablette.

✓ Responsive desktop.
