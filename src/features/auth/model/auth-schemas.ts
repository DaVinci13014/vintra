import { z } from "zod";

const NAME_PATTERN = /^[\p{L}\p{M}' -]+$/u;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Veuillez saisir une adresse email valide."),
  password: z.string().min(1, "Veuillez saisir votre mot de passe."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Veuillez saisir une adresse email valide."),
});

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "Le prénom doit contenir au moins 2 caractères.")
      .max(50, "Le prénom ne peut pas dépasser 50 caractères.")
      .regex(NAME_PATTERN, "Veuillez saisir un prénom valide."),
    lastName: z
      .string()
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères.")
      .max(50, "Le nom ne peut pas dépasser 50 caractères.")
      .regex(NAME_PATTERN, "Veuillez saisir un nom valide."),
    email: z.string().trim().toLowerCase().email("Veuillez saisir une adresse email valide."),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .regex(
        PASSWORD_PATTERN,
        "Ajoutez une majuscule, une minuscule et un chiffre.",
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Les mots de passe ne correspondent pas.",
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
