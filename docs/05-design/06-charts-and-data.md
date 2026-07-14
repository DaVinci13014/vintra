# Vintra — Charts & Data Visualization

Version : 1.0

Status : Approved

---

# Purpose

Ce document définit les règles de conception des graphiques, indicateurs financiers et visualisations de données de Vintra.

Toutes les données financières doivent être affichées de manière simple, compréhensible et cohérente.

Les graphiques ne doivent jamais compliquer une information.

Ils doivent toujours la simplifier.

---

# Philosophy

Les données sont au cœur de Vintra.

Chaque graphique doit permettre de répondre rapidement à une question.

Exemple :

"Combien ai-je économisé ?"

"Est-ce que je progresse ?"

"Où part mon argent ?"

L'utilisateur ne doit jamais devoir interpréter un graphique complexe.

---

# Chart Library

Library

Recharts

---

Theme

Dark First

---

Responsive

Obligatoire

---

Animation

Framer Motion + Recharts

---

# Chart Principles

Chaque graphique doit respecter les règles suivantes.

✓ Une seule information principale

✓ Palette limitée

✓ Aucun élément décoratif

✓ Lisibilité immédiate

✓ Mobile First

---

# Color Rules

Toutes les couleurs proviennent exclusivement des Design Tokens.

Primary

Vintra Green

Progression

---

Blue

Information

---

Orange

Attention

---

Red

Perte

---

Gray

Informations secondaires

---

Interdits

Gradients

Couleurs arc-en-ciel

Couleurs aléatoires

---

# Supported Charts

## Line Chart

Utilisation

Évolution de l'épargne

Évolution des revenus

Historique

---

## Area Chart

Utilisation

Progression dans le temps

Prévisions

---

## Bar Chart

Utilisation

Comparaison

Dépenses

Catégories

---

## Donut Chart

Utilisation

Répartition du budget

Répartition des dépenses

Maximum

6 catégories

---

## Progress Ring

Utilisation

Objectif atteint

Progression

---

## Progress Bar

Utilisation

Onboarding

Objectifs

Téléchargements

---

# Forbidden Charts

Interdits

Pie Chart classique

Radar Chart

3D Charts

Gauge

Bubble Chart

Treemap

Heatmap

Les graphiques doivent rester simples.

---

# Grid

Invisible.

Si nécessaire

Très discrète.

---

# Axis

Toujours minimalistes.

Couleur

Muted

---

Éviter les graduations inutiles.

---

# Tooltip

Toujours présent.

Structure

Titre

↓

Valeur

↓

Variation éventuelle

---

Background

Card Token

---

Radius

12px

---

Animation

Fade

---

# Legend

Uniquement si nécessaire.

Maximum

5 éléments.

---

# Empty State

Si aucune donnée

Illustration

↓

Titre

↓

Description

↓

CTA

---

Jamais un graphique vide.

---

# Loading State

Utiliser un Skeleton.

Le Skeleton reprend la taille exacte du graphique final.

---

# Error State

Titre

Impossible de charger les données.

↓

Bouton

Réessayer

---

# Number Formatting

Toujours utiliser le format local.

Exemple

1 250 €

Jamais

1250€

---

# Currency

Toujours affichée.

Exemple

2 450 €

Jamais

2450

---

# Percentage

Toujours

2 décimales maximum.

Exemple

18,5 %

---

# Large Numbers

Utiliser des abréviations.

1 200

↓

1,2 K

---

1 200 000

↓

1,2 M

---

# Financial Cards

Toutes les statistiques importantes utilisent une Financial Card.

Structure

Titre

↓

Valeur principale

↓

Variation

↓

Description

---

# KPI Rules

Maximum

4 KPI sur une même ligne.

---

Desktop

4 colonnes

---

Tablet

2 colonnes

---

Mobile

1 colonne

---

# Positive Values

Toujours

Vert

+

Icône Trending Up

---

# Negative Values

Toujours

Rouge

+

Icône Trending Down

---

# Neutral Values

Gris

---

# Goal Progress

Afficher

Montant actuel

↓

Montant cible

↓

Pourcentage

↓

Temps restant

---

Toujours avec une Progress Bar.

---

# Recommendation Metrics

Chaque recommandation affiche

Impact

↓

Économie potentielle

↓

Difficulté

---

# Chart Animations

Animation au premier affichage uniquement.

Durée

800 ms

---

Les mises à jour utilisent une transition douce.

---

# Accessibility

Chaque graphique doit proposer une alternative textuelle.

Les couleurs ne doivent jamais être le seul moyen de transmettre une information.

Toujours accompagner les variations avec :

- une valeur ;
- une icône ;
- un libellé.

---

# Dashboard Rules

Le Dashboard ne doit jamais afficher plus de :

- 2 graphiques principaux ;
- 4 KPI ;
- 3 recommandations.

L'information la plus importante doit toujours apparaître en premier.

---

# Data Density

Afficher uniquement les données utiles.

Si une donnée n'apporte aucune décision à l'utilisateur, elle ne doit pas être affichée.

---

# Export

Les graphiques doivent pouvoir être exportés ultérieurement en :

- PNG
- PDF

Cette fonctionnalité n'est pas prévue dans la première version mais l'architecture doit la permettre.

---

# Responsive Behavior

Mobile

Graphiques simplifiés.

Moins de labels.

Plus d'espace.

---

Desktop

Informations complètes.

---

# Performance

Ne jamais afficher plus de 500 points de données sur un même graphique.

Si nécessaire

Agrégation automatique.

---

# Anti-Patterns

Interdits

- Plus de 6 couleurs sur un graphique
- Effets 3D
- Animations permanentes
- Valeurs illisibles
- Légendes surchargées
- Plusieurs graphiques racontant la même information
- Axe vertical inutilement détaillé

---

# Premium Checklist

Avant de valider un graphique :

✓ Compréhensible en moins de 3 secondes

✓ Palette cohérente

✓ Responsive

✓ Accessible

✓ Animation discrète

✓ Tooltip clair

✓ Valeurs formatées

✓ Aucun élément décoratif

✓ Compatible avec le Design System

---

# Acceptance Criteria

✓ Tous les graphiques utilisent Recharts.

✓ Les couleurs proviennent des Design Tokens.

✓ Les données sont lisibles sur mobile et desktop.

✓ Les graphiques sont accessibles.

✓ Les animations restent discrètes.

✓ Les visualisations aident réellement l'utilisateur à prendre des décisions financières.
