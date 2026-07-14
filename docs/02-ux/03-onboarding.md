# Vintra — Onboarding

Version : 1.0

Status : Approved

---

# Purpose

L'onboarding est le premier parcours réalisé après l'inscription.

Son objectif est de construire un profil financier suffisamment précis pour permettre à Vintra de générer une première analyse personnalisée.

À la fin de l'onboarding, l'utilisateur doit disposer :

- d'un profil financier,
- d'une estimation de sa capacité d'épargne,
- d'un premier objectif,
- d'un tableau de bord personnalisé.

---

# Scope

Ce document couvre :

- Le parcours complet de l'onboarding
- Les écrans
- Les composants
- Les validations
- Les règles métier
- Les états
- Les transitions
- Les données collectées

---

# Out of Scope

Ce document ne couvre pas :

- Authentification
- Dashboard
- Analyse détaillée
- API
- Base de données

Ces éléments possèdent leurs propres documents.

---

# Global User Flow

```
Authentication

↓

Onboarding

↓

Analyse automatique

↓

Création du profil financier

↓

Création du premier objectif

↓

Dashboard
```

---

# UX Rules

## Une seule question principale

Chaque écran possède une seule question principale.

---

## Progression visible

Une barre de progression est toujours affichée.

---

## Sauvegarde automatique

Chaque réponse est sauvegardée immédiatement.

---

## Retour possible

L'utilisateur peut revenir sur les écrans précédents.

---

## Aucune perte de données

Si l'application est fermée :

Le questionnaire reprend exactement où il s'était arrêté.

---

## Validation immédiate

Chaque réponse est validée avant le passage à l'écran suivant.

---

# Progression

Le questionnaire est divisé en 6 sections.

| Section | Objectif |
|----------|----------------------------|
| Informations personnelles | Identifier l'utilisateur |
| Situation professionnelle | Comprendre son activité |
| Situation financière | Comprendre les revenus |
| Dépenses | Comprendre les charges |
| Habitudes | Comprendre son comportement |
| Objectif | Définir son premier objectif |

---

# Flow

```
Informations personnelles

↓

Situation professionnelle

↓

Situation financière

↓

Charges

↓

Habitudes

↓

Objectif

↓

Analyse

↓

Dashboard
```

---

# Screen Naming

Tous les écrans utilisent le format :

```
ONBOARDING_001

ONBOARDING_002

ONBOARDING_003

...
```

---

# Screen Template

Tous les écrans suivent exactement la même structure.

Metadata

↓

Objective

↓

UI

↓

Validation

↓

Business Rules

↓

Navigation

↓

Auto Save

↓

Edge Cases

↓

Acceptance Criteria

---

# ONBOARDING_001

## Metadata

Screen ID

ONBOARDING_001

Nom

Date de naissance

Section

Informations personnelles

---

## Objective

Vérifier que l'utilisateur est majeur.

Calculer automatiquement son âge.

Personnaliser certaines recommandations.

---

## UI

### Title

Avant de commencer...

### Question

Quelle est votre date de naissance ?

### Description

Nous utilisons votre âge pour personnaliser certaines recommandations.

### Component

Date Picker

JJ

MM

AAAA

---

## Validation

Obligatoire

Date valide

Date passée uniquement

Âge minimum

18 ans

---

## Business Rules

Calcul automatique de l'âge.

Si âge < 18

↓

Bloquer l'inscription.

---

## Navigation

Previous

Aucun

Next

ONBOARDING_002

---

## Auto Save

Après validation.

---

## Edge Cases

Date invalide

↓

Afficher erreur.

Utilisateur mineur

↓

Bloquer le parcours.

---

## Acceptance Criteria

✓ Date valide

✓ Âge calculé

✓ Majeur obligatoire

✓ Continuer activé uniquement si valide

---

# ONBOARDING_002

## Metadata

Screen ID

ONBOARDING_002

Nom

Pays de résidence

---

## Objective

Déterminer le pays de résidence principal.

Cette information permettra d'adapter :

- la devise ;
- certains conseils ;
- la fiscalité future.

---

## UI

Question

Dans quel pays résidez-vous actuellement ?

Component

Searchable Select

Placeholder

Rechercher un pays...

---

## Validation

Obligatoire

Un seul pays

---

## Navigation

Previous

ONBOARDING_001

Next

ONBOARDING_003

---

## Acceptance Criteria

✓ Pays obligatoire

✓ Recherche fonctionnelle

✓ Sauvegarde automatique

---

# ONBOARDING_003

## Metadata

Situation professionnelle

---

## Objective

Comprendre la situation professionnelle actuelle.

---

## Choices

- Salarié
- Indépendant
- Entrepreneur
- Étudiant
- Sans emploi
- Retraité

---

## Validation

Obligatoire

Une seule réponse

---

## Navigation

↓

ONBOARDING_004

---

# ONBOARDING_004

## Metadata

Type de revenus

---

## Objective

Identifier la nature principale des revenus.

---

## Choices

- Salaire
- Revenus d'activité
- Aides
- Pension
- Plusieurs revenus

---

## Navigation

↓

ONBOARDING_005

---

# ONBOARDING_005

## Metadata

Fréquence des revenus

---

## Objective

Connaître la fréquence des rentrées d'argent.

---

## Choices

- Hebdomadaire
- Toutes les deux semaines
- Mensuelle
- Variable

---

## Navigation

↓

ONBOARDING_006

---

# ONBOARDING_006

## Metadata

Revenu mensuel net

---

## Objective

Collecter le revenu mensuel moyen après impôts.

---

## Component

Currency Input

€

---

## Validation

Minimum

0 €

Maximum

1 000 000 €

---

## Navigation

↓

ONBOARDING_007

---

# ONBOARDING_007

## Metadata

Revenus complémentaires

---

## Objective

Identifier les revenus secondaires.

---

## Choices

Oui

Non

Si Oui

↓

Champ montant

---

## Navigation

↓

ONBOARDING_008

---

# ONBOARDING_008

## Metadata

Coût du logement

---

## Objective

Estimer la principale charge mensuelle.

---

## Component

Currency Input

---

## Navigation

↓

ONBOARDING_009

---

# ONBOARDING_009

## Metadata

Alimentation

---

## Objective

Estimer les dépenses alimentaires mensuelles.

---

## Component

Currency Input

---

## Navigation

↓

ONBOARDING_010

---

# ONBOARDING_010

## Metadata

Transport

---

## Objective

Estimer les dépenses liées aux déplacements.

---

## Component

Currency Input

---

## Navigation

↓

ONBOARDING_011

# ONBOARDING_011

## Metadata

Screen ID

ONBOARDING_011

Section

Charges mensuelles

---

## Objective

Estimer les dépenses mensuelles liées aux restaurants, fast-foods et livraisons.

---

## UI

Title

Vos dépenses

Question

En moyenne, combien dépensez-vous chaque mois en restaurants ou en repas à l'extérieur ?

Description

Une estimation suffit.

Component

Currency Input (€)

Placeholder

150 €

---

## Validation

- Required : Yes
- Minimum : 0 €
- Maximum : 10 000 €

---

## Business Rules

Cette donnée participe au calcul :

- des dépenses variables
- du potentiel d'économie

---

## Navigation

Previous

ONBOARDING_010

Next

ONBOARDING_012

---

## Auto Save

Automatique après modification.

---

## Acceptance Criteria

✓ Valeur obligatoire

✓ Sauvegarde automatique

# ONBOARDING_012

## Metadata

Screen ID

ONBOARDING_012

Section

Charges mensuelles

---

## Objective

Estimer les dépenses liées au shopping.

---

## UI

Question

Combien dépensez-vous environ chaque mois en shopping ?

Description

Vêtements, décoration, achats personnels...

Component

Currency Input (€)

---

## Validation

Required

Minimum : 0 €

Maximum : 20 000 €

---

## Navigation

Previous

ONBOARDING_011

Next

ONBOARDING_013

---

## Business Rules

Utilisé dans le calcul des dépenses variables.

---

## Acceptance Criteria

✓ Montant valide

✓ Sauvegarde automatique

# ONBOARDING_013

## Metadata

Screen ID

ONBOARDING_013

Section

Charges mensuelles

---

## Objective

Estimer les dépenses de loisirs.

---

## UI

Question

Combien consacrez-vous à vos loisirs chaque mois ?

Description

Cinéma, sorties, sport, jeux...

Component

Currency Input (€)

---

## Validation

Required

Minimum : 0 €

---

## Navigation

Previous

ONBOARDING_012

Next

ONBOARDING_014

---

## Acceptance Criteria

✓ Valeur enregistrée

# ONBOARDING_014

## Metadata

Screen ID

ONBOARDING_014

Section

Charges mensuelles

---

## Objective

Identifier les dépenses récurrentes.

---

## UI

Question

Quel est le montant total de vos abonnements mensuels ?

Description

Netflix, Spotify, téléphone, salle de sport...

Component

Currency Input (€)

---

## Validation

Required

Minimum : 0 €

---

## Business Rules

Cette donnée pourra servir plus tard à détecter des optimisations.

---

## Navigation

Previous

ONBOARDING_013

Next

ONBOARDING_015

# ONBOARDING_015

## Metadata

Screen ID

ONBOARDING_015

Section

Habitudes financières

---

## Objective

Mesurer les achats impulsifs.

---

## UI

Question

À quelle fréquence effectuez-vous des achats impulsifs ?

Component

Single Choice

---

## Choices

- Jamais
- Rarement
- Parfois
- Souvent
- Très souvent

---

## Validation

Required

---

## Business Rules

Cette réponse influence le profil financier.

---

## Navigation

Previous

ONBOARDING_014

Next

ONBOARDING_016

# ONBOARDING_016

## Metadata

Screen ID

ONBOARDING_016

Section

Habitudes financières

---

## Objective

Comprendre le suivi des finances.

---

## UI

Question

À quelle fréquence consultez-vous votre compte bancaire ?

---

## Choices

- Tous les jours
- Plusieurs fois par semaine
- Une fois par semaine
- Quelques fois par mois
- Rarement

---

## Validation

Required

---

## Navigation

Previous

ONBOARDING_015

Next

ONBOARDING_017

# ONBOARDING_017

## Metadata

Screen ID

ONBOARDING_017

Section

Habitudes financières

---

## Objective

Savoir si l'utilisateur suit un budget.

---

## UI

Question

Avez-vous un budget mensuel ?

---

## Choices

- Oui
- Non

---

Si Oui

Question complémentaire :

Le respectez-vous ?

- Toujours
- Souvent
- Parfois
- Rarement

---

## Navigation

Previous

ONBOARDING_016

Next

ONBOARDING_018

# ONBOARDING_018

## Metadata

Screen ID

ONBOARDING_018

Section

Habitudes financières

---

## Objective

Identifier l'utilisation du paiement fractionné.

---

## UI

Question

Utilisez-vous le paiement en plusieurs fois ?

---

## Choices

- Jamais
- Rarement
- Parfois
- Souvent

---

## Validation

Required

---

## Navigation

Previous

ONBOARDING_017

Next

ONBOARDING_019

# ONBOARDING_019

## Metadata

Screen ID

ONBOARDING_019

Section

Habitudes financières

---

## Objective

Évaluer la difficulté à terminer le mois.

---

## UI

Question

Vous arrive-t-il de manquer d'argent avant la fin du mois ?

---

## Choices

- Jamais
- Rarement
- Parfois
- Souvent
- Tous les mois

---

## Business Rules

Réponse utilisée pour déterminer le niveau de stress financier.

---

## Navigation

Previous

ONBOARDING_018

Next

ONBOARDING_020

# ONBOARDING_020

## Metadata

Screen ID

ONBOARDING_020

Section

Épargne actuelle

---

## Objective

Déterminer si l'utilisateur possède déjà une épargne.

---

## UI

Question

Disposez-vous actuellement d'une épargne ?

---

## Choices

- Oui
- Non

---

Si Oui

Continuer vers :

ONBOARDING_021

Si Non

Ignorer les questions sur le montant actuel.

Continuer directement vers :

ONBOARDING_022

---

## Validation

Required

---

## Business Rules

Déclenche un parcours conditionnel.

---

## Navigation

Previous

ONBOARDING_019

Next

ONBOARDING_021 ou ONBOARDING_022

---

## Acceptance Criteria

✓ Réponse obligatoire

✓ Navigation conditionnelle correcte

✓ Sauvegarde automatique

# ONBOARDING_021

## Metadata

Screen ID

ONBOARDING_021

Section

Épargne actuelle

---

## Objective

Connaître le montant total actuellement épargné.

---

## UI

Title

Votre épargne

Question

Quel est le montant total de votre épargne actuelle ?

Description

Une estimation suffit.

Component

Currency Input (€)

Placeholder

5 000 €

---

## Validation

Required

Minimum : 0 €

Maximum : 100 000 000 €

---

## Business Rules

Cette donnée permettra :

- d'estimer le niveau de sécurité financière ;
- d'adapter certaines recommandations.

---

## Navigation

Previous

ONBOARDING_020

Next

ONBOARDING_022

---

## Auto Save

Automatique.

---

## Acceptance Criteria

✓ Valeur valide

✓ Sauvegarde automatique

# ONBOARDING_022

## Metadata

Screen ID

ONBOARDING_022

Section

Épargne actuelle

---

## Objective

Connaître le montant actuellement épargné chaque mois.

---

## UI

Question

Combien mettez-vous de côté chaque mois ?

Component

Currency Input (€)

Placeholder

150 €

---

## Validation

Required

Minimum : 0 €

---

## Business Rules

Utilisé pour comparer :

Épargne actuelle

VS

Capacité d'épargne estimée.

---

## Navigation

Previous

ONBOARDING_021

Next

ONBOARDING_023

# ONBOARDING_023

## Metadata

Screen ID

ONBOARDING_023

Section

Objectif

---

## Objective

Déterminer la motivation principale de l'utilisateur.

---

## UI

Question

Pourquoi souhaitez-vous économiser ?

Component

Single Choice Cards

---

## Choices

- Épargne de sécurité
- Acheter une voiture
- Acheter un logement
- Voyager
- Financer un projet
- Préparer l'avenir
- Autre

---

## Validation

Required

---

## Business Rules

Cette réponse influence :

- le ton des recommandations ;
- le Dashboard ;
- le plan d'épargne.

---

## Navigation

Previous

ONBOARDING_022

Next

ONBOARDING_024

# ONBOARDING_024

## Metadata

Screen ID

ONBOARDING_024

Section

Objectif

---

## Objective

Déterminer le montant cible.

---

## UI

Question

Combien souhaitez-vous économiser ?

Component

Currency Input (€)

Placeholder

10 000 €

---

## Validation

Required

Minimum : 100 €

---

## Navigation

Previous

ONBOARDING_023

Next

ONBOARDING_025

# ONBOARDING_025

## Metadata

Screen ID

ONBOARDING_025

Section

Objectif

---

## Objective

Déterminer l'échéance souhaitée.

---

## UI

Question

Quand souhaitez-vous atteindre cet objectif ?

Component

Month / Year Picker

---

## Validation

Required

Date future uniquement

---

## Business Rules

Calcul automatique :

Nombre de mois disponibles.

---

## Navigation

Previous

ONBOARDING_024

Next

ONBOARDING_026

# ONBOARDING_026

## Metadata

Screen ID

ONBOARDING_026

Section

Objectif

---

## Objective

Mesurer le niveau de motivation.

---

## UI

Question

À quel point cet objectif est-il important pour vous ?

Component

Slider

---

## Values

1

Peu important

↓

10

Priorité absolue

---

## Validation

Required

---

## Navigation

Previous

ONBOARDING_025

Next

ONBOARDING_027

# ONBOARDING_027

## Metadata

Screen ID

ONBOARDING_027

Section

Résumé

---

## Objective

Permettre à l'utilisateur de vérifier toutes ses réponses.

---

## UI

Liste complète :

Informations personnelles

Situation professionnelle

Revenus

Charges

Habitudes

Objectif

Chaque section possède un bouton Modifier.

---

## Actions

Modifier

Continuer

---

## Validation

Aucune.

---

## Navigation

Previous

ONBOARDING_026

Next

ONBOARDING_028

# ONBOARDING_028

## Metadata

Screen ID

ONBOARDING_028

Section

Analyse

---

## Objective

Informer l'utilisateur que Vintra analyse son profil.

---

## UI

Animation

Loader

Titre

Analyse de votre profil...

Description

Nous construisons votre premier plan personnalisé.

---

## Estimated Duration

2 à 5 secondes.

---

## Navigation

Automatique.

↓

ONBOARDING_029

# ONBOARDING_029

## Metadata

Screen ID

ONBOARDING_029

Section

Résultat

---

## Objective

Présenter la première analyse.

---

## UI

Cards

Profil financier

Capacité d'épargne

Points forts

Points d'amélioration

---

## Actions

Découvrir mon plan

---

## Navigation

↓

ONBOARDING_030

# ONBOARDING_030

## Metadata

Screen ID

ONBOARDING_030

Section

Fin

---

## Objective

Terminer l'onboarding.

Créer définitivement le profil utilisateur.

---

## Actions réalisées automatiquement

- Génération du profil financier
- Création du premier objectif
- Initialisation du Dashboard
- Marquage de l'onboarding comme terminé

---

## UI

Titre

Votre espace Vintra est prêt.

Description

Vous pouvez maintenant commencer à suivre votre progression.

Bouton

Accéder à mon Dashboard

---

## Navigation

Destination

Dashboard

---

## Business Rules

L'utilisateur ne repasse jamais l'onboarding.

Il pourra modifier ses informations depuis les Paramètres.

---

## Acceptance Criteria

✓ Profil créé

✓ Analyse enregistrée

✓ Objectif créé

✓ Dashboard accessible

✓ Onboarding marqué comme terminé
