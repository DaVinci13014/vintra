import { Resend } from "resend";
import { z } from "zod";

import { serverEnv } from "@/shared/config/server";

const authEmailSchema = z
  .object({
    to: z.email(),
    subject: z.string().trim().min(1).max(160),
    heading: z.string().trim().min(1).max(160),
    message: z.string().trim().min(1).max(1_000),
    actionLabel: z.string().trim().min(1).max(80),
    actionUrl: z.url(),
  })
  .strict();
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export async function sendAuthEmail(input: unknown) {
  const parsed = authEmailSchema.safeParse(input);
  if (!parsed.success) throw new Error("Le contenu de l’email d’authentification est invalide.");
  const email = parsed.data;

  if (!serverEnv.RESEND_API_KEY) {
    return;
  }

  if (process.env.NODE_ENV !== "production" && isReservedTestEmail(email.to)) {
    return;
  }

  if (!serverEnv.EMAIL_FROM) {
    throw new Error("EMAIL_FROM est requis lorsque RESEND_API_KEY est configurée.");
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: serverEnv.EMAIL_FROM,
    to: email.to,
    subject: email.subject,
    text: `${email.heading}\n\n${email.message}\n\n${email.actionUrl}`,
    html: `<div style="font-family:Arial,sans-serif;background:#0a0a0b;color:#fafafa;padding:32px"><h1>${escapeHtml(email.heading)}</h1><p style="color:#d4d4d8">${escapeHtml(email.message)}</p><a href="${escapeHtml(email.actionUrl)}" style="display:inline-block;margin-top:16px;padding:12px 20px;border-radius:12px;background:#fafafa;color:#18181b;text-decoration:none;font-weight:600">${escapeHtml(email.actionLabel)}</a></div>`,
  });

  if (error) {
    throw new Error(`Resend n’a pas pu envoyer l’email : ${error.message}`);
  }
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
