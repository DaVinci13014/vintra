# Vintra

Vintra est un coach financier personnel qui aide les particuliers à comprendre leur situation, estimer une capacité d’épargne réaliste et progresser vers un objectif concret.

## Démarrage

```bash
pnpm install
pnpm dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000).

## Emails de confirmation

Vintra utilise Resend pour les emails de vérification d’adresse et de récupération de mot de passe.
Pour activer l’envoi en local, renseigner `RESEND_API_KEY` et `EMAIL_FROM` dans `.env` à partir de
`.env.example`. Sans ces variables, le développement local reste possible mais la vérification
d’email est désactivée.

## Qualité

```bash
pnpm lint
pnpm typecheck
pnpm build
```

La documentation produit et technique est indexée dans `docs/00-README.md`.
