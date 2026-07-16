# Vintra — Database

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit la structure complète de la base de données de Vintra.

La base de données est construite sur PostgreSQL via Supabase.

Toutes les données métier sont stockées dans cette base.

Chaque table doit respecter les principes suivants :

- Cohérence
- Performance
- Sécurité
- Évolutivité
- Normalisation

---

# Scope

Ce document couvre :

- Tables
- Colonnes
- Relations
- Contraintes
- Index
- RLS
- Conventions de nommage

---

# Database Engine

Provider

Supabase

Engine

PostgreSQL

UUID

Version 4

Timezone

UTC

Encoding

UTF-8

---

# Naming Convention

Toutes les tables :

snake_case

Toutes les colonnes :

snake_case

Toutes les clés primaires :

id UUID

Toutes les dates :

created_at

updated_at

---

# Entity Relationship Diagram

```
auth.users
      │
      ▼
profiles
      │
      ├──────────────┐
      ▼              ▼
financial_profiles   goals
      │              │
      ▼              ▼
saving_plans   recommendations
      │              │
      └──────┐       │
             ▼       ▼
        notifications
```

---

# Table : profiles

Description

Informations principales de l'utilisateur.

Primary Key

id

Foreign Key

auth.users.id

---

Columns

| Name | Type | Nullable |
|-------|--------|----------|
| id | uuid | No |
| first_name | text | No |
| last_name | text | No |
| birth_date | date | No |
| country | text | No |
| profession | text | No |
| income_type | text | No |
| income_frequency | text | No |
| monthly_income | numeric | No |
| additional_income | numeric | No |
| housing_expense | numeric | No |
| food_expense | numeric | No |
| transport_expense | numeric | No |
| restaurant_expense | numeric | No |
| shopping_expense | numeric | No |
| hobby_expense | numeric | No |
| subscription_expense | numeric | No |
| impulse_purchase | text | No |
| budget_management | text | No |
| bank_check_frequency | text | No |
| installment_usage | text | No |
| end_of_month_difficulty | text | No |
| current_savings | numeric | No |
| monthly_savings | numeric | No |
| onboarding_completed | boolean | No |
| created_at | timestamptz | No |
| updated_at | timestamptz | No |

---

Indexes

id

monthly_income

country

profession

---

RLS

Owner only.

---

# Table : financial_profiles

Description

Profil financier calculé automatiquement.

---

Columns

| Name | Type |
|-------|------|
| id | uuid |
| profile_id | uuid |
| profile_type | text |
| budget_score | integer |
| saving_score | integer |
| discipline_score | integer |
| financial_health_score | integer |
| created_at | timestamptz |

---

Foreign Keys

profile_id

↓

profiles.id

---

# Table : goals

Description

Objectifs d'épargne.

---

Columns

| Name | Type |
|-------|------|
| id | uuid |
| profile_id | uuid |
| title | text |
| description | text |
| target_amount | numeric |
| current_amount | numeric |
| target_date | date |
| progress | numeric |
| status | text |
| created_at | timestamptz |
| updated_at | timestamptz |

---

Relations

profiles

↓

goals

1 → N

Statuts

- `PLANNED` : projet secondaire, sans plan actif
- `ACTIVE` : objectif principal
- `COMPLETED` : objectif atteint
- `ARCHIVED` : objectif conservé dans l'historique

Contrainte

- index unique partiel garantissant un seul objectif `ACTIVE` par profil

---

# Table : saving_plans

Description

Plan d'épargne généré.

---

Columns

| Name | Type |
|-------|------|
| id | uuid |
| profile_id | uuid |
| goal_id | uuid |
| recommended_monthly_saving | numeric |
| estimated_completion_date | date |
| difficulty | text |
| progress | numeric |
| status | text |
| created_at | timestamptz |
| updated_at | timestamptz |

Relations

goals

↓

saving_plans

1 → N

Contraintes

- `goal_id` obligatoire avec suppression en cascade
- index unique partiel garantissant un seul Saving Plan `ACTIVE` par profil

---

# Table : savings_contributions

Description

Versements manuels ajoutés par l'utilisateur à un objectif.

| Name | Type | Nullable |
|-------|------|----------|
| id | uuid | No |
| profile_id | uuid | No |
| goal_id | uuid | No |
| amount | numeric | No |
| created_at | timestamptz | No |

Contraintes

- `amount > 0`
- suppression en cascade avec le profil ou l'objectif

Indexes

- `(profile_id, created_at)`
- `(goal_id, created_at)`

---

# Table : recommendations

Description

Recommandations générées.

---

Columns

| Name | Type |
|-------|------|
| id | uuid |
| profile_id | uuid |
| title | text |
| description | text |
| category | text |
| priority | text |
| impact | text |
| difficulty | text |
| potential_saving | numeric |
| status | text |
| created_at | timestamptz |

---

# Table : notifications

Description

Notifications utilisateur.

---

Columns

| Name | Type |
|-------|------|
| id | uuid |
| profile_id | uuid |
| title | text |
| description | text |
| type | text |
| priority | text |
| status | text |
| read_at | timestamptz |
| created_at | timestamptz |

---

# Relationships

```
profiles

↓

financial_profiles

1 → 1

----------------

profiles

↓

saving_plans

1 → 1

----------------

profiles

↓

goals

1 → N

----------------

profiles

↓

recommendations

1 → N

----------------

profiles

↓

notifications

1 → N
```

---

# Constraints

Tous les UUID sont générés automatiquement.

Aucun montant négatif.

Toutes les Foreign Keys utilisent

ON DELETE CASCADE

Les dates utilisent UTC.

---

# Indexes

Créer des index sur :

profile_id

status

created_at

priority

---

# Row Level Security

Toutes les tables métier utilisent RLS.

Politique générale :

L'utilisateur authentifié ne peut accéder qu'à ses propres données.

Toutes les opérations :

SELECT

INSERT

UPDATE

DELETE

doivent vérifier :

```
auth.uid() = profile_id
```

ou l'identifiant du propriétaire correspondant.

---

# Migrations

Toutes les modifications doivent être réalisées via des migrations versionnées.

Aucune modification directe en production.

---

# Backup Strategy

Sauvegardes automatiques quotidiennes.

Restauration testée régulièrement.

---

# Performance Rules

Index obligatoires sur toutes les clés étrangères.

Limiter les requêtes N+1.

Préférer les jointures aux multiples requêtes.

---

# Acceptance Criteria

✓ Toutes les tables sont normalisées.

✓ Toutes les relations sont définies.

✓ Toutes les contraintes sont appliquées.

✓ Toutes les politiques RLS sont actives.

✓ Toutes les clés étrangères sont protégées.

✓ La structure est compatible avec l'ensemble des fonctionnalités de Vintra.

✓ Les performances sont adaptées à une montée en charge.
