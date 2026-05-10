import { WalletCards } from "lucide-react";
import { listPayroll } from "@/lib/hms-data";

export default async function Page() {
  const payroll = await listPayroll();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <WalletCards className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Administration & HR</p>
        </div>
        <h1 className="mt-3 text-3xl">Payroll Integration</h1>
        <p className="mt-2 text-sm text-foreground/70">Calculate payroll-ready summaries using attendance and shifts.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Base</th>
              <th className="px-4 py-3">OT</th>
              <th className="px-4 py-3">Deductions</th>
              <th className="px-4 py-3">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {payroll.map((entry) => (
              <tr key={entry.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{entry.staffName}</td>
                <td className="px-4 py-3">Rs {entry.baseSalary.toLocaleString()}</td>
                <td className="px-4 py-3">Rs {entry.overtimePay.toLocaleString()}</td>
                <td className="px-4 py-3">Rs {entry.deductions.toLocaleString()}</td>
                <td className="px-4 py-3">Rs {entry.netPay.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}