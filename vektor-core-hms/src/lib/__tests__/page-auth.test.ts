import { describe, expect, it } from "vitest";
import { evaluateApiAccess } from "../api-auth";

describe("security boundaries for sensitive views", () => {
  it("requires settings-administer for sensitive audit resources", () => {
    const denied = evaluateApiAccess("DOCTOR", true, "settings", "administer", {
      requireMfa: true,
    });
    expect(denied.allowed).toBe(false);
    expect(denied.status).toBe(403);
  });

  it("allows hospital admin with MFA for sensitive audit resources", () => {
    const allowed = evaluateApiAccess("HOSPITAL_ADMIN", true, "settings", "administer", {
      requireMfa: true,
    });
    expect(allowed.allowed).toBe(true);
  });
});
