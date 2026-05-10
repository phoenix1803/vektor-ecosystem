import { describe, expect, it } from "vitest";
import { patientCreateSchema, emergencyEventCreateSchema } from "../schemas";

describe("schemas", () => {
  it("accepts a valid patient payload", () => {
    const result = patientCreateSchema.safeParse({
      hospitalId: "hsp_apollo_north",
      fullName: "Arjun Mehta",
      dateOfBirth: "1990-01-01T00:00:00.000Z",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid emergency payload", () => {
    const result = emergencyEventCreateSchema.safeParse({ location: { lat: "bad", lng: 77.5 } });
    expect(result.success).toBe(false);
  });
});
