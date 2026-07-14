import { hash, type Options, verify } from "@node-rs/argon2";

const ARGON2_OPTIONS: Options = {
  memoryCost: 65_536,
  timeCost: 3,
  parallelism: 4,
  outputLen: 32,
  algorithm: 2,
};

export function hashPassword(password: string) {
  return hash(password, ARGON2_OPTIONS);
}

export function verifyPassword(data: { password: string; hash: string }) {
  return verify(data.hash, data.password, ARGON2_OPTIONS);
}
