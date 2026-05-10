import { describe, expect, it } from "vitest";
import { findDemoUser } from "../demo-users";

describe("demo users", () => {
  it("finds the admin demo user with the test credentials", () => {
    const user = findDemoUser("admin@vektorcore.health", "VektorCore@2026");
    expect(user?.role).toBe("HOSPITAL_ADMIN");
  });

  it("rejects invalid demo credentials", () => {
    const user = findDemoUser("admin@vektorcore.health", "wrong-password");
    expect(user).toBeUndefined();
  });
});
