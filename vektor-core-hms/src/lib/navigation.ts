import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Bed,
  CalendarDays,
  FlaskConical,
  LayoutDashboard,
  Pill,
  Settings,
  Siren,
  Stethoscope,
  UserRound,
  Wallet,
  Warehouse,
  Wrench,
  Users,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const primaryNavItems: NavItem[] = [
  { label: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Emergency Alerts", href: "/emergency", icon: AlertTriangle },
  { label: "RCR Command Center", href: "/dashboard/rcr-command-center", icon: Siren },
  { label: "Patients", href: "/patients", icon: UserRound },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
  { label: "Clinical / EMR", href: "/emr", icon: Stethoscope },
  { label: "Lab & Diagnostics", href: "/lab", icon: FlaskConical },
  { label: "Pharmacy", href: "/pharmacy", icon: Pill },
  { label: "Inpatient / Ward", href: "/ward/beds", icon: Bed },
  { label: "Billing & Finance", href: "/billing", icon: Wallet },
  { label: "Inventory", href: "/inventory", icon: Warehouse },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Administration & HR", href: "/hr", icon: Users },
  { label: "Analytics", href: "/analytics", icon: Activity },
  { label: "Settings", href: "/settings", icon: Settings },
];
