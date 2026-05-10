import type { Role } from "@prisma/client";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve" | "administer";

export type PermissionResource =
  | "dashboard"
  | "portal"
  | "emergency"
  | "rcr_command_center"
  | "patients"
  | "appointments"
  | "emr"
  | "lab"
  | "pharmacy"
  | "ward"
  | "billing"
  | "inventory"
  | "maintenance"
  | "hr"
  | "analytics"
  | "settings";

export type RolePolicy = {
  role: Role;
  label: string;
  description: string;
  routes: string[];
  permissions: Record<PermissionResource, PermissionAction[]>;
};

const defaultReadOnly = ["view"] as PermissionAction[];

const allActions: PermissionAction[] = ["view", "create", "edit", "delete", "approve", "administer"];

export const rolePolicies: RolePolicy[] = [
  {
    role: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full system access across all hospitals.",
    routes: [
      "/dashboard",
      "/dashboard/rcr-command-center",
      "/emergency",
      "/patients",
      "/appointments",
      "/emr",
      "/lab",
      "/pharmacy",
      "/ward",
      "/billing",
      "/inventory",
      "/maintenance",
      "/hr",
      "/analytics",
      "/settings",
    ],
    permissions: {
      dashboard: allActions,
      portal: defaultReadOnly,
      emergency: allActions,
      rcr_command_center: allActions,
      patients: allActions,
      appointments: allActions,
      emr: allActions,
      lab: allActions,
      pharmacy: allActions,
      ward: allActions,
      billing: allActions,
      inventory: allActions,
      maintenance: allActions,
      hr: allActions,
      analytics: allActions,
      settings: allActions,
    },
  },
  {
    role: "HOSPITAL_ADMIN",
    label: "Hospital Admin",
    description: "Operational control inside a single hospital.",
    routes: [
      "/dashboard",
      "/dashboard/rcr-command-center",
      "/emergency",
      "/patients",
      "/appointments",
      "/emr",
      "/lab",
      "/pharmacy",
      "/ward",
      "/billing",
      "/inventory",
      "/maintenance",
      "/hr",
      "/analytics",
      "/settings",
    ],
    permissions: {
      dashboard: ["view"],
      portal: defaultReadOnly,
      emergency: ["view", "approve"],
      rcr_command_center: ["view"],
      patients: ["view", "create", "edit"],
      appointments: ["view", "create", "edit", "delete"],
      emr: ["view", "create", "edit"],
      lab: ["view", "create", "edit"],
      pharmacy: ["view", "create", "edit"],
      ward: ["view", "create", "edit"],
      billing: ["view", "create", "edit", "approve"],
      inventory: ["view", "create", "edit"],
      maintenance: ["view", "create", "edit"],
      hr: ["view", "create", "edit"],
      analytics: ["view"],
      settings: ["view", "edit", "administer"],
    },
  },
  {
    role: "DOCTOR",
    label: "Doctor",
    description: "Clinical access for assigned patients and encounters.",
    routes: ["/dashboard", "/emergency", "/patients", "/appointments", "/emr", "/lab", "/analytics"],
    permissions: {
      dashboard: ["view"],
      portal: defaultReadOnly,
      emergency: ["view", "approve"],
      rcr_command_center: defaultReadOnly,
      patients: ["view", "edit"],
      appointments: ["view", "create", "edit"],
      emr: ["view", "create", "edit"],
      lab: ["view", "create"],
      pharmacy: ["view"],
      ward: ["view"],
      billing: defaultReadOnly,
      inventory: defaultReadOnly,
      maintenance: defaultReadOnly,
      hr: defaultReadOnly,
      analytics: ["view"],
      settings: defaultReadOnly,
    },
  },
  {
    role: "NURSE",
    label: "Nurse",
    description: "Ward and bedside operational access.",
    routes: ["/dashboard", "/emergency", "/patients", "/appointments", "/ward", "/lab"],
    permissions: {
      dashboard: ["view"],
      portal: defaultReadOnly,
      emergency: ["view", "approve"],
      rcr_command_center: defaultReadOnly,
      patients: ["view", "edit"],
      appointments: ["view"],
      emr: ["view"],
      lab: ["view"],
      pharmacy: ["view", "edit"],
      ward: ["view", "create", "edit"],
      billing: defaultReadOnly,
      inventory: defaultReadOnly,
      maintenance: defaultReadOnly,
      hr: defaultReadOnly,
      analytics: defaultReadOnly,
      settings: defaultReadOnly,
    },
  },
  {
    role: "PHARMACIST",
    label: "Pharmacist",
    description: "Dispense and stock operations.",
    routes: ["/dashboard", "/pharmacy", "/inventory"],
    permissions: {
      dashboard: ["view"],
      portal: defaultReadOnly,
      emergency: defaultReadOnly,
      rcr_command_center: defaultReadOnly,
      patients: ["view"],
      appointments: defaultReadOnly,
      emr: ["view"],
      lab: defaultReadOnly,
      pharmacy: ["view", "create", "edit", "approve"],
      ward: defaultReadOnly,
      billing: defaultReadOnly,
      inventory: ["view", "create", "edit"],
      maintenance: defaultReadOnly,
      hr: defaultReadOnly,
      analytics: defaultReadOnly,
      settings: defaultReadOnly,
    },
  },
  {
    role: "LAB_TECH",
    label: "Lab Tech",
    description: "Order and result entry for diagnostics.",
    routes: ["/dashboard", "/lab", "/patients"],
    permissions: {
      dashboard: ["view"],
      portal: defaultReadOnly,
      emergency: defaultReadOnly,
      rcr_command_center: defaultReadOnly,
      patients: ["view"],
      appointments: defaultReadOnly,
      emr: ["view"],
      lab: ["view", "create", "edit", "approve"],
      pharmacy: defaultReadOnly,
      ward: defaultReadOnly,
      billing: defaultReadOnly,
      inventory: defaultReadOnly,
      maintenance: defaultReadOnly,
      hr: defaultReadOnly,
      analytics: defaultReadOnly,
      settings: defaultReadOnly,
    },
  },
  {
    role: "BILLING_STAFF",
    label: "Billing Staff",
    description: "Invoices, claims, payments, and reconciliations.",
    routes: ["/dashboard", "/billing", "/patients"],
    permissions: {
      dashboard: ["view"],
      portal: defaultReadOnly,
      emergency: defaultReadOnly,
      rcr_command_center: defaultReadOnly,
      patients: ["view"],
      appointments: defaultReadOnly,
      emr: ["view"],
      lab: defaultReadOnly,
      pharmacy: defaultReadOnly,
      ward: ["view"],
      billing: ["view", "create", "edit", "approve"],
      inventory: defaultReadOnly,
      maintenance: defaultReadOnly,
      hr: defaultReadOnly,
      analytics: ["view"],
      settings: defaultReadOnly,
    },
  },
  {
    role: "RECEPTIONIST",
    label: "Receptionist",
    description: "Front desk registration and scheduling.",
    routes: ["/dashboard", "/emergency", "/patients", "/appointments"],
    permissions: {
      dashboard: ["view"],
      portal: defaultReadOnly,
      emergency: defaultReadOnly,
      rcr_command_center: defaultReadOnly,
      patients: ["view", "create", "edit"],
      appointments: ["view", "create", "edit", "delete"],
      emr: defaultReadOnly,
      lab: defaultReadOnly,
      pharmacy: defaultReadOnly,
      ward: defaultReadOnly,
      billing: defaultReadOnly,
      inventory: defaultReadOnly,
      maintenance: defaultReadOnly,
      hr: defaultReadOnly,
      analytics: defaultReadOnly,
      settings: defaultReadOnly,
    },
  },
  {
    role: "PATIENT",
    label: "Patient",
    description: "Own-record access only.",
    routes: ["/portal", "/dashboard"],
    permissions: {
      dashboard: ["view"],
      portal: ["view", "create", "edit"],
      emergency: defaultReadOnly,
      rcr_command_center: defaultReadOnly,
      patients: ["view"],
      appointments: ["view", "create"],
      emr: ["view"],
      lab: ["view"],
      pharmacy: ["view"],
      ward: defaultReadOnly,
      billing: ["view"],
      inventory: defaultReadOnly,
      maintenance: defaultReadOnly,
      hr: defaultReadOnly,
      analytics: defaultReadOnly,
      settings: defaultReadOnly,
    },
  },
  {
    role: "EMERGENCY_API",
    label: "Emergency API",
    description: "Scoped webhook write access for IoT agents.",
    routes: ["/api/emergency", "/api/v1/emergency"],
    permissions: {
      dashboard: defaultReadOnly,
      portal: defaultReadOnly,
      emergency: ["create"],
      rcr_command_center: defaultReadOnly,
      patients: defaultReadOnly,
      appointments: defaultReadOnly,
      emr: defaultReadOnly,
      lab: defaultReadOnly,
      pharmacy: defaultReadOnly,
      ward: defaultReadOnly,
      billing: defaultReadOnly,
      inventory: defaultReadOnly,
      maintenance: defaultReadOnly,
      hr: defaultReadOnly,
      analytics: defaultReadOnly,
      settings: defaultReadOnly,
    },
  },
];

export function getRolePolicy(role: Role) {
  return rolePolicies.find((policy) => policy.role === role) ?? rolePolicies[0];
}

export function canAccessRoute(role: Role, pathname: string) {
  const policy = getRolePolicy(role);
  return policy.routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function canPerform(role: Role, resource: PermissionResource, action: PermissionAction) {
  const policy = getRolePolicy(role);
  return policy.permissions[resource]?.includes(action) ?? false;
}

export function getDefaultLandingPath(role: Role) {
  switch (role) {
    case "DOCTOR":
      return "/dashboard";
    case "NURSE":
      return "/ward/beds";
    case "PHARMACIST":
      return "/pharmacy/dispense";
    case "LAB_TECH":
      return "/lab/orders";
    case "BILLING_STAFF":
      return "/billing/invoices";
    case "RECEPTIONIST":
      return "/appointments";
    case "PATIENT":
      return "/portal/timeline";
    default:
      return "/dashboard";
  }
}
