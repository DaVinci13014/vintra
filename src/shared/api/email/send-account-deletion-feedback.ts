import { Resend } from "resend";
import { z } from "zod";

import { serverEnv } from "@/shared/config/server";

const accountDeletionFeedbackSchema = z
  .object({
    userEmail: z.email(),
    reason: z.string().trim().min(1).max(160),
    feedback: z.string().trim().max(2_000),
  })
  .strict();

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export async function sendAccountDeletionFeedback(input: unknown) {
  const parsed = accountDeletionFeedbackSchema.safeParse(input);
  if (!parsed.success) throw new Error("Le retour de suppression de compte est invalide.");

  if (!serverEnv.RESEND_API_KEY) return false;
  if (process.env.NODE_ENV !== "production" && isReservedTestEmail(parsed.data.userEmail)) {
    return false;
  }
  if (!serverEnv.EMAIL_FROM) {
    throw new Error("EMAIL_FROM est requis lorsque RESEND_API_KEY est configurée.");
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY);
  const feedback = parsed.data.feedback || "Aucun commentaire complémentaire.";
  const deletedAt = new Date().toISOString();
  const text = [
    "Un compte Vintra vient d’être supprimé.",
    `Compte : ${parsed.data.userEmail}`,
    `Motif : ${parsed.data.reason}`,
    `Commentaire : ${feedback}`,
    `Date : ${deletedAt}`,
  ].join("\n\n");

  const { error } = await resend.emails.send({
    from: serverEnv.EMAIL_FROM,
    to: serverEnv.ACCOUNT_DELETION_FEEDBACK_TO,
    subject: "[Vintra] Retour après suppression de compte",
    text,
    html: `<div style="font-family:Arial,sans-serif;background:#09090b;color:#fff;padding:32px"><h1>Retour après suppression de compte</h1><p><strong>Compte :</strong> ${escapeHtml(parsed.data.userEmail)}</p><p><strong>Motif :</strong> ${escapeHtml(parsed.data.reason)}</p><p><strong>Commentaire :</strong> ${escapeHtml(feedback)}</p><p style="color:#a1a1aa"><strong>Date :</strong> ${escapeHtml(deletedAt)}</p></div>`,
  });

  if (error) {
    throw new Error(`Resend n’a pas pu envoyer le retour de suppression : ${error.message}`);
  }

  return true;
}

function isReservedTestEmail(email: string) {
  const domain = email.split("@").at(-1)?.toLowerCase() ?? "";
  return (
    domain === "localhost" ||
    domain.endsWith(".test") ||
    domain.endsWith(".example") ||
    domain.endsWith(".invalid")
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => HTML_ENTITIES[character] ?? character);
}
