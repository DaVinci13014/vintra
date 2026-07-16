import { timingSafeEqual } from "node:crypto";

import { z } from "zod";

const authorizationHeaderSchema = z.string().min(1).max(512);

export function isValidCronAuthorization(value: string | null, secret: string) {
  const parsedValue = authorizationHeaderSchema.safeParse(value);
  if (!parsedValue.success) return false;

  const received = Buffer.from(parsedValue.data);
  const expected = Buffer.from(`Bearer ${secret}`);
  return received.length === expected.length && timingSafeEqual(received, expected);
}
