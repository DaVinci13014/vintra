export const ACCOUNT_DELETION_REASON_VALUES = [
  "TOO_COMPLEX",
  "MISSING_FEATURES",
  "TECHNICAL_ISSUE",
  "RECOMMENDATIONS_NOT_RELEVANT",
  "PRIVACY_CONCERNS",
  "NO_LONGER_NEEDED",
  "OTHER",
] as const;

export type AccountDeletionReason = (typeof ACCOUNT_DELETION_REASON_VALUES)[number];

export const ACCOUNT_DELETION_REASONS = [
  { value: "TOO_COMPLEX", label: "Vintra est trop compliqué à utiliser" },
  { value: "MISSING_FEATURES", label: "Il me manque une fonctionnalité importante" },
  { value: "TECHNICAL_ISSUE", label: "J’ai rencontré un problème technique" },
  {
    value: "RECOMMENDATIONS_NOT_RELEVANT",
    label: "Les recommandations ne correspondent pas à ma situation",
  },
  { value: "PRIVACY_CONCERNS", label: "J’ai des inquiétudes concernant mes données" },
  { value: "NO_LONGER_NEEDED", label: "Je n’ai plus besoin de Vintra pour le moment" },
  { value: "OTHER", label: "Une autre raison" },
] as const satisfies ReadonlyArray<{ value: AccountDeletionReason; label: string }>;

export const ACCOUNT_DELETION_REASON_LABELS = Object.fromEntries(
  ACCOUNT_DELETION_REASONS.map(({ value, label }) => [value, label]),
) as Record<AccountDeletionReason, string>;

type RetentionSuggestion = {
  title: string;
  description: string;
  actionLabel: string;
  href: string | null;
};

export const ACCOUNT_RETENTION_SUGGESTIONS = {
  TOO_COMPLEX: {
    title: "On peut vous aider à y voir plus clair.",
    description:
      "Expliquez-nous ce qui vous bloque : l’équipe pourra vous guider vers les fonctions vraiment utiles pour vous.",
    actionLabel: "Demander de l’aide",
    href: "/settings/support",
  },
  MISSING_FEATURES: {
    title: "Votre besoin peut guider Vintra.",
    description:
      "Partagez la fonctionnalité qu’il vous manque. Votre retour nous aide à prioriser les prochaines améliorations.",
    actionLabel: "Proposer une amélioration",
    href: "/settings/support",
  },
  TECHNICAL_ISSUE: {
    title: "Ce problème mérite d’être résolu.",
    description:
      "Signalez le dysfonctionnement à l’équipe afin que nous puissions vous aider avant votre départ.",
    actionLabel: "Signaler le problème",
    href: "/settings/support",
  },
  RECOMMENDATIONS_NOT_RELEVANT: {
    title: "Vos conseils peuvent être recalibrés.",
    description:
      "Une mise à jour de vos revenus, charges ou objectifs permet à Vintra de générer des recommandations plus pertinentes.",
    actionLabel: "Actualiser mon profil financier",
    href: "/settings/profile/finances",
  },
  PRIVACY_CONCERNS: {
    title: "Vous gardez le contrôle de vos données.",
    description:
      "Consultez les options de confidentialité, exportez vos informations et vérifiez précisément les données conservées.",
    actionLabel: "Gérer mes données",
    href: "/settings/privacy",
  },
  NO_LONGER_NEEDED: {
    title: "Votre espace peut rester disponible.",
    description:
      "Vous pouvez garder votre compte sans l’utiliser et retrouver votre progression lorsque vous en aurez de nouveau besoin.",
    actionLabel: "Garder mon compte pour plus tard",
    href: null,
  },
  OTHER: {
    title: "Parlons-en avant votre départ.",
    description:
      "L’équipe Vintra peut peut-être résoudre votre besoin ou prendre en compte votre suggestion.",
    actionLabel: "Contacter l’équipe",
    href: "/settings/support",
  },
} as const satisfies Record<AccountDeletionReason, RetentionSuggestion>;
