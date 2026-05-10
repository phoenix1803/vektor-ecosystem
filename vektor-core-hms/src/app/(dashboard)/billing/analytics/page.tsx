import { ChartPie, CircleDollarSign, FileText, TrendingUp } from "lucide-react";
import { getBillingAnalyticsSnapshot } from "@/lib/hms-data";

export default async function Page() {
  const analytics = await getBillingAnalyticsSnapshot();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <ChartPie className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Billing & Finance</p>
        </div>
        <h1 className="mt-3 text-3xl">Revenue Cycle Analytics</h1>
        <p className="mt-2 text-sm text-foreground/70">Monitor collections, denials, outstanding balances, and closure rates.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="panel p-5 text-sm"><CircleDollarSign className="h-4 w-4 text-brand" aria-hidden="true" /><p className="mt-2 text-foreground/70">Outstanding</p><p className="mt-2 text-2xl font-semibold">Rs {analytics.outstanding.toLocaleString()}</p></article>
        <article className="panel p-5 text-sm"><FileText className="h-4 w-4 text-brand" aria-hidden="true" /><p className="mt-2 text-foreground/70">Denial rate</p><p className="mt-2 text-2xl font-semibold">{Math.round(analytics.denialRate * 100)}%</p></article>
        <article className="panel p-5 text-sm"><TrendingUp className="h-4 w-4 text-brand" aria-hidden="true" /><p className="mt-2 text-foreground/70">Collection rate</p><p className="mt-2 text-2xl font-semibold">{Math.round(analytics.collectionRate * 100)}%</p></article>
        <article className="panel p-5 text-sm"><ChartPie className="h-4 w-4 text-brand" aria-hidden="true" /><p className="mt-2 text-foreground/70">Refund pipeline</p><p className="mt-2 text-2xl font-semibold">Rs {analytics.refundPipeline.toLocaleString()}</p></article>
      </section>
    </div>
  );
}