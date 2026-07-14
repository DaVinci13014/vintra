const EMAIL_ALREADY_USED_CODES = new Set([
  "USER_ALREADY_EXISTS",
  "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
]);

export function isEmailAlreadyUsed(code?: string) {
  return Boolean(code && EMAIL_ALREADY_USED_CODES.has(code));
}

export function getSignInErrorMessage(code?: string) {
  if (code === "EMAIL_NOT_VERIFIED") {
    return "Vérifiez votre adresse email avant de vous connecter.";
  }

  if (code === "TOO_MANY_REQUESTS") {
    return "Trop de tentatives. Réessayez dans quelques instants.";
  }

  return "Adresse email ou mot de passe incorrect.";
}
