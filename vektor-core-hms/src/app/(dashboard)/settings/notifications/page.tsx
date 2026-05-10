import { BellRing } from "lucide-react";
import { listNotificationRules } from "@/lib/hms-data";

export default async function Page() {
  const rules = await listNotificationRules();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <BellRing className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Settings</p>
        </div>
        <h1 className="mt-3 text-3xl">Notification Rules</h1>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Trigger</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Recipients</th>
              <th className="px-4 py-3">SLA (min)</th>
              <th className="px-4 py-3">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{rule.trigger}</td>
                <td className="px-4 py-3">{rule.channel}</td>
                <td className="px-4 py-3">{rule.recipientGroup}</td>
                <td className="px-4 py-3">{rule.slaMinutes}</td>
                <td className="px-4 py-3">{rule.enabled ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}