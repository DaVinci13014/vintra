# Vintra

Vintra est un coach financier personnel qui aide les particuliers à comprendre leur situation, estimer une capacité d’épargne réaliste et progresser vers un objectif concret.

## Démarrage

```bash
pnpm install
pnpm dev
```

Ouvrir ensuite [http://localhost:13015](http://localhost:13015).

Si Vintra utilise déjà ce port, la commande confirme simplement que le site est accessible au
lieu de lancer un second serveur concurrent.

## Emails de confirmation

Vintra utilise Resend pour les emails de vérification d’adresse et de récupération de mot de passe.
Pour activer l’envoi en local, renseigner `RESEND_API_KEY` et `EMAIL_FROM` dans `.env` à partir de
`.env.example`. Sans ces variables, le développement local reste possible mais la vérification
d’email est désactivée.

## Qualité

```bash
pnpm quality
```

La mise en ligne automatisée, Supabase, Vercel, la surveillance et les sauvegardes sont détaillées dans [le guide de production](docs/06-engineering/07-production-runbook.md).

La documentation produit et technique est indexée dans `docs/00-README.md`.
