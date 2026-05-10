"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type { Role } from "@prisma/client";
import { Building2, HeartPulse, LogOut, Siren } from "lucide-react";
import { primaryNavItems } from "@/lib/navigation";
import { canAccessRoute } from "@/lib/rbac";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const rawRole = session?.user?.role;

  const role: Role | undefined =
    rawRole === "SUPER_ADMIN" ||
    rawRole === "HOSPITAL_ADMIN" ||
    rawRole === "DOCTOR" ||
    rawRole === "NURSE" ||
    rawRole === "PHARMACIST" ||
    rawRole === "LAB_TECH" ||
    rawRole === "BILLING_STAFF" ||
    rawRole === "RECEPTIONIST" ||
    rawRole === "PATIENT" ||
    rawRole === "EMERGENCY_API"
      ? rawRole
      : undefined;

  const visibleNavItems =
    status === "authenticated" && role
      ? primaryNavItems.filter((item) => canAccessRoute(role, item.href))
      : [];

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-line bg-surface lg:flex lg:flex-col">
      <div className="border-b border-line px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Vektor Core</p>
        <h1 className="mt-1 text-xl">Vektor Console</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {status === "loading" ? (
          <p className="px-2 py-2 text-xs text-foreground/60">Loading modules...</p>
        ) : (
          <ul className="space-y-1">
            {visibleNavItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    active
                      ? "bg-brand text-white"
                      : "text-foreground/80 hover:bg-surface-strong hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
            })}
          </ul>
        )}
      </nav>

      <div className="border-t border-line p-4">
        <div className="panel p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand">
            <Siren className="h-4 w-4" aria-hidden="true" />
            Emergency API Live
          </div>
          <p className="mt-1 text-xs text-foreground/70">Webhook and real-time alert feed connected.</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-foreground/70">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            {session?.user?.hospitalName || "Apollo North Campus"}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-foreground/70">
            <HeartPulse className="h-3.5 w-3.5" aria-hidden="true" />
            27 active encounters
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold"
          >
            <LogOut className="h-3.5 w-3.5 cursor-pointer" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
