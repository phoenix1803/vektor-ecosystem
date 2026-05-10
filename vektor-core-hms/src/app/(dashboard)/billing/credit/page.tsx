import { Building2 } from "lucide-react";
import { listCreditAccounts } from "@/lib/hms-data";

export default async function Page() {
  const accounts = await listCreditAccounts();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <Building2 className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Billing & Finance</p>
        </div>
        <h1 className="mt-3 text-3xl">Credit Facilities</h1>
        <p className="mt-2 text-sm text-foreground/70">Manage corporate credit accounts and deferred payment contracts.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Limit</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Due Days</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{account.accountName}</td>
                <td className="px-4 py-3">Rs {account.limit.toLocaleString()}</td>
                <td className="px-4 py-3">Rs {account.balance.toLocaleString()}</td>
                <td className="px-4 py-3">{account.dueDays}</td>
                <td className="px-4 py-3">{account.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}