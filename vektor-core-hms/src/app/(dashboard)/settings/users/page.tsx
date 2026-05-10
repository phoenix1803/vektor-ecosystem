import { UserCog } from "lucide-react";
import { listSettingUsers } from "@/lib/hms-data";

export default async function Page() {
  const users = await listSettingUsers();

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center gap-2 text-brand">
          <UserCog className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Settings</p>
        </div>
        <h1 className="mt-3 text-3xl">User Management</h1>
        <p className="mt-2 text-sm text-foreground/70">Review user status, roles, and last access timestamps.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{user.fullName}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.department}</td>
                <td className="px-4 py-3">{user.accountStatus}</td>
                <td className="px-4 py-3">{new Date(user.lastSeenAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}