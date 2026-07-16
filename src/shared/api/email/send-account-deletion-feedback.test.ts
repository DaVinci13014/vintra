import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  send: vi.fn(async (payload: { html: string; to: string }) => {
    void payload;
    return { error: null };
  }),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));
vi.mock("@/shared/config/server", () => ({
  serverEnv: {
    RESEND_API_KEY: "resend-test-key",
    EMAIL_FROM: "Vintra <notifications@vintra.test>",
    ACCOUNT_DELETION_FEEDBACK_TO: "irfanemlboa@gmail.com",
  },
}));

import { sendAccountDeletionFeedback } from "./send-account-deletion-feedback";

describe("retours après suppression de compte", () => {
  beforeEach(() => {
    mocks.send.mockClear();
  });

  it("envoie le motif à l’adresse configurée et échappe le commentaire", async () => {
    await sendAccountDeletionFeedback({
      userEmail: "client@domain.fr",
      reason: "Je n’ai plus besoin de Vintra",
      feedback: "Commentaire <script>dangereux</script>",
    });

    expect(mocks.send).toHaveBeenCalledOnce();
    const payload = mocks.send.mock.calls[0]?.[0];
    expect(payload?.to).toBe("irfanemlboa@gmail.com");
    expect(payload?.html).toContain("&lt;script&gt;dangereux&lt;/script&gt;");
    expect(payload?.html).not.toContain("<script>");
  });

  it("refuse un retour invalide", async () => {
    await expect(
      sendAccountDeletionFeedback({ userEmail: "invalide", reason: "", feedback: "" }),
    ).rejects.toThrow("invalide");
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("n’envoie pas les comptes de test hors production", async () => {
    await sendAccountDeletionFeedback({
      userEmail: "suppression@vintra.test",
      reason: "Test",
      feedback: "",
    });

    expect(mocks.send).not.toHaveBeenCalled();
  });
});
