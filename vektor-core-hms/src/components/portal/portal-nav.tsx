"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Activity, CalendarDays, CircleDollarSign, FileBadge2, HeartPulse, LogOut, MessageSquareText, ShieldAlert, Sparkles, Stethoscope, Tablet, UserRound, Users } from "lucide-react";

const portalItems = [
  { href: "/portal/timeline", label: "Timeline", icon: Activity },
  { href: "/portal/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/portal/billing", label: "Billing", icon: CircleDollarSign },
  { href: "/portal/vitals", label: "Vitals", icon: HeartPulse },
  { href: "/portal/emergency", label: "Emergency", icon: ShieldAlert },
  { href: "/portal/family", label: "Family", icon: Users },
  { href: "/portal/messages", label: "Messages", icon: MessageSquareText },
  { href: "/portal/goals", label: "Goals", icon: UserRound },
  { href: "/portal/reports", label: "Reports", icon: FileBadge2 },
  { href: "/portal/coach", label: "AI Coach", icon: Sparkles },
  { href: "/portal/symptoms", label: "Symptom Checker", icon: Stethoscope },
  { href: "/portal/medications", label: "Medication Tracker", icon: Tablet },
];

export function PortalNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-line bg-surface lg:flex lg:flex-col">
      <div className="border-b border-line px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Vektor Core</p>
        <h1 className="mt-1 text-xl">Patient Portal</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {portalItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    active ? "bg-brand text-white" : "text-foreground/80 hover:bg-surface-strong hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line p-4">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
