"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Bell, Search, UserCircle2 } from "lucide-react";
import { useIncident } from "@/app/context/incident-provider";

export function Topbar() {
  const { data: session } = useSession();
  const { adminIncidents, isAlertsPulsing } = useIncident();
  const role = session?.user?.role;
  const hospitalId = session?.user?.hospitalId;
  const isAdminLikeRole = role === "HOSPITAL_ADMIN" || role === "SUPER_ADMIN";

  const activeAlerts = adminIncidents.filter(
    (incident) =>
      incident.status === "active" &&
      (!hospitalId || role === "SUPER_ADMIN" ? true : incident.hospitalId === hospitalId)
  );

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 items-center justify-between gap-3 px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {session?.user?.hospitalName ? (
            <div className="hidden rounded-lg bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand md:block">
              {session.user.hospitalName}
            </div>
          ) : null}
          <label className="relative block w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
            <input
              type="search"
              placeholder="Search patient, UHID, encounter"
              className="w-full rounded-xl border border-line bg-white py-2 pl-9 pr-3 text-sm outline-none ring-brand/20 transition focus:ring"
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/emergency"
            className={`relative inline-flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger ${
              isAdminLikeRole && isAlertsPulsing ? "animate-pulse" : ""
            }`}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {activeAlerts.length} Active Alerts
            {activeAlerts.length > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white">
                {activeAlerts.length}
              </span>
            ) : null}
          </Link>
          <div className="hidden rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold text-foreground/70 md:block">
            {session?.user.hospitalName || "Hospital"} · {session?.user.role || "Staff"}
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium"
          >
            <UserCircle2 className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
