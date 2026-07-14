# Vintra — API Specification

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit les interfaces de communication entre le Frontend, les Server Actions et les Services métier.

L'objectif est de standardiser :

- les entrées ;
- les sorties ;
- les validations ;
- les erreurs ;
- les conventions de développement.

Toutes les opérations métier transitent par une Server Action.

Les composants React ne doivent jamais communiquer directement avec la base de données.

---

# Scope

Ce document couvre :

- Server Actions
- Contrats d'entrée
- Contrats de sortie
- Validation
- Gestion des erreurs
- Organisation des services

---

# Out of Scope

Ce document ne couvre pas :

- Structure de la base de données
- Calculs métier
- Authentification interne Supabase

---

# Architecture

```
React Component

↓

Server Action

↓

Business Service

↓

Repository

↓

Supabase

↓

Response
```

---

# Response Format

Toutes les Server Actions retournent le même format.

```ts
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};
```

---

# Validation

Toutes les données reçues sont validées avec Zod.

Une validation est effectuée :

- côté client ;
- côté serveur.

La validation serveur est obligatoire.

---

# AUTH ACTIONS

## register()

### Purpose

Créer un nouvel utilisateur.

---

Input

```ts
{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
```

---

Output

```ts
ApiResponse<{
  userId: string;
}>
```

---

Possible Errors

AUTH_EMAIL_ALREADY_EXISTS

AUTH_INVALID_EMAIL

AUTH_WEAK_PASSWORD

SERVER_ERROR

---

## login()

Input

```ts
{
  email: string;
  password: string;
}
```

---

Output

```ts
ApiResponse<User>
```

---

## logout()

Input

Aucun.

---

Output

```ts
ApiResponse<boolean>
```

---

## forgotPassword()

Input

```ts
{
  email: string;
}
```

---

Output

```ts
ApiResponse<boolean>
```

---

## resetPassword()

Input

```ts
{
  password: string;
}
```

---

Output

```ts
ApiResponse<boolean>
```

---

# PROFILE ACTIONS

## getProfile()

Purpose

Retourner le profil complet.

---

Input

Aucun.

---

Output

```ts
ApiResponse<Profile>
```

---

## updateProfile()

Input

```ts
Partial<Profile>
```

---

Output

```ts
ApiResponse<Profile>
```

---

Business Rules

Toute modification importante déclenche automatiquement :

- une nouvelle analyse ;
- un nouveau profil financier ;
- un nouveau Saving Plan.

---

# ONBOARDING ACTIONS

## saveStep()

Purpose

Sauvegarder une étape de l'onboarding.

---

Input

```ts
{
  step: number;
  values: unknown;
}
```

---

Output

```ts
ApiResponse<boolean>
```

---

## completeOnboarding()

Purpose

Terminer le questionnaire.

---

Output

```ts
ApiResponse<AnalysisResult>
```

---

# DASHBOARD ACTIONS

## getDashboard()

Output

```ts
ApiResponse<Dashboard>
```

---

# GOALS ACTIONS

## createGoal()

Input

```ts
{
  title: string;
  targetAmount: number;
  targetDate: Date;
}
```

---

Output

```ts
ApiResponse<Goal>
```

---

## updateGoal()

Input

```ts
Partial<Goal>
```

---

Output

```ts
ApiResponse<Goal>
```

---

## deleteGoal()

Input

Goal ID

---

Output

```ts
ApiResponse<boolean>
```

---

# RECOMMENDATIONS ACTIONS

## getRecommendations()

Output

```ts
ApiResponse<Recommendation[]>
```

---

# NOTIFICATIONS ACTIONS

## getNotifications()

Output

```ts
ApiResponse<Notification[]>
```

---

## markAsRead()

Input

Notification ID

---

Output

```ts
ApiResponse<boolean>
```

---

## deleteNotification()

Input

Notification ID

---

Output

```ts
ApiResponse<boolean>
```

---

# SETTINGS ACTIONS

## updatePreferences()

Input

```ts
Preferences
```

---

Output

```ts
ApiResponse<Preferences>
```

---

## changePassword()

Input

```ts
{
  currentPassword: string;
  newPassword: string;
}
```

---

Output

```ts
ApiResponse<boolean>
```

---

## deleteAccount()

Input

Confirmation utilisateur.

---

Output

```ts
ApiResponse<boolean>
```

---

# Error Codes

Toutes les erreurs doivent utiliser un code unique.

Exemples :

AUTH_INVALID_EMAIL

AUTH_INVALID_PASSWORD

AUTH_UNAUTHORIZED

PROFILE_NOT_FOUND

GOAL_NOT_FOUND

GOAL_ALREADY_EXISTS

ANALYSIS_FAILED

RECOMMENDATION_NOT_FOUND

NOTIFICATION_NOT_FOUND

VALIDATION_ERROR

SERVER_ERROR

UNKNOWN_ERROR

---

# Error Response

```ts
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Le formulaire est invalide."
  }
}
```

---

# Security Rules

Toutes les Server Actions doivent :

- vérifier la session utilisateur ;
- vérifier les permissions ;
- valider les données ;
- journaliser les erreurs critiques.

Aucune Server Action ne doit faire confiance aux données envoyées par le client.

---

# Logging

Toutes les erreurs critiques sont enregistrées.

Les données sensibles ne sont jamais présentes dans les logs.

---

# Performance

Les Server Actions doivent être :

- idempotentes lorsque possible ;
- rapides ;
- optimisées.

Objectif :

Temps moyen inférieur à 300 ms (hors calculs complexes).

---

# Folder Structure

```
app/actions/

auth/

profile/

dashboard/

goals/

notifications/

settings/

analysis/

recommendations/
```

---

# Acceptance Criteria

✓ Toutes les fonctionnalités utilisent des Server Actions.

✓ Toutes les entrées sont validées.

✓ Toutes les réponses respectent le format ApiResponse.

✓ Les erreurs sont standardisées.

✓ Les actions sont sécurisées.

✓ Les composants React n'accèdent jamais directement à Supabase.

✓ Les services métier restent indépendants de l'interface utilisateur.
