# Vintra — User Journey

> Version : 1.0
>
> Status : Draft

---

# Purpose

Ce document décrit le parcours complet d'un utilisateur dans Vintra.

Son objectif est de définir toutes les étapes de navigation, les transitions entre les écrans et les principales règles métier.

Ce document ne décrit pas le contenu détaillé de chaque écran.

---

# Scope

Ce document couvre :

- Première visite
- Authentification
- Onboarding
- Analyse
- Création d'objectif
- Tableau de bord
- Utilisation quotidienne
- Paramètres
- Déconnexion

---

# Out of Scope

Ce document ne couvre pas :

- Les composants UI
- Les validations des formulaires
- Les appels API
- La base de données
- Les calculs

Ces éléments sont documentés dans les fichiers dédiés.

---

# User Journey Overview

```text
Landing Page
        │
        ▼
Authentication
        │
        ▼
Email Verification
        │
        ▼
Profile Creation
        │
        ▼
Onboarding
        │
        ▼
Financial Analysis
        │
        ▼
Goal Creation
        │
        ▼
Dashboard
        │
        ▼
Daily Usage
        │
        ▼
Settings
```

---

# Journey 01 — Landing

## Entry Point

L'utilisateur découvre Vintra.

Il peut arriver depuis :

- Recherche Google
- Réseau social
- Recommandation
- Lien direct

## Primary Goal

Créer un compte.

## Possible Actions

- Découvrir le produit
- Commencer l'inscription
- Se connecter

## Exit

L'utilisateur clique sur **Commencer**.

---

# Journey 02 — Authentication

Objectif :

Créer un compte ou se connecter.

À la fin de cette étape :

L'utilisateur possède un compte valide.

Cas possibles :

- Nouveau compte
- Connexion
- Mot de passe oublié

Si le compte est créé :

↓

Email de vérification.

---

# Journey 03 — Email Verification

Objectif :

Vérifier l'adresse email.

Cas possibles :

Email validé

↓

Suite de l'inscription

Email non validé

↓

Blocage de certaines fonctionnalités.

---

# Journey 04 — Profile Creation

Objectif :

Créer le profil utilisateur.

Le profil est initialisé avec :

- identifiant
- email
- date de création
- statut onboarding = false

Une fois créé :

↓

Début de l'onboarding.

---

# Journey 05 — Onboarding

Objectif :

Comprendre la situation financière.

Le questionnaire est composé de plusieurs sections :

1. Informations personnelles

2. Revenus

3. Logement

4. Dépenses

5. Épargne

6. Habitudes financières

7. Objectif

Toutes les réponses sont sauvegardées automatiquement.

L'utilisateur peut interrompre le questionnaire et reprendre plus tard.

À la fin :

↓

Lancement de l'analyse.

---

# Journey 06 — Financial Analysis

Objectif :

Transformer les réponses en informations exploitables.

Les résultats générés sont :

- Profil financier
- Estimation de la capacité d'épargne
- Points forts
- Points d'amélioration
- Recommandations

Une fois terminée :

↓

Création de l'objectif.

---

# Journey 07 — Goal Creation

Objectif :

Créer le premier objectif d'épargne.

Informations :

- Nom
- Montant
- Date cible

Une fois validé :

↓

Dashboard.

---

# Journey 08 — Dashboard

Le Dashboard devient la page principale.

Il affiche :

- Progression
- Objectif actif
- Épargne estimée
- Recommandations
- Actions rapides

Depuis cet écran, l'utilisateur peut accéder à toutes les fonctionnalités.

---

# Journey 09 — Daily Usage

Lors des utilisations suivantes :

Connexion

↓

Dashboard

↓

Consultation de la progression

↓

Modification éventuelle des informations

↓

Déconnexion

Le questionnaire initial n'est plus affiché.

---

# Journey 10 — Settings

Depuis les paramètres, l'utilisateur peut :

- Modifier son profil
- Modifier ses revenus
- Modifier son objectif
- Changer son mot de passe
- Gérer les notifications
- Supprimer son compte

---

# Business Rules

## BR-001

Un utilisateur doit posséder un compte avant de commencer le questionnaire.

---

## BR-002

Le questionnaire ne peut être réalisé qu'une seule fois.

Par la suite, seules des modifications sont possibles.

---

## BR-003

Toutes les réponses sont sauvegardées automatiquement.

---

## BR-004

L'analyse est générée uniquement lorsque toutes les étapes obligatoires sont terminées.

---

## BR-005

Un utilisateur doit posséder un objectif actif.

---

## BR-006

Le Dashboard est inaccessible tant que l'analyse n'est pas terminée.

---

# Navigation Rules

Landing

↓

Authentication

↓

Onboarding

↓

Analysis

↓

Goal

↓

Dashboard

Une fois sur le Dashboard, l'utilisateur peut naviguer librement.

---

# Error Flows

## Utilisateur quitte pendant l'onboarding

Le questionnaire reprend exactement où il s'est arrêté.

---

## Connexion interrompue

Les données déjà enregistrées sont conservées.

---

## Analyse impossible

Afficher un message d'erreur.

Proposer de relancer le calcul.

---

# Success Criteria

Le parcours est considéré comme réussi lorsque :

- Le compte est créé.
- L'onboarding est terminé.
- L'analyse est générée.
- Un objectif est créé.
- Le Dashboard est accessible.

---

# Future Documents

Les détails de chaque étape sont documentés séparément :

- Authentication
- Onboarding
- Dashboard
- Goals
- Settings
- Notifications
