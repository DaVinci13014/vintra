import { Check } from "lucide-react";

type PasswordRulesProps = { password: string };

const rules = [
  { label: "8 caractères", test: (value: string) => value.length >= 8 },
  { label: "Une majuscule", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Une minuscule", test: (value: string) => /[a-z]/.test(value) },
  { label: "Un chiffre", test: (value: string) => /\d/.test(value) },
];

export function PasswordRules({ password }: PasswordRulesProps) {
  return (
    <ul className="grid grid-cols-2 gap-2 text-xs" aria-label="Règles du mot de passe">
      {rules.map((rule) => {
        const isValid = rule.test(password);
        return (
          <li
            key={rule.label}
            className={
              isValid ? "flex items-center gap-2 text-brand" : "flex items-center gap-2 text-muted"
            }
          >
            <Check aria-hidden="true" size={14} />
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
