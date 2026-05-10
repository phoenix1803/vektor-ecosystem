import { describe, expect, it } from "vitest";
import { canAccessRoute, canPerform, getDefaultLandingPath } from "../rbac";

describe("rbac", () => {
  it("restricts nurse billing access", () => {
    expect(canAccessRoute("NURSE", "/billing")).toBe(false);
  });

  it("allows doctor emergency access", () => {
    expect(canAccessRoute("DOCTOR", "/emergency")).toBe(true);
  });

  it("allows hospital admin to edit patients", () => {
    expect(canPerform("HOSPITAL_ADMIN", "patients", "edit")).toBe(true);
  });

  it("returns role-specific landing paths", () => {
    expect(getDefaultLandingPath("PHARMACIST")).toBe("/pharmacy/dispense");
  });
});
