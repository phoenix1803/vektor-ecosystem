import { describe, expect, it } from "vitest";
import {
  getComplianceSnapshot,
  getDashboardSnapshot,
  listAuditLogs,
  listPatients,
} from "../hms-data";

describe("hms-data fallback repository", () => {
  it("returns patient rows with UHID and name", async () => {
    const rows = await listPatients();

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].uhid).toMatch(/^UHID-/);
    expect(rows[0].fullName.length).toBeGreaterThan(0);
  });

  it("returns dashboard KPI snapshot", async () => {
    const snapshot = await getDashboardSnapshot();

    expect(snapshot.kpis.patients).toBeGreaterThan(0);
    expect(snapshot.kpis.revenueToday).toBeGreaterThan(0);
  });

  it("returns compliance counters and audit rows", async () => {
    const [compliance, auditLogs] = await Promise.all([
      getComplianceSnapshot(),
      listAuditLogs(),
    ]);

    expect(compliance.auditCount).toBe(auditLogs.length);
    expect(compliance.documentsIndexed).toBeGreaterThanOrEqual(0);
  });
});
