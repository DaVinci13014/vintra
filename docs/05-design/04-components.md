# Vintra — Components

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit tous les composants de l'interface Vintra.

Chaque composant possède :

- une responsabilité unique ;
- des variantes ;
- des tailles ;
- des états ;
- des règles d'utilisation ;
- des règles d'accessibilité ;
- des animations.

Aucun composant ne doit être créé sans être documenté ici.

---

# Component Principles

Tous les composants doivent être :

✓ Réutilisables

✓ Accessibles

✓ Responsive

✓ Typés

✓ Testables

✓ Compatibles avec le Design System

✓ Basés sur shadcn/ui

---

# Technology

Base UI

shadcn/ui

Icons

Lucide React

Animation

Framer Motion

Validation

React Hook Form + Zod

---

# COMPONENT_001

Button

---

Purpose

Déclencher une action.

---

Variants

Primary

Secondary

Outline

Ghost

Destructive

Link

---

Sizes

SM

36px

---

MD

44px

(Default)

---

LG

52px

---

States

Default

Hover

Pressed

Focused

Disabled

Loading

Success

---

Rules

Toujours un seul bouton Primary visible par écran.

Ne jamais placer deux boutons Primary côte à côte.

---

Loading

Spinner à gauche du texte.

Le texte reste visible.

---

Animation

Hover

150ms

Scale

1.02

---

Accessibility

Minimum

44x44px

Focus Ring obligatoire.

---

# COMPONENT_002

Input

---

Height

48px

---

Radius

12px

---

Structure

Label

↓

Input

↓

Helper Text

↓

Error Message

---

Types

Text

Email

Password

Number

Currency

Date

Search

---

States

Default

Focused

Disabled

Error

Success

Loading

---

Rules

Toujours afficher un Label.

Le placeholder ne remplace jamais le Label.

---

# COMPONENT_003

Card

---

Purpose

Afficher une information.

---

Structure

Header

↓

Body

↓

Footer (optionnel)

---

Padding

24px

---

Radius

16px

---

Variants

Default

Elevated

Interactive

Danger

Success

---

Rules

Une Card = une information principale.

---

# COMPONENT_004

Badge

---

Purpose

Afficher un état.

---

Variants

Success

Warning

Danger

Neutral

Info

---

Radius

9999px

---

Height

24px

---

# COMPONENT_005

Progress

---

Purpose

Afficher une progression.

---

Animation

Toujours animée.

---

Height

8px

---

Radius

9999px

---

Utilisation

Objectifs

Épargne

Onboarding

Téléchargements

---

# COMPONENT_006

Avatar

---

Shape

Circle

---

Sizes

32

40

48

64

---

Fallback

Initiales utilisateur.

---

# COMPONENT_007

Dialog

---

Maximum Width

480px

---

Padding

24px

---

Animation

Fade

+

Scale

---

Backdrop

Blur Medium

---

# COMPONENT_008

Drawer

---

Mobile uniquement.

---

Height

90%

---

Radius

24px

---

Animation

Slide Bottom

---

# COMPONENT_009

Toast

---

Maximum

1 toast affiché.

---

Duration

3 secondes

---

Position

Top Center (mobile)

Top Right (desktop)

---

Variants

Success

Warning

Error

Info

---

# COMPONENT_010

Alert

---

Utilisation

Messages importants.

---

Jamais utilisé comme notification.

---

# COMPONENT_011

Skeleton

---

Toujours identique au contenu final.

---

Animation

Shimmer

---

Jamais Spinner seul.

---

# COMPONENT_012

Tabs

---

Utilisation

Navigation secondaire.

---

Maximum

5 onglets.

---

Animation

Underline

Fade

---

# COMPONENT_013

Select

---

Recherche intégrée obligatoire si

> 10 options.

---

Utiliser Command de shadcn.

---

# COMPONENT_014

Checkbox

---

Toujours accompagné d'un Label.

---

Jamais utilisé seul.

---

# COMPONENT_015

Switch

---

Utilisation

Préférences.

Paramètres.

Notifications.

---

Jamais pour une validation.

---

# COMPONENT_016

Tooltip

---

Affichage

300ms

---

Maximum

2 lignes.

---

# COMPONENT_017

Dropdown Menu

---

Animation

Fade

Scale

---

Jamais plus de 8 actions.

---

# COMPONENT_018

Command

---

Utilisation

Recherche globale.

Navigation rapide.

---

Ouverture

⌘ K

Ctrl K

---

# COMPONENT_019

Table

---

Utilisation

Historique

Transactions futures

Exports

---

Desktop uniquement.

Sur mobile

↓

Cards.

---

# COMPONENT_020

Chart

---

Library

Recharts

---

Couleurs

Design Tokens uniquement.

---

Grid

Invisible.

---

Animation

800ms

---

Tooltip

Dark Theme.

---

# COMPONENT_021

Bottom Navigation

---

Maximum

5 éléments.

---

Toujours visible sur Mobile.

---

Jamais sur Desktop.

---

# COMPONENT_022

Sidebar

---

Desktop uniquement.

---

Largeur

280px

---

Rétractable.

---

# COMPONENT_023

Empty State

---

Toujours composé de

Illustration

↓

Titre

↓

Description

↓

CTA

---

Jamais un écran vide.

---

# COMPONENT_024

Loading State

---

Toujours utiliser

Skeleton.

---

Interdit

Spinner plein écran.

---

# COMPONENT_025

Financial Card

---

Composant exclusif Vintra.

Affiche

Titre

↓

Montant

↓

Variation

↓

Action

---

Utilisation

Dashboard.

---

# COMPONENT_026

Goal Card

---

Affiche

Objectif

↓

Progression

↓

Temps restant

↓

Montant restant

↓

CTA

---

Toujours largeur complète.

---

# COMPONENT_027

Recommendation Card

---

Affiche

Titre

↓

Impact

↓

Difficulté

↓

Économie potentielle

↓

Action

---

Maximum

3 visibles sur Dashboard.

---

# COMPONENT_028

Statistic Card

---

Affiche

Valeur

↓

Variation

↓

Icône

↓

Description

---

# Component Rules

Tous les composants :

✓ utilisent les Design Tokens.

✓ utilisent shadcn/ui.

✓ utilisent Lucide.

✓ utilisent Framer Motion.

✓ sont Responsive.

✓ sont accessibles.

✓ possèdent un état Loading.

✓ possèdent un état Disabled.

✓ possèdent un état Focus.

✓ possèdent un état Error si applicable.

---

# Forbidden Components

Interdits

Floating Action Button

Carousel

Marquee

Infinite Slider

Accordion complexe

Mega Menu

Hover Card inutile

---

# Acceptance Criteria

✓ Tous les composants sont documentés.

✓ Tous les composants utilisent les mêmes règles.

✓ Tous les composants sont compatibles Mobile.

✓ Tous les composants utilisent les Design Tokens.

✓ Toute nouvelle fonctionnalité de Vintra peut être développée uniquement à partir de cette bibliothèque.
