# Vintra — Design Tokens

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit tous les Design Tokens de Vintra.

Les Design Tokens sont les variables fondamentales utilisées dans toute l'application.

Ils garantissent :

- Cohérence visuelle
- Maintenabilité
- Évolutivité
- Compatibilité avec shadcn/ui
- Support Dark / Light Theme

Aucun composant ne doit utiliser une couleur, une taille ou un espacement en dehors des tokens définis ici.

---

# Design Stack

Framework

Next.js 15

UI Library

shadcn/ui

Styling

TailwindCSS v4

Icons

Lucide React

Animation

Framer Motion

Charts

Recharts

---

# Theme Strategy

Vintra est conçu en

Dark First

Le thème clair est une déclinaison.

Tous les nouveaux composants doivent être pensés d'abord pour le thème sombre.

---

# CSS Variables

Toutes les couleurs doivent être définies dans

globals.css

Aucune couleur HEX ne doit être utilisée directement dans les composants.

---

# Primary Palette

## Background

Background

#09090B

---

Surface

#111113

---

Card

#18181B

---

Elevated Card

#202024

---

Overlay

rgba(9,9,11,0.80)

---

Border

#2A2A2E

---

Divider

#313135

---

# Brand Color

Vintra Green

#4ADE80

Utilisation

- CTA principal
- Progression
- Validation
- Succès
- Gains

Maximum 10 % de l'écran.

Le vert ne doit jamais devenir la couleur dominante.

---

# Secondary Color

Blue

#3B82F6

Utilisation

- Liens
- Informations
- États actifs

---

# Semantic Colors

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Info

#38BDF8

---

# Text Colors

Primary

#FFFFFF

---

Secondary

#A1A1AA

---

Muted

#71717A

---

Disabled

#52525B

---

Inverse

#09090B

---

# Typography

Primary Font

Geist Sans

Fallback

Inter

system-ui

sans-serif

---

Monospace

Geist Mono

Utilisation

- Montants
- Pourcentages
- Identifiants
- Données financières

---

# Font Weight

Light

300

Regular

400

Medium

500

SemiBold

600

Bold

700

---

# Font Scale

Display

48

---

H1

36

---

H2

30

---

H3

24

---

Title

20

---

Body

16

---

Small

14

---

Caption

12

---

# Line Height

Display

1.1

---

Heading

1.2

---

Body

1.5

---

Caption

1.4

---

# Spacing Scale

4

8

12

16

20

24

32

40

48

56

64

80

96

128

Jamais d'autres valeurs.

---

# Border Radius

Small

8px

---

Default

12px

---

Large

16px

---

Extra Large

24px

---

Round

9999px

Réservé uniquement :

Avatar

Badge

Notification Dot

---

# Shadows

Shadow XS

Très léger

---

Shadow SM

Cards

---

Shadow MD

Dialog

Popover

---

Shadow LG

Jamais utilisé.

---

# Blur

Small

8px

---

Medium

12px

---

Large

20px

Utilisation uniquement :

- Dialog
- Command
- Drawer
- Dropdown

---

# Icon System

Library

Lucide React

---

Small

16px

---

Default

20px

---

Large

24px

---

Hero

32px

---

Stroke

Toujours

2

---

# Button Sizes

Small

36px

---

Default

44px

---

Large

52px

---

Padding

Horizontal

16

24

32

---

# Input Sizes

Height

48px

---

Border Radius

12px

---

Padding

16px

---

Icon

20px

---

# Card System

Padding

24px

---

Radius

16px

---

Border

1px

---

Background

Card Token

---

Maximum Width

100%

---

# Navigation

Top Bar

64px

---

Bottom Navigation

72px

---

Sidebar

280px

Desktop uniquement.

---

# Breakpoints

Mobile

0

---

Small

640

---

Medium

768

---

Large

1024

---

XL

1280

---

2XL

1536

---

# Container Width

Content

640px

---

Dashboard

1440px

---

Settings

960px

---

Authentication

480px

---

Onboarding

640px

---

# Z-Index

Dropdown

50

Popover

60

Dialog

70

Toast

80

Command

90

---

# Motion Tokens

Fast

150ms

---

Normal

200ms

---

Slow

300ms

---

Maximum

400ms

---

Easing

ease-out

---

Spring

Utiliser Framer Motion

stiffness: 300

damping: 30

---

# Skeleton

Background

Surface

Animation

Shimmer

Durée

1.5s

---

# Charts

Grid

Invisible

---

Stroke

2px

---

Corners

Arrondis

---

Animation

800ms

---

Tooltip

Dark Theme

---

# Focus Ring

Couleur

Brand Green

Épaisseur

2px

Offset

2px

Obligatoire sur tous les éléments interactifs.

---

# Scrollbar

Invisible sur mobile.

Fine sur desktop.

Couleur

Border Token.

---

# Transition Rules

Hover

150ms

---

Press

100ms

---

Dialog

250ms

---

Drawer

300ms

---

Page

250ms

---

# Accessibility Tokens

Contraste

WCAG AA minimum.

---

Taille minimum des zones cliquables

44px

---

Focus visible

Toujours.

---

Navigation clavier

Obligatoire.

---

# Forbidden

Interdit :

- HEX dans les composants
- Couleurs inline
- Border Radius arbitraire
- Margin arbitraire
- Taille de police arbitraire
- Animation CSS inline
- Box Shadow personnalisée
- Fonts différentes de Geist
- Icônes hors Lucide

---

# Acceptance Criteria

✓ Tous les composants utilisent les Design Tokens.

✓ Aucune valeur arbitraire.

✓ 100 % compatible shadcn/ui.

✓ Mobile First.

✓ Dark First.

✓ Cohérence visuelle garantie.

✓ Les tokens sont suffisants pour construire toute l'interface Vintra.
