import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  send: vi.fn(async (payload: { html: string }) => {
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
  },
}));

import { sendAuthEmail } from "./send-auth-email";

const validEmail = {
  to: "client@example.org",
  subject: "Vérifiez votre compte",
  heading: "Vérification",
  message: "Confirmez votre adresse.",
  actionLabel: "Vérifier",
  actionUrl: "https://vintra.test/verification",
};

describe("emails d’authentification", () => {
  beforeEach(() => {
    mocks.send.mockClear();
  });

  it("refuse une charge externe invalide", async () => {
    await expect(sendAuthEmail({ ...validEmail, to: "adresse-invalide" })).rejects.toThrow(
      "invalide",
    );
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("ignore les domaines réservés aux tests hors production", async () => {
    await sendAuthEmail({ ...validEmail, to: "navigateur@vintra.test" });
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("échappe le contenu HTML avant l’envoi", async () => {
    await sendAuthEmail({
      ...validEmail,
      heading: "<script>test</script>",
      actionUrl: "https://vintra.test/verification?source=email&mode=secure",
    });
    expect(mocks.send).toHaveBeenCalledOnce();
    const payload = mocks.send.mock.calls[0]?.[0];
    expect(payload?.html).toContain("&lt;script&gt;test&lt;/script&gt;");
    expect(payload?.html).not.toContain("<script>");
    expect(payload?.html).toContain("source=email&amp;mode=secure");
  });
});
