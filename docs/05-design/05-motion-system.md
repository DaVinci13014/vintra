# Vintra — Motion System

Version : 1.0

Status : Approved

---

# Purpose

Le Motion System définit toutes les règles d'animation de Vintra.

Les animations ne sont pas décoratives.

Elles servent à :

- guider l'utilisateur ;
- améliorer la compréhension ;
- confirmer une action ;
- rendre l'interface plus fluide.

Toutes les animations doivent respecter ce document.

---

# Design Philosophy

Une bonne animation est presque invisible.

L'utilisateur doit ressentir la fluidité sans remarquer l'animation.

Le mouvement accompagne l'action.

Il ne devient jamais le centre de l'attention.

---

# Technology

Animation Library

Framer Motion

---

CSS Animation

Uniquement pour les micro-effets simples.

---

JavaScript

Interdit pour les animations personnalisées.

---

# Animation Principles

Toutes les animations doivent être :

- rapides ;
- naturelles ;
- cohérentes ;
- discrètes ;
- prévisibles.

---

# Duration Tokens

Instant

100 ms

---

Fast

150 ms

---

Normal

200 ms

---

Slow

300 ms

---

Maximum

400 ms

Aucune animation ne doit dépasser 400 ms.

---

# Easing

Animation standard

ease-out

---

Spring

```ts
{
  type: "spring",
  stiffness: 300,
  damping: 30
}
```

---

# Page Transition

Utilisation

Changement de page.

---

Animation

Opacity

↓

Fade

↓

Slide

---

Durée

250 ms

---

# Card Animation

À l'apparition

Fade

+

TranslateY

8 px

↓

0 px

---

Durée

200 ms

---

# Button Animation

Hover

Scale

1 → 1.02

---

Press

Scale

1 → 0.98

---

Loading

Le bouton conserve sa largeur.

Le texte reste visible.

---

# Input Animation

Focus

Transition de couleur

150 ms

---

Error

Fade

↓

Message d'erreur

---

Success

Transition douce vers l'état valide.

---

# Dialog

Ouverture

Fade

+

Scale

0.96 → 1

---

Fermeture

Animation inverse.

---

Durée

250 ms

---

# Drawer

Ouverture

Slide Bottom

---

Fermeture

Slide Bottom

---

Durée

300 ms

---

# Toast

Entrée

Slide Top

+

Fade

---

Sortie

Fade

---

Durée

200 ms

---

# Dropdown

Animation

Fade

+

Scale

98 % → 100 %

---

Durée

150 ms

---

# Tooltip

Fade

↓

Opacity

0 → 100 %

---

Delay

300 ms

---

# Skeleton

Animation

Shimmer

---

Durée

1.5 s

---

Boucle

Infinite

---

# Charts

Animation au premier affichage uniquement.

Durée

800 ms

---

Les animations ne doivent jamais être rejouées à chaque mise à jour mineure.

---

# Progress Bar

Toujours animée.

Animation

Width

↓

Nouvelle valeur

---

Durée

300 ms

---

# Number Animation

Les montants importants peuvent être animés.

Animation

Count Up

---

Durée

500 ms maximum.

---

Utilisation

Dashboard

Objectifs

Statistiques

---

# Notification Badge

Animation

Scale

0 → 1

---

Durée

150 ms

---

# Hover Effects

Autorisés

- légère élévation ;
- légère variation de couleur ;
- scale très discret.

Interdits

- rotation ;
- rebond ;
- clignotement ;
- zoom important.

---

# Scroll Animation

Les éléments apparaissent progressivement.

Animation

Fade

+

TranslateY

16 px

↓

0 px

---

Uniquement lors de la première apparition.

---

# Micro Interactions

Les micro-interactions sont utilisées pour :

- validation d'un formulaire ;
- changement d'état ;
- ajout d'un objectif ;
- progression d'épargne ;
- ouverture d'un menu.

Toujours discrètes.

---

# Reduced Motion

Si l'utilisateur active

"Reduce Motion"

Toutes les animations doivent être simplifiées.

Les transitions deviennent instantanées ou très courtes.

---

# Performance Rules

Utiliser

transform

opacity

Éviter d'animer :

- width (sauf Progress)
- height
- top
- left

Privilégier :

translate

scale

opacity

---

# Accessibility

Les animations ne doivent jamais empêcher une interaction.

Aucun contenu essentiel ne doit dépendre exclusivement d'une animation.

---

# Forbidden Animations

Interdit

- Bounce
- Infinite Spin
- Flash
- Shake
- Pulsation permanente
- Rotation décorative
- Animation automatique sans interaction

---

# Motion Checklist

Avant de valider une animation :

✓ Apporte-t-elle une valeur ?

✓ Est-elle rapide ?

✓ Respecte-t-elle les durées ?

✓ Est-elle cohérente avec les autres animations ?

✓ Respecte-t-elle les préférences "Reduce Motion" ?

---

# Acceptance Criteria

✓ Toutes les animations utilisent Framer Motion.

✓ Les durées respectent les Motion Tokens.

✓ Les animations restent discrètes.

✓ Les performances sont préservées.

✓ Les interactions sont plus compréhensibles grâce au mouvement.

✓ L'expérience est cohérente sur toute l'application.
