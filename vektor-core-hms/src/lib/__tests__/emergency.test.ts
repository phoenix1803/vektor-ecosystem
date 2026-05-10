import { describe, expect, it } from "vitest";
import { assignNearestHospital, distanceKm } from "../emergency";

describe("emergency routing", () => {
  it("computes a positive distance", () => {
    expect(distanceKm(12.9716, 77.5946, 12.9539, 77.4902)).toBeGreaterThan(0);
  });

  it("assigns the nearest hospital and eta", () => {
    const assigned = assignNearestHospital(12.9716, 77.5946);
    expect(assigned.id).toBeTruthy();
    expect(assigned.etaMinutes).toBeGreaterThanOrEqual(5);
  });
});
