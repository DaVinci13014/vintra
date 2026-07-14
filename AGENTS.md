# Vintra — Guide de contribution

## Source de vérité

La documentation de `docs/` est prioritaire. En cas de conflit, appliquer cet ordre :

1. Produit
2. UX
3. Fonctionnalités
4. Technique
5. Design
6. Engineering
7. Demande ponctuelle

## Décisions d’architecture

- Next.js App Router et TypeScript strict.
- Feature-Sliced Design : `app → widgets → features → entities → shared`.
- La couche FSD `pages` n’est pas matérialisée dans `src/pages`, car ce dossier activerait le Pages Router de Next.js. Les fichiers `src/app/**/page.tsx` restent de fins assembleurs de widgets.
- Better Auth est la seule référence d’authentification. Les anciennes mentions de Supabase Auth dans certains documents décrivent le besoin historique, pas l’implémentation retenue.
- Prisma est le seul accès ORM. Aucun accès direct à la base depuis React.
- Les APIs publiques des slices passent par `index.ts`.

## Règles obligatoires

- Pas de `any`, `@ts-ignore`, `console.log` ni logique métier dans l’UI.
- Imports absolus via `@/`.
- Zod côté client et serveur pour toute donnée externe.
- Composants fondés sur shadcn/ui, icônes Lucide, animations Framer Motion.
- Dark first, mobile first, design tokens uniquement.
- Une action principale par écran.
- Aucun secret dans le dépôt.

## Découpage de livraison

- Partie 1 : fondations, documentation, design system, landing et interfaces d’authentification.
- Partie 2 : Better Auth, Prisma/PostgreSQL, onboarding, calculs, analyse et profil financier.
- Partie 3 : dashboard, objectifs, recommandations, paramètres, notifications et préparation au déploiement.
