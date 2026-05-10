const moduleDictionary: Record<string, { title: string; description: string }> = {
  appointments: {
    title: "Appointments & Scheduling",
    description: "Calendar, queue board, and slot optimization workflows.",
  },
  emr: {
    title: "Clinical / EMR",
    description: "SOAP notes, encounter records, diagnosis coding, and prescriptions.",
  },
  lab: {
    title: "Lab & Diagnostics",
    description: "Order lifecycle, sample tracking, result entry, and radiology integration.",
  },
  pharmacy: {
    title: "Pharmacy",
    description: "Dispensing workflows, formulary policy, and inventory controls.",
  },
  ward: {
    title: "Inpatient / Ward",
    description: "Bed occupancy, nursing handover, MAR, and admission flow.",
  },
  billing: {
    title: "Billing & Finance",
    description: "Invoices, claims, packages, reconciliation, and payment lifecycle.",
  },
  inventory: {
    title: "Inventory & Supply Chain",
    description: "Central store operations, purchase orders, FEFO, and wastage monitoring.",
  },
  maintenance: {
    title: "Maintenance & Assets",
    description: "Equipment lifecycle, preventive schedule, and ticket resolution.",
  },
  hr: {
    title: "Administration & HR",
    description: "Staff directory, roster operations, credentials, and payroll data.",
  },
  analytics: {
    title: "Analytics & Reporting",
    description: "Executive, clinical, financial, and regulatory analytics surfaces.",
  },
  settings: {
    title: "Settings & Configuration",
    description: "RBAC, integrations, notifications, security, and governance controls.",
  },
};

export function getModuleMeta(slug: string[]) {
  const [head, ...rest] = slug;
  
  // Exclude emergency routes from module system - they have their own routing
  if (head === "emergency") {
    return null;
  }
  
  const base = moduleDictionary[head] || {
    title: head.replace(/-/g, " "),
    description: "Module view generated from the Vektor Core route map.",
  };

  const section = rest.length ? ` / ${rest.join(" / ")}` : "";

  return {
    title: `${base.title}${section}`,
    description: base.description,
    routeKey: [head, ...rest].join("/"),
  };
}
