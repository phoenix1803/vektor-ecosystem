import { PlugZap } from "lucide-react";
import { listIntegrationStatuses } from "@/lib/hms-data";

export default async function Page() {
  const integrations = await listIntegrationStatuses();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <PlugZap className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Settings</p>
        </div>
        <h1 className="mt-3 text-3xl">Integrations</h1>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Integration</th>
              <th className="px-4 py-3">Endpoint</th>
              <th className="px-4 py-3">Mode</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Sync</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((integration) => (
              <tr key={integration.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{integration.integration}</td>
                <td className="px-4 py-3">{integration.endpoint}</td>
                <td className="px-4 py-3">{integration.mode}</td>
                <td className="px-4 py-3">{integration.status}</td>
                <td className="px-4 py-3">{new Date(integration.lastSyncAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}