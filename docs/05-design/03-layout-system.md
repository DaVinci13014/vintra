# Vintra — Layout System

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit les règles de mise en page de Vintra.

Toutes les pages, composants et futures fonctionnalités doivent respecter cette structure.

L'objectif est de garantir :

- Une interface cohérente
- Une excellente lisibilité
- Une navigation naturelle
- Une expérience premium
- Une parfaite adaptation Mobile / Tablet / Desktop

Le Layout System est obligatoire.

---

# Layout Philosophy

Le layout est invisible.

L'utilisateur ne doit jamais remarquer la structure.

Il doit simplement ressentir que tout est à sa place.

Chaque élément possède un espace.

Chaque espace possède une raison d'exister.

---

# Grid System

Vintra utilise une grille de

4 px

Toutes les dimensions sont des multiples de 4.

Exemples

4

8

12

16

20

24

32

40

48

64

80

96

128

Aucune valeur arbitraire.

---

# Mobile First

Toutes les pages sont conçues en priorité pour :

390 px

(iPhone récent)

Une fois validées :

↓

Tablet

↓

Desktop

---

# Safe Areas

Les appareils avec encoche doivent respecter les Safe Areas.

Toujours utiliser :

env(safe-area-inset-top)

env(safe-area-inset-bottom)

env(safe-area-inset-left)

env(safe-area-inset-right)

---

# Page Width

## Authentication

Max Width

480 px

---

## Onboarding

640 px

---

## Dashboard

1440 px

---

## Settings

960 px

---

## Content

640 px

---

# Horizontal Padding

Mobile

16 px

---

Tablet

24 px

---

Desktop

32 px

---

Large Desktop

40 px

---

# Vertical Rhythm

Entre deux sections

32 px

---

Entre deux cartes

16 px

---

Entre deux champs

20 px

---

Entre Label et Input

8 px

---

Entre Titre et Description

8 px

---

Entre Description et Action

24 px

---

# Header

Height

64 px

---

Toujours composé de

Titre

↓

Sous-titre

↓

Action éventuelle

---

Le Header reste fixe uniquement sur le Dashboard.

---

# Bottom Navigation

Visible uniquement sur Mobile.

Hauteur

72 px

---

Nombre maximal

5 onglets

---

Toujours centrée.

---

# Sidebar

Desktop uniquement.

Largeur

280 px

---

Toujours fixe.

---

Scrollable indépendamment du contenu.

---

# Dashboard Layout

Ordre obligatoire

Header

↓

Financial Summary

↓

Current Goal

↓

Recommendations

↓

Statistics

↓

Quick Actions

↓

Bottom Navigation

Aucun changement d'ordre autorisé.

---

# Cards

Toutes les données importantes sont présentées dans des cartes.

Structure

Header

↓

Content

↓

Footer (optionnel)

---

Padding

24 px

---

Gap interne

16 px

---

Radius

16 px

---

# Forms

Structure

Titre

↓

Description

↓

Champ

↓

Erreur

↓

Action

---

Largeur

100 %

---

Maximum

640 px

---

Bouton principal toujours placé sous le formulaire.

---

# Inputs

Tous les Inputs possèdent

Label

↓

Input

↓

Helper Text

↓

Erreur

---

Jamais de placeholder seul.

Le label est obligatoire.

---

# Dashboard Cards

Disposition

Mobile

1 colonne

---

Tablet

2 colonnes

---

Desktop

4 colonnes

---

Toutes les cartes possèdent la même hauteur dans une même ligne.

---

# Goal Card

Toujours affichée sur toute la largeur.

Elle est l'élément principal du Dashboard.

---

# Recommendation Cards

Maximum

3 cartes

Disposition

Verticale

---

Les recommandations supplémentaires sont accessibles via une page dédiée.

---

# Charts

Toujours intégrés dans une carte.

Jamais directement sur le fond de la page.

---

Padding

24 px

---

Hauteur minimale

240 px

---

# Dialog

Largeur

480 px

---

Padding

24 px

---

Radius

20 px

---

Backdrop Blur

Medium

---

# Drawer

Utilisé uniquement sur Mobile.

Hauteur maximale

90 %

Radius supérieur

24 px

---

# Empty States

Toujours composés de

Illustration

↓

Titre

↓

Description

↓

Bouton

---

Centrés verticalement lorsque possible.

---

# Skeleton Loading

Ne jamais afficher une page vide.

Chaque composant possède son Skeleton dédié.

Le Skeleton conserve exactement la même taille que le contenu final.

---

# Scrolling

Une seule zone scrollable par écran.

Éviter les scrolls imbriqués.

---

# Floating Action Button

Interdit.

Toutes les actions importantes doivent être visibles naturellement.

---

# Density Rules

Chaque écran possède

Une seule action principale.

Maximum

3 actions secondaires.

---

Ne jamais dépasser

2 niveaux de hiérarchie visuelle.

---

# Alignment

Tous les éléments utilisent :

Alignement à gauche.

Les valeurs numériques sont alignées à droite uniquement dans les tableaux.

---

# Financial Values

Toujours affichées avec :

Valeur

↓

Devise

↓

Variation éventuelle

Exemple

2 450 €

+4 %

---

# Empty Space

Si un écran paraît chargé :

Supprimer des éléments.

Ne jamais réduire les espaces.

---

# Responsive Rules

## Mobile

Navigation basse

1 colonne

Grandes zones tactiles

---

## Tablet

2 colonnes

Navigation adaptée

---

## Desktop

Sidebar

Grille

Contenu centré

---

# Breakpoint Behavior

< 640

Mobile

---

640 → 1023

Tablet

---

≥ 1024

Desktop

---

# Touch Targets

Toutes les zones interactives

Minimum

44 × 44 px

---

# Scroll Position

Le Dashboard mémorise la position du scroll.

Le retour sur une page conserve la position précédente.

---

# Layout Anti-Patterns

Interdits

- Deux scrolls verticaux
- Plus de 5 actions visibles
- Plus de 4 cartes par ligne
- Des cartes de tailles différentes sur une même ligne
- Des boutons collés entre eux
- Des textes centrés dans les formulaires
- Des marges différentes entre des composants identiques

---

# Premium Checklist

Avant de valider une page :

✓ Tous les espacements utilisent la grille de 4 px

✓ Les cartes sont parfaitement alignées

✓ Les titres suivent la hiérarchie

✓ Les actions principales sont immédiatement visibles

✓ Les espaces sont réguliers

✓ Le responsive est cohérent

✓ Une seule zone scrollable

✓ Les Skeletons correspondent au contenu final

✓ Les éléments respirent

✓ L'écran semble vide avant de sembler chargé

---

# Acceptance Criteria

✓ Toutes les pages utilisent le même système de layout.

✓ Tous les espacements suivent la grille.

✓ Responsive Mobile First.

✓ Les cartes sont homogènes.

✓ Les formulaires sont cohérents.

✓ Les zones tactiles respectent les recommandations Apple et Google.

✓ Le layout est suffisamment flexible pour accueillir les futures fonctionnalités sans être modifié.
