import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  deleteUser: vi.fn(async () => ({ success: true })),
  sendFeedback: vi.fn(async (input: unknown) => {
    void input;
    return true;
  }),
  logError: vi.fn(),
}));

vi.mock("@/features/auth/server", () => ({
  auth: { api: { deleteUser: mocks.deleteUser } },
}));
vi.mock("@/shared/api/email", () => ({
  sendAccountDeletionFeedback: mocks.sendFeedback,
}));
vi.mock("@/shared/lib/logger", () => ({ logger: { error: mocks.logError } }));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Headers()) }));
vi.mock("./settings-context", () => ({
  getSettingsContext: vi.fn(async () => ({
    success: true,
    data: { userId: "user-1", email: "client@domain.fr" },
  })),
  failure: (code: string, message: string) => ({ success: false, error: { code, message } }),
}));

import { deleteAccount } from "./account-actions";

const validInput = {
  reason: "TECHNICAL_ISSUE",
  feedback: "La synchronisation ne fonctionnait pas.",
  confirmation: "SUPPRIMER",
  password: "Secret1!",
};

describe("suppression du compte", () => {
  beforeEach(() => {
    mocks.deleteUser.mockClear();
    mocks.sendFeedback.mockClear();
    mocks.logError.mockClear();
  });

  it("envoie le retour uniquement après une suppression validée", async () => {
    const response = await deleteAccount(validInput);

    expect(response).toEqual({ success: true, data: { destination: "/" } });
    expect(mocks.deleteUser).toHaveBeenCalledOnce();
    expect(mocks.sendFeedback).toHaveBeenCalledWith({
      userEmail: "client@domain.fr",
      reason: "J’ai rencontré un problème technique",
      feedback: "La synchronisation ne fonctionnait pas.",
    });
    expect(mocks.deleteUser.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.sendFeedback.mock.invocationCallOrder[0] ?? 0,
    );
    expect(mocks.sendFeedback.mock.calls[0]?.[0]).not.toHaveProperty("password");
  });

  it("refuse une raison inconnue avant toute suppression", async () => {
    const response = await deleteAccount({ ...validInput, reason: "UNKNOWN" });

    expect(response.success).toBe(false);
    expect(mocks.deleteUser).not.toHaveBeenCalled();
    expect(mocks.sendFeedback).not.toHaveBeenCalled();
  });

  it("ne bloque pas la suppression si l’email de retour échoue", async () => {
    mocks.sendFeedback.mockRejectedValueOnce(new Error("Resend indisponible"));

    const response = await deleteAccount(validInput);

    expect(response).toEqual({ success: true, data: { destination: "/" } });
    expect(mocks.logError).toHaveBeenCalledOnce();
  });
});
