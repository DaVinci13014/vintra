import { Resend } from "resend";

import { serverEnv } from "@/shared/config";

type AuthEmail = {
  to: string;
  subject: string;
  heading: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
};

export async function sendAuthEmail(email: AuthEmail) {
  if (!serverEnv.RESEND_API_KEY) {
    return;
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY);

  await resend.emails.send({
    from: serverEnv.EMAIL_FROM,
    to: email.to,
    subject: email.subject,
    text: `${email.heading}\n\n${email.message}\n\n${email.actionUrl}`,
    html: `<div style="font-family:Arial,sans-serif;background:#09090b;color:#fff;padding:32px"><h1>${email.heading}</h1><p style="color:#a1a1aa">${email.message}</p><a href="${email.actionUrl}" style="display:inline-block;margin-top:16px;padding:12px 20px;border-radius:12px;background:#4ade80;color:#09090b;text-decoration:none;font-weight:600">${email.actionLabel}</a></div>`,
  });
}
