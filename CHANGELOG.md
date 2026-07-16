# Changelog

## Non publié — Préparation de la version publique

- Finalisation de l’onboarding, de l’analyse financière, du dashboard, des objectifs, des recommandations, des paramètres et des notifications.
- Ajout de la limitation anti-abus persistante pour l’authentification sans serveur.
- Ajout des contrôles de santé, de la tâche hebdomadaire et des en-têtes de sécurité.
- Intégration optionnelle et respectueuse de la vie privée de Sentry, PostHog et Pino.
- Ajout des contrôles GitHub, des migrations automatiques Vercel et des sauvegardes chiffrées avec test de restauration.
- Durcissement post-audit : PostCSS corrigé, actions GitHub verrouillées et aperçus Vercel fiabilisés.
- Isolation des fichiers générés de développement pour que les builds ne perturbent jamais localhost.
- Démarrage local rendu idempotent lorsque Vintra utilise déjà son port de développement.
- Actualisation systématique des données après une action et lors d’un retour dans l’historique.
- Confirmation ajoutée avant chaque modification personnelle, financière ou de sécurité sensible.
- Refonte monochrome blanc/gris et affichage de la photo de profil, avec initiales en remplacement.
- Harmonisation des erreurs, simplification des textes et de l’ajout de versement.
- Nettoyage FSD de l’onboarding, centralisation des retours de formulaire et retrait des dépendances directes redondantes.

## 0.1.0 — Partie 1

- Classement des 36 documents du cahier des charges.
- Initialisation du projet Next.js en architecture Feature-Sliced Design.
- Mise en place des tokens et composants fondamentaux.
- Création de la landing, de la connexion et de l’inscription.
- Ajout du flux de vérification email avec Better Auth et Resend, activé par configuration.
