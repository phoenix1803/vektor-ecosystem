import { jsonOk } from "@/lib/mock";
import { getAnalyticsSnapshot, getDashboardSnapshot } from "@/lib/hms-data";

export async function GET() {
  const [analytics, dashboard] = await Promise.all([getAnalyticsSnapshot(), getDashboardSnapshot()]);

  return jsonOk({
    data: {
      revenueToday: analytics.revenue,
      occupancyRate: analytics.occupancy,
      averageLengthOfStay: analytics.aLos,
      pendingClaims: dashboard.kpis.pendingClaims,
      opdToday: dashboard.kpis.appointments,
      satisfaction: analytics.satisfaction,
      readmissions: analytics.readmissions,
      outbreakSignals: analytics.outbreakSignals,
    },
    generatedAt: new Date().toISOString(),
  });
}
