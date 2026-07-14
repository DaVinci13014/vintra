# Vintra — Notifications

Version : 1.0

Status : Approved

---

# Purpose

Le système de notifications informe l'utilisateur des événements importants liés à son compte, à son objectif d'épargne et à son activité dans Vintra.

Les notifications doivent apporter une réelle valeur.

Elles ne doivent jamais être utilisées pour générer artificiellement de l'engagement.

Chaque notification doit avoir une utilité.

---

# Scope

Ce document couvre :

- Notifications In-App
- Notifications Push
- Préférences
- États
- Gestion des notifications

---

# Out of Scope

Ce document ne couvre pas :

- Emails transactionnels
- Vérification email
- Emails marketing

---

# Notification Flow

```
Événement

↓

Création de la notification

↓

Enregistrement

↓

Notification In-App

↓

Notification Push (si autorisée)

↓

Lecture

↓

Archivage
```

---

# Notification Types

Les notifications sont regroupées en 5 catégories.

```
Goals

↓

Savings

↓

Recommendations

↓

System

↓

Security
```

---

# NOTIFICATION_001 — Goal Progress

## Purpose

Informer l'utilisateur de la progression de son objectif.

---

## Trigger

Une progression significative est détectée.

---

## Example

🎉 Vous avez atteint 50 % de votre objectif.

---

## Priority

Medium

---

# NOTIFICATION_002 — Goal Completed

## Purpose

Informer que l'objectif est atteint.

---

## Trigger

Progression = 100 %

---

## Example

🎉 Félicitations !

Vous avez atteint votre objectif.

---

## Priority

High

---

# NOTIFICATION_003 — New Recommendation

## Purpose

Informer qu'une nouvelle recommandation est disponible.

---

## Trigger

Le moteur d'analyse génère une nouvelle recommandation.

---

## Example

Nous avons trouvé une nouvelle opportunité d'économiser.

---

# NOTIFICATION_004 — Weekly Summary

## Purpose

Présenter un résumé hebdomadaire.

---

## Trigger

Chaque semaine.

---

## Content

- Progression
- Épargne estimée
- Objectif
- Recommandation principale

---

# NOTIFICATION_005 — Profile Updated

## Purpose

Informer que le profil financier a été recalculé.

---

## Trigger

Modification :

- Revenus
- Charges
- Situation professionnelle

---

## Example

Votre profil financier a été mis à jour.

---

# NOTIFICATION_006 — Security

## Purpose

Informer des événements liés au compte.

---

## Events

Connexion depuis un nouvel appareil

Mot de passe modifié

Adresse email modifiée

Compte supprimé

---

# Notification States

UNREAD

↓

READ

↓

ARCHIVED

---

# Notification Priority

LOW

Informations.

---

MEDIUM

Conseils.

---

HIGH

Objectif atteint.

Sécurité.

---

# Notification Center

Le centre de notifications affiche :

Date

Icône

Titre

Description

État

Action

---

# Available Actions

Ouvrir

Marquer comme lu

Marquer tout comme lu

Supprimer

Supprimer tout

---

# Push Notifications

Les notifications Push sont optionnelles.

L'utilisateur choisit celles qu'il souhaite recevoir.

---

# Available Preferences

Goal Progress

ON / OFF

---

Recommendations

ON / OFF

---

Weekly Summary

ON / OFF

---

Security

ON / OFF

Obligatoire.

---

# Business Rules

## BR-001

Les notifications de sécurité ne peuvent pas être désactivées.

---

## BR-002

Les notifications sont toujours triées par date décroissante.

---

## BR-003

Une notification déjà lue ne revient jamais à l'état UNREAD.

---

## BR-004

Les notifications supprimées sont définitivement supprimées.

---

## BR-005

Maximum 100 notifications conservées.

Les plus anciennes sont automatiquement archivées.

---

# UI Components

NotificationCenter

NotificationCard

NotificationBadge

NotificationIcon

NotificationFilters

NotificationSettings

EmptyState

---

# Empty State

Titre

Aucune notification.

Description

Tout est à jour.

---

# Loading State

Skeleton Loader

---

# Error State

Impossible de charger les notifications.

Bouton

Réessayer.

---

# Technical Requirements

Framework

Next.js App Router

---

Fetching

Server Actions

---

Realtime

Supabase Realtime

---

Pagination

20 notifications par page.

---

Sorting

Date décroissante.

---

# Suggested Routes

/notifications

/settings/notifications

---

# TypeScript

```ts
interface Notification {

id: string;

title: string;

description: string;

type:
| "GOAL"
| "SAVINGS"
| "RECOMMENDATION"
| "SYSTEM"
| "SECURITY";

priority:
| "LOW"
| "MEDIUM"
| "HIGH";

status:
| "UNREAD"
| "READ"
| "ARCHIVED";

createdAt: Date;

}
```

---

# Analytics

Events

notification_opened

notification_clicked

notification_deleted

notification_read

notification_settings_updated

---

# Acceptance Criteria

✓ Centre de notifications fonctionnel.

✓ Gestion des états.

✓ Push configurables.

✓ Notifications triées.

✓ Notifications de sécurité obligatoires.

✓ Responsive mobile.

✓ Responsive tablette.

✓ Responsive desktop.
