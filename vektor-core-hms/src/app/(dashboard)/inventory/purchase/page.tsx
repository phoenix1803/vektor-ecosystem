import { FileSpreadsheet } from "lucide-react";
import { listPurchaseOrders } from "@/lib/hms-data";

export default async function Page() {
  const orders = await listPurchaseOrders();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Procurement</p>
        </div>
        <h1 className="mt-3 text-3xl">Purchase Orders</h1>
        <p className="mt-2 text-sm text-foreground/70">Track approvals, vendor commitments, and expected inward timelines.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">PO Number</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Expected</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{order.poNo}</td>
                <td className="px-4 py-3">{order.vendorName}</td>
                <td className="px-4 py-3">{order.itemCount}</td>
                <td className="px-4 py-3">INR {order.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">{new Date(order.expectedDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}