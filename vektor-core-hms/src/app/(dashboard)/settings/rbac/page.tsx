"use client";

import { useMemo, useState } from "react";
import { rolePolicies, type PermissionAction, type PermissionResource } from "@/lib/rbac";

const resources: PermissionResource[] = [
  "dashboard",
  "emergency",
  "patients",
  "appointments",
  "emr",
  "lab",
  "pharmacy",
  "ward",
  "billing",
  "inventory",
  "maintenance",
  "hr",
  "analytics",
  "settings",
];

const actions: PermissionAction[] = ["view", "create", "edit", "delete", "approve", "administer"];

export default function RbacPage() {
  const [selectedRole, setSelectedRole] = useState(rolePolicies[1].role);
  const currentPolicy = useMemo(
    () => rolePolicies.find((policy) => policy.role === selectedRole) ?? rolePolicies[0],
    [selectedRole],
  );

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <h1 className="text-3xl">RBAC Policy Editor</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Define which role can view, create, edit, approve, or administer each hospital module.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Roles</h2>
          <div className="mt-4 space-y-2">
            {rolePolicies.map((policy) => (
              <button
                key={policy.role}
                type="button"
                onClick={() => setSelectedRole(policy.role)}
                className={`block w-full rounded-xl border px-3 py-2 text-left text-sm ${
                  policy.role === selectedRole ? "border-brand bg-brand-soft text-brand" : "border-line bg-white"
                }`}
              >
                <div className="font-semibold">{policy.label}</div>
                <div className="text-xs text-foreground/65">{policy.description}</div>
              </button>
            ))}
          </div>
        </article>

        <article className="panel p-5 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{currentPolicy.label} Permissions</h2>
              <p className="text-sm text-foreground/70">Route and action matrix for the active role.</p>
            </div>
            <button className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white">Save Policy</button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-surface-strong text-foreground/75">
                <tr>
                  <th className="px-4 py-3">Module</th>
                  {actions.map((action) => (
                    <th key={action} className="px-4 py-3 uppercase tracking-[0.14em]">
                      {action}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resources.map((resource) => {
                  const permissions = currentPolicy.permissions[resource] ?? [];
                  return (
                    <tr key={resource} className="border-t border-line">
                      <td className="px-4 py-3 font-medium capitalize">{resource}</td>
                      {actions.map((action) => (
                        <td key={`${resource}-${action}`} className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 ${
                              permissions.includes(action)
                                ? "bg-brand-soft text-brand"
                                : "bg-surface-strong text-foreground/40"
                            }`}
                          >
                            {permissions.includes(action) ? "On" : "Off"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
