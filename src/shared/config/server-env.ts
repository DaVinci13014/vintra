import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().min(1).optional(),
  WEB_PUSH_PUBLIC_KEY: z.string().min(1).optional(),
  WEB_PUSH_PRIVATE_KEY: z.string().min(1).optional(),
  WEB_PUSH_SUBJECT: z
    .string()
    .refine((value) => value.startsWith("mailto:") || value.startsWith("https://"))
    .optional(),
});

const parsedEnv = serverEnvSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
  EMAIL_FROM: process.env.EMAIL_FROM || undefined,
  WEB_PUSH_PUBLIC_KEY: process.env.WEB_PUSH_PUBLIC_KEY || undefined,
  WEB_PUSH_PRIVATE_KEY: process.env.WEB_PUSH_PRIVATE_KEY || undefined,
  WEB_PUSH_SUBJECT: process.env.WEB_PUSH_SUBJECT || undefined,
});

if (!parsedEnv.success) {
  throw new Error("La configuration serveur de Vintra est incomplète.");
}

export const serverEnv = parsedEnv.data;
