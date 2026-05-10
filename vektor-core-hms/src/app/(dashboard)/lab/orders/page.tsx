import { FlaskConical, ScanSearch } from "lucide-react";
import { listLabOrders } from "@/lib/hms-data";

export default async function LabOrdersPage() {
  const orders = await listLabOrders();
  const ordersToday = orders.length;
  const statPending = orders.filter(
    (order) => (order.priority || "").toUpperCase() === "STAT" && (order.status || "").toUpperCase() !== "RESULTED"
  ).length;
  const abnormalResults = orders.filter((order) => Boolean(order.abnormal)).length;

  const avgTat = orders.length
    ? Math.round(
        orders.reduce((sum, order) => {
          const orderTime = new Date(order.orderedAt).getTime();
          if (Number.isNaN(orderTime)) return sum;
          const minutes = Math.max(0, Math.round((Date.now() - orderTime) / (1000 * 60)));
          return sum + minutes;
        }, 0) / orders.length
      )
    : 0;

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <FlaskConical className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Lab Workflow</p>
        </div>
        <h1 className="mt-3 text-3xl">Pending Lab Orders</h1>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="panel p-4">
          <p className="text-xs text-foreground/60">Orders Today</p>
          <p className="mt-1 text-xl font-semibold">{ordersToday}</p>
        </article>
        <article className="panel border-l-4 border-l-danger p-4">
          <p className="text-xs text-foreground/60">STAT Pending</p>
          <p className="mt-1 text-xl font-semibold text-danger">{statPending}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-foreground/60">Abnormal Results</p>
          <p className="mt-1 text-xl font-semibold text-warning">{abnormalResults}</p>
        </article>
        <article className="panel p-4">
          <p className="text-xs text-foreground/60">Avg TAT</p>
          <p className="mt-1 text-xl font-semibold">{avgTat} min</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Create Order</h2>
          <div className="mt-4 space-y-3">
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Encounter ID" />
            <input className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm" placeholder="Test code" />
            <select className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm">
              <option>Routine</option>
              <option>Urgent</option>
              <option>STAT</option>
            </select>
            <button className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white">Place Order</button>
          </div>
        </article>

        <article className="panel p-5 xl:col-span-2">
          <div className="flex items-center gap-2">
            <ScanSearch className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Order Lifecycle</h2>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-strong text-foreground/75">
                <tr>
                  <th className="px-4 py-3">Test</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={`${order.testCode}-${order.patientName}`}
                    className={`border-t border-line ${
                      (order.priority || "").toUpperCase() === "STAT"
                        ? "border-l-4 border-l-danger"
                        : (order.priority || "").toUpperCase() === "URGENT"
                          ? "border-l-4 border-l-warning"
                          : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">{order.testCode}</td>
                    <td className="px-4 py-3">{order.patientName}</td>
                    <td className="px-4 py-3">{order.priority}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span>{order.status}</span>
                        {order.abnormal ? (
                          <span className="chip border-warning/30 bg-warning/10 text-warning">Abnormal</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
