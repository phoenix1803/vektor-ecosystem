import { describe, expect, it } from "vitest";
import { evaluateApiAccess } from "../api-auth";

describe("api auth guard", () => {
  it("rejects unauthenticated API access", () => {
    const decision = evaluateApiAccess(undefined, false, "analytics", "view");
    expect(decision.allowed).toBe(false);
    expect(decision.status).toBe(401);
  });

  it("blocks disallowed roles for staff-only endpoints", () => {
    const decision = evaluateApiAccess("PATIENT", true, "dashboard", "view", {
      disallowedRoles: ["PATIENT", "EMERGENCY_API"],
    });
    expect(decision.allowed).toBe(false);
    expect(decision.status).toBe(403);
  });

  it("requires MFA for sensitive audit-style endpoints", () => {
    const decision = evaluateApiAccess("HOSPITAL_ADMIN", false, "settings", "administer", {
      requireMfa: true,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain("MFA");
  });

  it("enforces RBAC permissions by resource and action", () => {
    const denied = evaluateApiAccess("RECEPTIONIST", true, "settings", "administer");
    expect(denied.allowed).toBe(false);

    const allowed = evaluateApiAccess("HOSPITAL_ADMIN", true, "settings", "administer");
    expect(allowed.allowed).toBe(true);
  });
});
