import type { Prisma } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { mockHospitals } from "@/lib/mock";

export type PatientRow = {
  id: string;
  uhid: string;
  fullName: string;
  phone: string | null;
  gender: string | null;
  age: number;
  primaryCondition: string;
  lastVisit: string;
  hospitalName: string;
};

export type AppointmentRow = {
  id: string;
  patientName: string;
  doctorName: string;
  startsAt: string;
  status: string;
  type: string;
  location: string;
};

export type AppointmentQueueRow = {
  id: string;
  token: string;
  patientName: string;
  doctorName: string;
  status: string;
  waitingMinutes: number;
};

export type BillingRow = {
  id: string;
  invoiceNo: string;
  patientName: string;
  totalAmount: number;
  status: string;
  issuedAt: string;
};

export type BillingClaimRow = {
  id: string;
  invoiceNo: string;
  patientName: string;
  payerName: string;
  claimAmount: number;
  status: string;
  submittedAt: string;
};

export type PreauthRow = {
  id: string;
  patientName: string;
  procedure: string;
  insurer: string;
  requestedAmount: number;
  status: string;
  updatedAt: string;
};

export type PaymentRow = {
  id: string;
  invoiceNo: string;
  patientName: string;
  method: string;
  amount: number;
  status: string;
  paidAt: string;
};

export type RefundRow = {
  id: string;
  invoiceNo: string;
  patientName: string;
  reason: string;
  amount: number;
  status: string;
  requestedAt: string;
};

export type CreditAccountRow = {
  id: string;
  accountName: string;
  limit: number;
  balance: number;
  status: string;
  dueDays: number;
};

export type BillingPackageRow = {
  id: string;
  name: string;
  category: string;
  price: number;
  active: boolean;
};

export type BillingAnalyticsSnapshot = {
  outstanding: number;
  denialRate: number;
  collectionRate: number;
  refundPipeline: number;
  paymentsToday: number;
};

export type LabOrderRow = {
  id: string;
  testCode: string;
  patientName: string;
  status: string;
  priority: string;
  orderedAt: string;
  abnormal?: boolean;
};

export type LabResultRow = {
  id: string;
  testCode: string;
  patientName: string;
  value: string;
  unit: string;
  status: string;
  resultedAt: string;
};

export type SampleTrackingRow = {
  id: string;
  sampleId: string;
  patientName: string;
  status: string;
  collectedAt: string;
  turnaroundMinutes: number;
};

export type RadiologyCaseRow = {
  id: string;
  study: string;
  patientName: string;
  aiFlag: string;
  status: string;
  updatedAt: string;
};

export type HomeCollectionRow = {
  id: string;
  patientName: string;
  address: string;
  slot: string;
  status: string;
};

export type WardBedRow = {
  id: string;
  ward: string;
  bedCode: string;
  status: string;
  patientName: string | null;
};

export type WardAdmissionRow = {
  id: string;
  patientName: string;
  uhid: string;
  ward: string;
  bedCode: string;
  status: string;
  admittedAt: string;
};

export type NursingTaskRow = {
  id: string;
  patientName: string;
  task: string;
  assignee: string;
  status: string;
  dueAt: string;
};

export type MarRow = {
  id: string;
  patientName: string;
  medication: string;
  dose: string;
  status: string;
  scheduledAt: string;
};

export type DietOrderRow = {
  id: string;
  patientName: string;
  dietType: string;
  notes: string;
  status: string;
};

export type IcuAlertRow = {
  id: string;
  patientName: string;
  bedCode: string;
  alert: string;
  severity: string;
  updatedAt: string;
};

export type VisitorPassRow = {
  id: string;
  patientName: string;
  visitorName: string;
  relation: string;
  passStatus: string;
  validUntil: string;
};

export type StaffRow = {
  id: string;
  fullName: string;
  role: string;
  department: string | null;
  specialty: string | null;
  licenseNumber: string | null;
};

export type RosterRow = {
  id: string;
  staffName: string;
  area: string;
  shift: string;
  status: string;
  date: string;
};

export type AttendanceRow = {
  id: string;
  staffName: string;
  checkIn: string;
  checkOut: string | null;
  status: string;
  leaveType: string | null;
};

export type PayrollRow = {
  id: string;
  staffName: string;
  baseSalary: number;
  overtimePay: number;
  deductions: number;
  netPay: number;
};

export type CredentialRow = {
  id: string;
  staffName: string;
  licenseNumber: string;
  specialty: string;
  renewalDate: string;
  status: string;
};

export type PerformanceRow = {
  id: string;
  staffName: string;
  score: number;
  satisfaction: number;
  caseload: number;
  status: string;
};

export type TrainingRow = {
  id: string;
  staffName: string;
  course: string;
  completion: number;
  dueDate: string;
  status: string;
};

export type VendorRow = {
  id: string;
  vendorName: string;
  contact: string;
  service: string;
  status: string;
};

export type InventoryRow = {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockOnHand: number;
  reorderLevel: number;
  expiryDate: string | null;
};

export type ConsignmentRow = {
  id: string;
  implantName: string;
  vendorName: string;
  lotNo: string;
  quantityAvailable: number;
  status: string;
};

export type ExpiryWatchRow = {
  id: string;
  itemName: string;
  sku: string;
  expiryDate: string;
  daysToExpire: number;
  stockOnHand: number;
};

export type PurchaseOrderRow = {
  id: string;
  poNo: string;
  vendorName: string;
  itemCount: number;
  totalAmount: number;
  status: string;
  expectedDate: string;
};

export type LinenRow = {
  id: string;
  ward: string;
  issued: number;
  returned: number;
  pending: number;
  turnAroundHours: number;
};

export type EquipmentRow = {
  id: string;
  name: string;
  serial: string;
  status: string;
  amcStatus: string;
};

export type MaintenanceScheduleRow = {
  id: string;
  equipmentName: string;
  task: string;
  dueDate: string;
  status: string;
};

export type MaintenanceTicketRow = {
  id: string;
  ticketNo: string;
  equipmentName: string;
  issue: string;
  status: string;
  priority: string;
};

export type CalibrationRow = {
  id: string;
  equipmentName: string;
  performedAt: string;
  nextDue: string;
  status: string;
};

export type HousekeepingRow = {
  id: string;
  room: string;
  assignee: string;
  status: string;
  dueAt: string;
};

export type InspectionRow = {
  id: string;
  area: string;
  inspector: string;
  status: string;
  scheduledAt: string;
};

export type PharmacyInventoryRow = {
  id: string;
  sku: string;
  name: string;
  stockOnHand: number;
  reorderLevel: number;
  expiryDate: string | null;
  stockStatus: string;
};

export type FormularyRow = {
  id: string;
  drugName: string;
  genericName: string;
  category: string;
  substitutionPolicy: string;
  status: string;
};

export type ControlledSubstanceRow = {
  id: string;
  drugName: string;
  schedule: string;
  balanceUnits: number;
  lastIssuedTo: string;
  lastIssuedAt: string;
  auditStatus: string;
};

export type CommandCenterAlertRow = {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  module: string;
  title: string;
  detail: string;
  ageMinutes: number;
  routePath: string;
};

export type CommandCenterSnapshot = {
  bedPressurePercent: number;
  criticalLabsPending: number;
  emergencyLoad: number;
  dischargeBlockers: number;
  billingBlockers: number;
  alerts: CommandCenterAlertRow[];
};

export type OrchestratedTaskRow = {
  id: string;
  sourceEvent: string;
  module: string;
  title: string;
  assigneeRole: string;
  status: "OPEN" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "ESCALATED";
  slaDueAt: string;
  createdAt: string;
};

export type SlaSnapshotRow = {
  id: string;
  process: string;
  p50Minutes: number;
  p90Minutes: number;
  breaches24h: number;
  updatedAt: string;
};

export type AuditTimelineRow = {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId: string | null;
  reason: string;
  ipAddress: string;
  createdAt: string;
};

export type PathwayRow = {
  id: string;
  pathwayName: string;
  patientName: string;
  ownerRole: string;
  adherenceScore: number;
  overdueSteps: number;
  status: "ON_TRACK" | "WATCH" | "AT_RISK";
  nextActionDue: string;
};

export type RevenueLeakageRow = {
  id: string;
  encounterId: string;
  patientName: string;
  category: string;
  potentialLeakage: number;
  status: "OPEN" | "UNDER_REVIEW" | "RECOVERED";
  recommendedAction: string;
  detectedAt: string;
};

export type PlaybookRuleRow = {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  isActive: boolean;
  version: number;
  updatedAt: string;
};

export type JourneyScoreRow = {
  id: string;
  scope: "PATIENT" | "DEPARTMENT" | "HOSPITAL";
  scopeId: string;
  patientName: string | null;
  clinicalSafety: number;
  serviceTimeliness: number;
  communication: number;
  billingFriction: number;
  compositeScore: number;
  trend: "UP" | "STABLE" | "DOWN";
};

export type RiskFlagRow = {
  id: string;
  patientName: string;
  riskType: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  confidence: number;
  factors: string[];
  recommendation: string;
  status: "OPEN" | "ACKNOWLEDGED" | "DISMISSED";
  reviewedBy: string | null;
};

export type AccreditationEvidenceRow = {
  id: string;
  standard: string;
  controlCode: string;
  title: string;
  owner: string;
  status: "READY" | "PARTIAL" | "GAP";
  evidenceCount: number;
  gapCount: number;
  lastUpdated: string;
};

export type AuditRow = {
  id: string;
  actorName: string;
  action: string;
  resource: string;
  resourceId: string | null;
  createdAt: string;
};

export type PortalMessageRow = {
  id: string;
  senderName: string;
  senderRole: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export type HealthGoalRow = {
  id: string;
  title: string;
  target: string;
  progress: number;
  status: string;
};

export type PrescriptionRow = {
  id: string;
  prescriptionNo: string;
  patientName: string;
  status: string;
  prescribedAt: string;
  medicationCount: number;
};

export type ClinicalNoteRow = {
  id: string;
  encounterType: string;
  summary: string;
  createdAt: string;
};

export type ChronicRegistryRow = {
  id: string;
  patientName: string;
  condition: string;
  riskLevel: string;
  lastReviewAt: string;
  nextReviewAt: string;
};

export type SecondOpinionRow = {
  id: string;
  caseNo: string;
  patientName: string;
  specialty: string;
  requestedAt: string;
  status: string;
};

export type SurgicalNoteRow = {
  id: string;
  patientName: string;
  procedure: string;
  surgeon: string;
  phase: string;
  noteStatus: string;
  updatedAt: string;
};

export type AnalyticsSnapshot = {
  revenue: number;
  occupancy: number;
  aLos: number;
  satisfaction: number;
  readmissions: number;
  outbreakSignals: number;
};

export type ReportTemplateRow = {
  id: string;
  name: string;
  domain: string;
  cadence: string;
  lastRunAt: string;
  status: string;
};

export type ClinicalOutcomeRow = {
  id: string;
  department: string;
  readmissionRate: number;
  complicationRate: number;
  mortalityRate: number;
  avgLengthOfStay: number;
};

export type EpidemiologySignalRow = {
  id: string;
  syndrome: string;
  unit: string;
  cases7d: number;
  baseline: number;
  riskLevel: string;
};

export type FinanceMetricRow = {
  id: string;
  department: string;
  revenue: number;
  cost: number;
  margin: number;
  collectionRate: number;
};

export type RegulatoryReportRow = {
  id: string;
  reportName: string;
  authority: string;
  dueDate: string;
  owner: string;
  status: string;
};

export type SatisfactionMetricRow = {
  id: string;
  touchpoint: string;
  nps: number;
  csat: number;
  complaints: number;
  trend: string;
};

export type SettingUserRow = {
  id: string;
  fullName: string;
  role: string;
  department: string;
  accountStatus: string;
  lastSeenAt: string;
};

export type NotificationRuleRow = {
  id: string;
  trigger: string;
  channel: string;
  recipientGroup: string;
  slaMinutes: number;
  enabled: boolean;
};

export type IntegrationStatusRow = {
  id: string;
  integration: string;
  endpoint: string;
  mode: string;
  status: string;
  lastSyncAt: string;
};

export type HospitalProfileRow = {
  id: string;
  hospitalName: string;
  licenseNo: string;
  gstin: string;
  nablStatus: string;
  nabhStatus: string;
  registeredAddress: string;
};

export type PatientDetailRecord = {
  patient: {
    id: string;
    fullName: string;
    uhid: string;
    phone: string | null;
    gender: string | null;
    age: number;
    hospitalName: string;
    hospital?: { name: string };
  };
  familyMembers: Array<{
    id: string;
    fullName: string;
    relation: string;
    phone: string | null;
    dateOfBirth: Date | null;
    conditions: Prisma.JsonValue;
    isEmergency: boolean;
  }>;
  documents: Array<{
    id: string;
    title: string;
    documentType: string;
    fileUrl: string | null;
    ocrText: string | null;
    createdAt: Date;
  }>;
  consents: Array<{
    id: string;
    consentType: string;
    status: string;
    signedBy: string;
    signedAt: Date;
    metadata: unknown;
  }>;
  abhaLink: {
    id: string;
    abhaAddress: string;
    healthId: string;
    status: string;
    linkedAt: Date;
  } | null;
  healthGoals: Array<{
    id: string;
    title: string;
    target: string;
    progress: number;
    status: string;
  }>;
  portalMessages: Array<{
    id: string;
    senderName: string;
    senderRole: string;
    body: string;
    isRead: boolean;
    createdAt: string;
  }>;
  encounters: Array<{
    id: string;
    type: string;
    startedAt: string | Date;
    notes: string;
    vitals?: Array<{
      heartRate: number | null;
      spo2: number | null;
      bloodPressure: string | null;
      temperature: number | null;
    }>;
    labOrders?: Array<{
      id: string;
      testCode: string;
      status: string;
      results: unknown[];
    }>;
    prescriptions?: Array<{
      id: string;
      status: string;
      notes: string | null;
      medications: unknown[];
    }>;
    billingInvoice?: {
      invoiceNo: string;
      status: string;
      totalAmount: number;
    } | null;
    admission?: {
      status: string;
      bed: {
        ward: string;
        bedCode: string;
        status: string;
      };
    } | null;
  }>;
};

const patientFallbacks: PatientRow[] = [
  {
    id: "pat-1",
    uhid: "UHID-12091",
    fullName: "Arjun Mehta",
    phone: "+91-9820001122",
    gender: "Male",
    age: 47,
    primaryCondition: "Type 2 Diabetes",
    lastVisit: "2026-04-15",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-2",
    uhid: "UHID-12092",
    fullName: "Neha Shah",
    phone: "+91-9820001133",
    gender: "Female",
    age: 31,
    primaryCondition: "Asthma",
    lastVisit: "2026-04-16",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-3",
    uhid: "UHID-12093",
    fullName: "Rakesh Saini",
    phone: "+91-9820001144",
    gender: "Male",
    age: 54,
    primaryCondition: "Post-op follow-up",
    lastVisit: "2026-04-16",
    hospitalName: "City Care Hospital",
  },
  {
    id: "pat-4",
    uhid: "UHID-12094",
    fullName: "Sunita Kapoor",
    phone: "+91-9820001155",
    gender: "Female",
    age: 62,
    primaryCondition: "Hypertension",
    lastVisit: "2026-04-17",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-5",
    uhid: "UHID-12095",
    fullName: "Vinay Malhotra",
    phone: "+91-9820001166",
    gender: "Male",
    age: 38,
    primaryCondition: "Bronchial Asthma",
    lastVisit: "2026-04-16",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-6",
    uhid: "UHID-12096",
    fullName: "Priya Desai",
    phone: "+91-9820001177",
    gender: "Female",
    age: 29,
    primaryCondition: "Anemia",
    lastVisit: "2026-04-15",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-7",
    uhid: "UHID-12097",
    fullName: "Ramesh Yadav",
    phone: "+91-9820001188",
    gender: "Male",
    age: 71,
    primaryCondition: "CKD Stage 3",
    lastVisit: "2026-04-14",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-8",
    uhid: "UHID-12098",
    fullName: "Kavya Nair",
    phone: "+91-9820001199",
    gender: "Female",
    age: 45,
    primaryCondition: "Rheumatoid Arthritis",
    lastVisit: "2026-04-17",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-9",
    uhid: "UHID-12099",
    fullName: "Deepak Joshi",
    phone: "+91-9820001200",
    gender: "Male",
    age: 55,
    primaryCondition: "Post-MI Follow-up",
    lastVisit: "2026-04-17",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-10",
    uhid: "UHID-12100",
    fullName: "Ananya Pillai",
    phone: "+91-9820001211",
    gender: "Female",
    age: 34,
    primaryCondition: "Migraine",
    lastVisit: "2026-04-16",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-11",
    uhid: "UHID-12101",
    fullName: "Suresh Pandey",
    phone: "+91-9820001222",
    gender: "Male",
    age: 48,
    primaryCondition: "Lumbar Spondylosis",
    lastVisit: "2026-04-15",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-12",
    uhid: "UHID-12102",
    fullName: "Meera Krishnan",
    phone: "+91-9820001233",
    gender: "Female",
    age: 67,
    primaryCondition: "Hypothyroidism",
    lastVisit: "2026-04-14",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-13",
    uhid: "UHID-12103",
    fullName: "Aditya Bose",
    phone: "+91-9820001244",
    gender: "Male",
    age: 22,
    primaryCondition: "Sports Injury",
    lastVisit: "2026-04-17",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-14",
    uhid: "UHID-12104",
    fullName: "Rekha Sharma",
    phone: "+91-9820001255",
    gender: "Female",
    age: 53,
    primaryCondition: "Fibromyalgia",
    lastVisit: "2026-04-16",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "pat-15",
    uhid: "UHID-12105",
    fullName: "Gaurav Mishra",
    phone: "+91-9820001266",
    gender: "Male",
    age: 41,
    primaryCondition: "Hypertension + Diabetes",
    lastVisit: "2026-04-17",
    hospitalName: "Apollo North Campus",
  },
];

function demoRows<T>(rows: T[], fallbackRows: T[]) {
  return rows.length ? rows : fallbackRows;
}

const appointmentFallbacks: AppointmentRow[] = [
  { id: "apt-1", patientName: "Arjun Mehta", doctorName: "Dr. Sana Iyer", startsAt: "2026-04-16T09:00:00.000Z", status: "COMPLETED", type: "OPD", location: "Apollo North Campus" },
  { id: "apt-2", patientName: "Neha Shah", doctorName: "Dr. Rajesh Kumar", startsAt: "2026-04-16T11:30:00.000Z", status: "NO_SHOW", type: "OPD", location: "Apollo North Campus" },
  { id: "apt-3", patientName: "Rakesh Saini", doctorName: "Dr. Anjali Kapoor", startsAt: "2026-04-18T08:30:00.000Z", status: "BOOKED", type: "TELE", location: "City Care Hospital" },
  { id: "apt-4", patientName: "Sunita Kapoor", doctorName: "Dr. Vikram Singh", startsAt: "2026-04-17T10:00:00.000Z", status: "CHECKED_IN", type: "OPD", location: "Apollo North Campus" },
  { id: "apt-5", patientName: "Vinay Malhotra", doctorName: "Dr. Rajesh Kumar", startsAt: "2026-04-17T11:00:00.000Z", status: "BOOKED", type: "OPD", location: "Apollo North Campus" },
  { id: "apt-6", patientName: "Priya Desai", doctorName: "Dr. Sana Iyer", startsAt: "2026-04-17T13:30:00.000Z", status: "BOOKED", type: "TELE", location: "Apollo North Campus" },
  { id: "apt-7", patientName: "Ramesh Yadav", doctorName: "Dr. Anjali Kapoor", startsAt: "2026-04-16T09:00:00.000Z", status: "COMPLETED", type: "OPD", location: "Apollo North Campus" },
  { id: "apt-8", patientName: "Kavya Nair", doctorName: "Dr. Sana Iyer", startsAt: "2026-04-16T14:00:00.000Z", status: "COMPLETED", type: "OPD", location: "Apollo North Campus" },
  { id: "apt-9", patientName: "Deepak Joshi", doctorName: "Dr. Vikram Singh", startsAt: "2026-04-17T15:00:00.000Z", status: "BOOKED", type: "EMERGENCY", location: "Apollo North Campus" },
  { id: "apt-10", patientName: "Ananya Pillai", doctorName: "Dr. Meera Bhatt", startsAt: "2026-04-17T16:00:00.000Z", status: "BOOKED", type: "OPD", location: "Apollo North Campus" },
  { id: "apt-11", patientName: "Suresh Pandey", doctorName: "Dr. Ravi Patel", startsAt: "2026-04-16T11:00:00.000Z", status: "NO_SHOW", type: "OPD", location: "Apollo North Campus" },
  { id: "apt-12", patientName: "Meera Krishnan", doctorName: "Dr. Anjali Kapoor", startsAt: "2026-04-17T09:30:00.000Z", status: "CHECKED_IN", type: "OPD", location: "Apollo North Campus" },
];

const billingFallbacks: BillingRow[] = [
  { id: "inv-1", invoiceNo: "VKC-2026-3001", patientName: "Arjun Mehta", totalAmount: 16400, status: "PENDING", issuedAt: "2026-04-16T10:10:00.000Z" },
  { id: "inv-2", invoiceNo: "VKC-2026-3002", patientName: "Neha Shah", totalAmount: 8200, status: "PAID", issuedAt: "2026-04-16T11:20:00.000Z" },
  { id: "inv-3", invoiceNo: "VKC-2026-3003", patientName: "Rakesh Saini", totalAmount: 24300, status: "DRAFT", issuedAt: "2026-04-16T13:30:00.000Z" },
  { id: "inv-4", invoiceNo: "VKC-2026-3004", patientName: "Sunita Kapoor", totalAmount: 8900, status: "PAID", issuedAt: "2026-04-15T09:00:00.000Z" },
  { id: "inv-5", invoiceNo: "VKC-2026-3005", patientName: "Vinay Malhotra", totalAmount: 15600, status: "PENDING", issuedAt: "2026-04-16T10:00:00.000Z" },
  { id: "inv-6", invoiceNo: "VKC-2026-3006", patientName: "Priya Desai", totalAmount: 5200, status: "PAID", issuedAt: "2026-04-15T11:00:00.000Z" },
  { id: "inv-7", invoiceNo: "VKC-2026-3007", patientName: "Ramesh Yadav", totalAmount: 124500, status: "OVERDUE", issuedAt: "2026-04-10T09:00:00.000Z" },
  { id: "inv-8", invoiceNo: "VKC-2026-3008", patientName: "Deepak Joshi", totalAmount: 82000, status: "PENDING", issuedAt: "2026-04-16T14:00:00.000Z" },
  { id: "inv-9", invoiceNo: "VKC-2026-3009", patientName: "Kavya Nair", totalAmount: 240000, status: "PENDING", issuedAt: "2026-04-17T08:00:00.000Z" },
  { id: "inv-10", invoiceNo: "VKC-2026-3010", patientName: "Ananya Pillai", totalAmount: 3800, status: "PAID", issuedAt: "2026-04-14T12:00:00.000Z" },
  { id: "inv-11", invoiceNo: "VKC-2026-3011", patientName: "Gaurav Mishra", totalAmount: 46800, status: "PENDING", issuedAt: "2026-04-17T09:40:00.000Z" },
  { id: "inv-12", invoiceNo: "VKC-2026-3012", patientName: "Meera Krishnan", totalAmount: 9800, status: "OVERDUE", issuedAt: "2026-04-09T15:10:00.000Z" },
  { id: "inv-13", invoiceNo: "VKC-2026-3013", patientName: "Aditya Bose", totalAmount: 7200, status: "DRAFT", issuedAt: "2026-04-17T11:25:00.000Z" },
];

const billingClaimFallbacks: BillingClaimRow[] = [
  { id: "clm-1", invoiceNo: "VKC-2026-3001", patientName: "Arjun Mehta", payerName: "Star Health", claimAmount: 16400, status: "SUBMITTED", submittedAt: "2026-04-16T12:00:00.000Z" },
  { id: "clm-2", invoiceNo: "VKC-2026-3002", patientName: "Neha Shah", payerName: "HDFC Ergo", claimAmount: 8200, status: "APPROVED", submittedAt: "2026-04-16T12:45:00.000Z" },
  { id: "clm-3", invoiceNo: "VKC-2026-3003", patientName: "Rakesh Saini", payerName: "Bajaj Allianz", claimAmount: 24300, status: "DENIED", submittedAt: "2026-04-16T13:20:00.000Z" },
];

const preauthFallbacks: PreauthRow[] = [
  { id: "pa-1", patientName: "Arjun Mehta", procedure: "Cardiac Cath", insurer: "Star Health", requestedAmount: 90000, status: "APPROVED", updatedAt: "2026-04-16T09:10:00.000Z" },
  { id: "pa-2", patientName: "Neha Shah", procedure: "CT Chest", insurer: "HDFC Ergo", requestedAmount: 12000, status: "PENDING", updatedAt: "2026-04-16T10:05:00.000Z" },
];

const paymentFallbacks: PaymentRow[] = [
  { id: "pay-1", invoiceNo: "VKC-2026-3001", patientName: "Arjun Mehta", method: "UPI", amount: 10000, status: "PARTIAL", paidAt: "2026-04-16T14:00:00.000Z" },
  { id: "pay-2", invoiceNo: "VKC-2026-3002", patientName: "Neha Shah", method: "Card", amount: 8200, status: "SETTLED", paidAt: "2026-04-16T14:20:00.000Z" },
  { id: "pay-3", invoiceNo: "VKC-2026-3003", patientName: "Rakesh Saini", method: "Cash", amount: 5000, status: "PARTIAL", paidAt: "2026-04-16T15:00:00.000Z" },
];

const refundFallbacks: RefundRow[] = [
  { id: "ref-1", invoiceNo: "VKC-2026-3001", patientName: "Arjun Mehta", reason: "Overcharge correction", amount: 1200, status: "PENDING", requestedAt: "2026-04-16T16:00:00.000Z" },
  { id: "ref-2", invoiceNo: "VKC-2026-3002", patientName: "Neha Shah", reason: "Package adjustment", amount: 600, status: "APPROVED", requestedAt: "2026-04-16T16:20:00.000Z" },
];

const creditFallbacks: CreditAccountRow[] = [
  { id: "cr-1", accountName: "Metro Corp", limit: 500000, balance: 135000, status: "ACTIVE", dueDays: 30 },
  { id: "cr-2", accountName: "City Employer Trust", limit: 300000, balance: 90000, status: "PAST_DUE", dueDays: 15 },
];

const packageFallbacks: BillingPackageRow[] = [
  { id: "pkg-1", name: "Executive Health Check", category: "Preventive", price: 12000, active: true },
  { id: "pkg-2", name: "Knee Arthroscopy Bundle", category: "Surgical", price: 85000, active: true },
  { id: "pkg-3", name: "Diabetes Follow-up Pack", category: "Chronic Care", price: 4500, active: true },
];

const labFallbacks: LabOrderRow[] = [
  { id: "lab-1", testCode: "CBC", patientName: "Arjun Mehta", status: "PROCESSING", priority: "ROUTINE", orderedAt: "2026-04-16T09:30:00.000Z", abnormal: false },
  { id: "lab-2", testCode: "HbA1c", patientName: "Neha Shah", status: "ORDERED", priority: "URGENT", orderedAt: "2026-04-16T10:45:00.000Z", abnormal: true },
  { id: "lab-3", testCode: "Lipid", patientName: "Rakesh Saini", status: "RESULTED", priority: "ROUTINE", orderedAt: "2026-04-16T12:15:00.000Z", abnormal: false },
  { id: "lab-4", testCode: "TROPONIN-I", patientName: "Deepak Joshi", status: "RESULTED", priority: "STAT", orderedAt: "2026-04-17T08:25:00.000Z", abnormal: true },
  { id: "lab-5", testCode: "D-DIMER", patientName: "Sunita Kapoor", status: "PROCESSING", priority: "URGENT", orderedAt: "2026-04-17T09:05:00.000Z", abnormal: false },
  { id: "lab-6", testCode: "UREA-CREAT", patientName: "Ramesh Yadav", status: "RESULTED", priority: "ROUTINE", orderedAt: "2026-04-16T07:40:00.000Z", abnormal: true },
  { id: "lab-7", testCode: "LFT", patientName: "Priya Desai", status: "ORDERED", priority: "ROUTINE", orderedAt: "2026-04-17T10:35:00.000Z", abnormal: false },
  { id: "lab-8", testCode: "ECG-REPORT", patientName: "Deepak Joshi", status: "RESULTED", priority: "STAT", orderedAt: "2026-04-17T08:55:00.000Z", abnormal: true },
];

const labResultFallbacks: LabResultRow[] = [
  { id: "lr-1", testCode: "CBC", patientName: "Arjun Mehta", value: "13.2", unit: "g/dL", status: "NORMAL", resultedAt: "2026-04-16T10:00:00.000Z" },
  { id: "lr-2", testCode: "HbA1c", patientName: "Neha Shah", value: "8.4", unit: "%", status: "ABNORMAL", resultedAt: "2026-04-16T11:15:00.000Z" },
  { id: "lr-3", testCode: "Lipid", patientName: "Rakesh Saini", value: "198", unit: "mg/dL", status: "NORMAL", resultedAt: "2026-04-16T12:30:00.000Z" },
];

const sampleTrackingFallbacks: SampleTrackingRow[] = [
  { id: "sp-1", sampleId: "SMP-1001", patientName: "Arjun Mehta", status: "IN_TRANSIT", collectedAt: "2026-04-16T09:40:00.000Z", turnaroundMinutes: 45 },
  { id: "sp-2", sampleId: "SMP-1002", patientName: "Neha Shah", status: "COLLECTED", collectedAt: "2026-04-16T10:50:00.000Z", turnaroundMinutes: 30 },
  { id: "sp-3", sampleId: "SMP-1003", patientName: "Rakesh Saini", status: "RESULTED", collectedAt: "2026-04-16T12:20:00.000Z", turnaroundMinutes: 60 },
];

const radiologyFallbacks: RadiologyCaseRow[] = [
  { id: "rad-1", study: "Chest X-Ray", patientName: "Arjun Mehta", aiFlag: "No acute findings", status: "REPORTED", updatedAt: "2026-04-16T10:20:00.000Z" },
  { id: "rad-2", study: "CT Brain", patientName: "Neha Shah", aiFlag: "Requires neurologist review", status: "PENDING", updatedAt: "2026-04-16T11:30:00.000Z" },
  { id: "rad-3", study: "Ultrasound Abdomen", patientName: "Rakesh Saini", aiFlag: "Normal morphology", status: "REPORTED", updatedAt: "2026-04-16T13:00:00.000Z" },
];

const homeCollectionFallbacks: HomeCollectionRow[] = [
  { id: "hc-1", patientName: "Arjun Mehta", address: "Indiranagar, Bengaluru", slot: "2026-04-17 08:00", status: "SCHEDULED" },
  { id: "hc-2", patientName: "Neha Shah", address: "Jayanagar, Bengaluru", slot: "2026-04-17 09:30", status: "ASSIGNED" },
];

const wardFallbacks: WardBedRow[] = [
  { id: "bed-1", ward: "ICU", bedCode: "ICU-01", status: "Occupied", patientName: "Arjun Mehta" },
  { id: "bed-2", ward: "ICU", bedCode: "ICU-02", status: "Vacant", patientName: null },
  { id: "bed-3", ward: "General", bedCode: "GW-11", status: "Cleaning", patientName: null },
  { id: "bed-4", ward: "General", bedCode: "GW-12", status: "Occupied", patientName: "Neha Shah" },
  { id: "bed-5", ward: "ICU", bedCode: "ICU-03", status: "Vacant", patientName: null },
  { id: "bed-6", ward: "ICU", bedCode: "ICU-04", status: "Occupied", patientName: "Deepak Joshi" },
  { id: "bed-7", ward: "General", bedCode: "GW-13", status: "Vacant", patientName: null },
  { id: "bed-8", ward: "General", bedCode: "GW-14", status: "Occupied", patientName: "Ramesh Yadav" },
  { id: "bed-9", ward: "General", bedCode: "GW-15", status: "Cleaning", patientName: null },
  { id: "bed-10", ward: "General", bedCode: "GW-16", status: "Occupied", patientName: "Kavya Nair" },
  { id: "bed-11", ward: "Stepdown", bedCode: "SD-01", status: "Occupied", patientName: "Sunita Kapoor" },
  { id: "bed-12", ward: "Stepdown", bedCode: "SD-02", status: "Vacant", patientName: null },
  { id: "bed-13", ward: "OT", bedCode: "OT-01", status: "Occupied", patientName: "Priya Desai" },
  { id: "bed-14", ward: "OT", bedCode: "OT-02", status: "Cleaning", patientName: null },
  { id: "bed-15", ward: "Stepdown", bedCode: "SD-03", status: "Occupied", patientName: "Meera Krishnan" },
  { id: "bed-16", ward: "OT", bedCode: "OT-03", status: "Vacant", patientName: null },
];

const wardAdmissionFallbacks: WardAdmissionRow[] = [
  { id: "adm-1", patientName: "Arjun Mehta", uhid: "UHID-12091", ward: "ICU", bedCode: "ICU-01", status: "ADMITTED", admittedAt: "2026-04-15T09:10:00.000Z" },
  { id: "adm-2", patientName: "Neha Shah", uhid: "UHID-12092", ward: "General", bedCode: "GW-12", status: "TRANSFERRED", admittedAt: "2026-04-16T10:40:00.000Z" },
  { id: "adm-3", patientName: "Rakesh Saini", uhid: "UHID-12093", ward: "Stepdown", bedCode: "SD-03", status: "DISCHARGED", admittedAt: "2026-04-14T08:00:00.000Z" },
];

const nursingFallbacks: NursingTaskRow[] = [
  { id: "nurse-1", patientName: "Arjun Mehta", task: "Vitals round", assignee: "Nisha Varma", status: "OPEN", dueAt: "2026-04-17T08:30:00.000Z" },
  { id: "nurse-2", patientName: "Neha Shah", task: "Medication reconciliation", assignee: "Nisha Varma", status: "IN_PROGRESS", dueAt: "2026-04-17T09:00:00.000Z" },
  { id: "nurse-3", patientName: "Rakesh Saini", task: "Handover note", assignee: "Kavya Rao", status: "DONE", dueAt: "2026-04-16T19:00:00.000Z" },
];

const marFallbacks: MarRow[] = [
  { id: "mar-1", patientName: "Arjun Mehta", medication: "Metformin", dose: "500mg", status: "DUE", scheduledAt: "2026-04-17T08:00:00.000Z" },
  { id: "mar-2", patientName: "Neha Shah", medication: "Salbutamol", dose: "2 puffs", status: "ADMINISTERED", scheduledAt: "2026-04-17T09:00:00.000Z" },
  { id: "mar-3", patientName: "Rakesh Saini", medication: "Paracetamol", dose: "650mg", status: "MISSED", scheduledAt: "2026-04-17T10:00:00.000Z" },
];

const dietFallbacks: DietOrderRow[] = [
  { id: "diet-1", patientName: "Arjun Mehta", dietType: "Diabetic Diet", notes: "Low sugar, high fiber", status: "ACTIVE" },
  { id: "diet-2", patientName: "Neha Shah", dietType: "Soft Diet", notes: "Post-op recovery", status: "ACTIVE" },
  { id: "diet-3", patientName: "Rakesh Saini", dietType: "Regular Diet", notes: "Monitor appetite", status: "PENDING" },
];

const icuFallbacks: IcuAlertRow[] = [
  { id: "icu-1", patientName: "Arjun Mehta", bedCode: "ICU-01", alert: "SpO2 trending low", severity: "HIGH", updatedAt: "2026-04-17T08:45:00.000Z" },
  { id: "icu-2", patientName: "Neha Shah", bedCode: "ICU-02", alert: "Stable on observation", severity: "LOW", updatedAt: "2026-04-17T09:20:00.000Z" },
];

const visitorFallbacks: VisitorPassRow[] = [
  { id: "vis-1", patientName: "Arjun Mehta", visitorName: "Priya Mehta", relation: "Spouse", passStatus: "APPROVED", validUntil: "2026-04-17T18:00:00.000Z" },
  { id: "vis-2", patientName: "Neha Shah", visitorName: "Rahul Shah", relation: "Brother", passStatus: "PENDING", validUntil: "2026-04-17T20:00:00.000Z" },
];

const staffFallbacks: StaffRow[] = [
  { id: "user-1", fullName: "Dr. Sana Iyer", role: "DOCTOR", department: "Medicine", specialty: "Internal Medicine", licenseNumber: "MCI-1122" },
  { id: "user-2", fullName: "Nisha Varma", role: "NURSE", department: "ICU", specialty: null, licenseNumber: "NUR-3344" },
  { id: "user-3", fullName: "Imran Khan", role: "BILLING_STAFF", department: "Finance", specialty: null, licenseNumber: null },
];

const rosterFallbacks: RosterRow[] = [
  { id: "ros-1", staffName: "Dr. Sana Iyer", area: "Medicine", shift: "Morning", status: "CONFIRMED", date: "2026-04-17" },
  { id: "ros-2", staffName: "Nisha Varma", area: "ICU", shift: "Evening", status: "SWAP REQUESTED", date: "2026-04-17" },
  { id: "ros-3", staffName: "Imran Khan", area: "Finance", shift: "Night", status: "CONFIRMED", date: "2026-04-17" },
];

const attendanceFallbacks: AttendanceRow[] = [
  { id: "att-1", staffName: "Dr. Sana Iyer", checkIn: "2026-04-17T08:00:00.000Z", checkOut: null, status: "PRESENT", leaveType: null },
  { id: "att-2", staffName: "Nisha Varma", checkIn: "2026-04-17T07:45:00.000Z", checkOut: "2026-04-17T16:00:00.000Z", status: "PRESENT", leaveType: null },
  { id: "att-3", staffName: "Imran Khan", checkIn: "2026-04-16T09:00:00.000Z", checkOut: null, status: "LEAVE", leaveType: "Sick" },
];

const payrollFallbacks: PayrollRow[] = [
  { id: "payroll-1", staffName: "Dr. Sana Iyer", baseSalary: 120000, overtimePay: 18000, deductions: 8000, netPay: 130000 },
  { id: "payroll-2", staffName: "Nisha Varma", baseSalary: 52000, overtimePay: 6000, deductions: 2000, netPay: 56000 },
  { id: "payroll-3", staffName: "Imran Khan", baseSalary: 45000, overtimePay: 2500, deductions: 1500, netPay: 46000 },
];

const credentialFallbacks: CredentialRow[] = [
  { id: "cred-1", staffName: "Dr. Sana Iyer", licenseNumber: "MCI-1122", specialty: "Internal Medicine", renewalDate: "2026-12-01", status: "VALID" },
  { id: "cred-2", staffName: "Nisha Varma", licenseNumber: "NUR-3344", specialty: "ICU Nursing", renewalDate: "2026-08-15", status: "RENEW SOON" },
  { id: "cred-3", staffName: "Imran Khan", licenseNumber: "FIN-2211", specialty: "Billing", renewalDate: "2027-01-10", status: "VALID" },
];

const performanceFallbacks: PerformanceRow[] = [
  { id: "perf-1", staffName: "Dr. Sana Iyer", score: 92, satisfaction: 96, caseload: 34, status: "EXCELLENT" },
  { id: "perf-2", staffName: "Nisha Varma", score: 88, satisfaction: 94, caseload: 58, status: "STRONG" },
  { id: "perf-3", staffName: "Imran Khan", score: 81, satisfaction: 89, caseload: 22, status: "STABLE" },
];

const trainingFallbacks: TrainingRow[] = [
  { id: "train-1", staffName: "Dr. Sana Iyer", course: "Fire Safety", completion: 100, dueDate: "2026-12-31", status: "COMPLETED" },
  { id: "train-2", staffName: "Nisha Varma", course: "BLS Refresher", completion: 70, dueDate: "2026-06-30", status: "IN PROGRESS" },
  { id: "train-3", staffName: "Imran Khan", course: "DPDP Basics", completion: 100, dueDate: "2026-11-30", status: "COMPLETED" },
];

const vendorFallbacks: VendorRow[] = [
  { id: "ven-1", vendorName: "MedSupply Co", contact: "+91-9900011122", service: "Consumables", status: "ACTIVE" },
  { id: "ven-2", vendorName: "BioCal Labs", contact: "+91-9900013344", service: "Calibration", status: "ACTIVE" },
  { id: "ven-3", vendorName: "CleanPro Services", contact: "+91-9900015566", service: "Housekeeping", status: "PENDING" },
];

const inventoryFallbacks: InventoryRow[] = [
  { id: "inv-item-1", sku: "SKU-001", name: "Syringe 10ml", category: "General", stockOnHand: 420, reorderLevel: 150, expiryDate: null },
  { id: "inv-item-2", sku: "SKU-002", name: "Paracetamol 500mg", category: "Pharmacy", stockOnHand: 2600, reorderLevel: 800, expiryDate: "2026-10-01" },
  { id: "inv-item-3", sku: "SKU-003", name: "Gloves Large", category: "Consumables", stockOnHand: 140, reorderLevel: 120, expiryDate: null },
  { id: "inv-item-4", sku: "SKU-004", name: "Amoxicillin 625mg", category: "Pharmacy", stockOnHand: 920, reorderLevel: 500, expiryDate: "2026-12-20" },
  { id: "inv-item-5", sku: "SKU-005", name: "Insulin Glargine Pen", category: "Pharmacy", stockOnHand: 180, reorderLevel: 160, expiryDate: "2026-09-05" },
  { id: "inv-item-6", sku: "SKU-006", name: "Atorvastatin 20mg", category: "Pharmacy", stockOnHand: 340, reorderLevel: 220, expiryDate: "2027-01-15" },
  { id: "inv-item-7", sku: "SKU-007", name: "Omeprazole 20mg", category: "Pharmacy", stockOnHand: 610, reorderLevel: 280, expiryDate: "2026-11-11" },
  { id: "inv-item-8", sku: "SKU-008", name: "Salbutamol Inhaler", category: "Pharmacy", stockOnHand: 130, reorderLevel: 120, expiryDate: "2026-08-28" },
  { id: "inv-item-9", sku: "SKU-009", name: "Heparin 5000 IU", category: "Pharmacy", stockOnHand: 86, reorderLevel: 100, expiryDate: "2026-10-18" },
  { id: "inv-item-10", sku: "SKU-010", name: "Metformin 500mg", category: "Pharmacy", stockOnHand: 1750, reorderLevel: 900, expiryDate: "2027-03-01" },
  { id: "inv-item-11", sku: "SKU-011", name: "Surgical Mask N95", category: "Consumables", stockOnHand: 560, reorderLevel: 300, expiryDate: null },
  { id: "inv-item-12", sku: "SKU-012", name: "IV Cannula 20G", category: "General", stockOnHand: 290, reorderLevel: 180, expiryDate: null },
];

const consignmentFallbacks: ConsignmentRow[] = [
  { id: "con-1", implantName: "Cardiac Stent 3.0", vendorName: "MedSupply Co", lotNo: "LOT-CST-889", quantityAvailable: 12, status: "ON-HAND" },
  { id: "con-2", implantName: "Hip Prosthesis Set", vendorName: "Ortho Life", lotNo: "LOT-HIP-221", quantityAvailable: 5, status: "RESERVED" },
  { id: "con-3", implantName: "Spinal Cage", vendorName: "NeuroEquip", lotNo: "LOT-SPN-114", quantityAvailable: 3, status: "LOW" },
];

const purchaseOrderFallbacks: PurchaseOrderRow[] = [
  { id: "po-1", poNo: "PO-2026-410", vendorName: "MedSupply Co", itemCount: 16, totalAmount: 182500, status: "APPROVAL PENDING", expectedDate: "2026-04-21" },
  { id: "po-2", poNo: "PO-2026-411", vendorName: "BioCal Labs", itemCount: 4, totalAmount: 64000, status: "GRN PENDING", expectedDate: "2026-04-19" },
  { id: "po-3", poNo: "PO-2026-405", vendorName: "CleanPro Services", itemCount: 9, totalAmount: 44500, status: "CLOSED", expectedDate: "2026-04-12" },
];

const linenFallbacks: LinenRow[] = [
  { id: "lin-1", ward: "ICU", issued: 120, returned: 110, pending: 10, turnAroundHours: 4.5 },
  { id: "lin-2", ward: "General Ward", issued: 300, returned: 281, pending: 19, turnAroundHours: 6.2 },
  { id: "lin-3", ward: "OT Complex", issued: 88, returned: 84, pending: 4, turnAroundHours: 3.1 },
];

const equipmentFallbacks: EquipmentRow[] = [
  { id: "eq-1", name: "MRI Scanner", serial: "EQ-1001", status: "OPERATIONAL", amcStatus: "ACTIVE" },
  { id: "eq-2", name: "X-Ray Unit", serial: "EQ-1002", status: "CALIBRATION DUE", amcStatus: "ACTIVE" },
  { id: "eq-3", name: "Ventilator", serial: "EQ-1003", status: "OPERATIONAL", amcStatus: "ACTIVE" },
];

const scheduleFallbacks: MaintenanceScheduleRow[] = [
  { id: "sch-1", equipmentName: "MRI Scanner", task: "Quarterly service", dueDate: "2026-05-01", status: "SCHEDULED" },
  { id: "sch-2", equipmentName: "X-Ray Unit", task: "Battery check", dueDate: "2026-04-21", status: "DUE SOON" },
  { id: "sch-3", equipmentName: "Ventilator", task: "Filter replacement", dueDate: "2026-04-30", status: "SCHEDULED" },
];

const ticketFallbacks: MaintenanceTicketRow[] = [
  { id: "tic-1", ticketNo: "TKT-1001", equipmentName: "X-Ray Unit", issue: "Image calibration drift", status: "OPEN", priority: "HIGH" },
  { id: "tic-2", ticketNo: "TKT-1002", equipmentName: "Ventilator", issue: "Alarm test failed", status: "IN PROGRESS", priority: "MEDIUM" },
];

const calibrationFallbacks: CalibrationRow[] = [
  { id: "cal-1", equipmentName: "MRI Scanner", performedAt: "2026-04-10T10:00:00.000Z", nextDue: "2026-07-10", status: "PASS" },
  { id: "cal-2", equipmentName: "X-Ray Unit", performedAt: "2026-03-30T09:30:00.000Z", nextDue: "2026-06-30", status: "DUE SOON" },
];

const housekeepingFallbacks: HousekeepingRow[] = [
  { id: "hk-1", room: "ICU-01", assignee: "Team A", status: "CLEANING", dueAt: "2026-04-17T12:00:00.000Z" },
  { id: "hk-2", room: "GW-12", assignee: "Team B", status: "READY", dueAt: "2026-04-17T10:30:00.000Z" },
  { id: "hk-3", room: "OT-03", assignee: "Team C", status: "INSPECT", dueAt: "2026-04-17T11:00:00.000Z" },
];

const inspectionFallbacks: InspectionRow[] = [
  { id: "insp-1", area: "Emergency Ward", inspector: "Facility Lead", status: "SCHEDULED", scheduledAt: "2026-04-18T09:00:00.000Z" },
  { id: "insp-2", area: "ICU", inspector: "BioMed Engineer", status: "COMPLETED", scheduledAt: "2026-04-15T14:00:00.000Z" },
];

const auditFallbacks: AuditRow[] = [
  { id: "audit-1", actorName: "Aarav Menon", action: "LOGIN", resource: "auth", resourceId: null, createdAt: "2026-04-16T09:01:00.000Z" },
  { id: "audit-2", actorName: "Dr. Sana Iyer", action: "UPDATE", resource: "clinical-note", resourceId: "enc-1", createdAt: "2026-04-16T09:44:00.000Z" },
  { id: "audit-3", actorName: "Imran Khan", action: "CREATE", resource: "invoice", resourceId: "inv-2", createdAt: "2026-04-16T11:20:00.000Z" },
];

const commandCenterAlertFallbacks: CommandCenterAlertRow[] = [
  {
    id: "cc-alert-1",
    severity: "CRITICAL",
    module: "Lab",
    title: "Critical potassium result pending acknowledgement",
    detail: "1 patient with high-risk value not yet acknowledged by care team.",
    ageMinutes: 18,
    routePath: "/lab/results",
  },
  {
    id: "cc-alert-2",
    severity: "HIGH",
    module: "Ward",
    title: "Discharge summary pending beyond SLA",
    detail: "3 discharge-ready patients are waiting documentation sign-off.",
    ageMinutes: 46,
    routePath: "/ward/admissions",
  },
  {
    id: "cc-alert-3",
    severity: "HIGH",
    module: "Billing",
    title: "Same-day discharge billing blockers",
    detail: "2 invoices missing consumable charge lines.",
    ageMinutes: 31,
    routePath: "/billing/analytics",
  },
  {
    id: "cc-alert-4",
    severity: "MEDIUM",
    module: "Emergency",
    title: "Ambulances en route",
    detail: "2 emergency arrivals expected within 20 minutes.",
    ageMinutes: 9,
    routePath: "/emergency",
  },
];

const taskOrchestrationFallbacks: OrchestratedTaskRow[] = [
  {
    id: "task-1",
    sourceEvent: "LAB_RESULT_ABNORMAL",
    module: "Lab",
    title: "Acknowledge and sign critical electrolyte result",
    assigneeRole: "DOCTOR",
    status: "OPEN",
    slaDueAt: "2026-04-17T09:30:00.000Z",
    createdAt: "2026-04-17T09:00:00.000Z",
  },
  {
    id: "task-2",
    sourceEvent: "DISCHARGE_BLOCKED",
    module: "Ward",
    title: "Complete discharge summary and nursing closure",
    assigneeRole: "NURSE",
    status: "IN_PROGRESS",
    slaDueAt: "2026-04-17T10:00:00.000Z",
    createdAt: "2026-04-17T08:45:00.000Z",
  },
  {
    id: "task-3",
    sourceEvent: "INVOICE_MISMATCH",
    module: "Billing",
    title: "Resolve invoice variance before patient discharge",
    assigneeRole: "BILLING_STAFF",
    status: "ESCALATED",
    slaDueAt: "2026-04-17T09:15:00.000Z",
    createdAt: "2026-04-17T08:30:00.000Z",
  },
];

const slaSnapshotFallbacks: SlaSnapshotRow[] = [
  { id: "sla-1", process: "Lab TAT", p50Minutes: 42, p90Minutes: 108, breaches24h: 6, updatedAt: "2026-04-17T09:05:00.000Z" },
  { id: "sla-2", process: "Discharge Completion", p50Minutes: 88, p90Minutes: 214, breaches24h: 9, updatedAt: "2026-04-17T09:05:00.000Z" },
  { id: "sla-3", process: "Bed Turnover", p50Minutes: 36, p90Minutes: 92, breaches24h: 4, updatedAt: "2026-04-17T09:05:00.000Z" },
  { id: "sla-4", process: "Pharmacy Dispense", p50Minutes: 14, p90Minutes: 33, breaches24h: 3, updatedAt: "2026-04-17T09:05:00.000Z" },
];

const auditTimelineFallbacks: AuditTimelineRow[] = [
  {
    id: "audit-tl-1",
    actorName: "Dr. Sana Iyer",
    actorRole: "DOCTOR",
    action: "UPDATE",
    resource: "clinical-note",
    resourceId: "enc-1",
    reason: "Added treatment plan after lab review",
    ipAddress: "10.5.23.11",
    createdAt: "2026-04-17T08:50:00.000Z",
  },
  {
    id: "audit-tl-2",
    actorName: "Nisha Varma",
    actorRole: "NURSE",
    action: "APPROVE",
    resource: "mar",
    resourceId: "mar-1",
    reason: "Medication administered and signed",
    ipAddress: "10.5.23.14",
    createdAt: "2026-04-17T08:42:00.000Z",
  },
  {
    id: "audit-tl-3",
    actorName: "Imran Khan",
    actorRole: "BILLING_STAFF",
    action: "UPDATE",
    resource: "invoice",
    resourceId: "inv-1",
    reason: "Added missed consumable charge",
    ipAddress: "10.5.24.33",
    createdAt: "2026-04-17T08:35:00.000Z",
  },
];

const pathwayFallbacks: PathwayRow[] = [
  {
    id: "path-1",
    pathwayName: "Diabetes Continuity Bundle",
    patientName: "Arjun Mehta",
    ownerRole: "DOCTOR",
    adherenceScore: 88,
    overdueSteps: 0,
    status: "ON_TRACK",
    nextActionDue: "2026-04-17T11:30:00.000Z",
  },
  {
    id: "path-2",
    pathwayName: "Sepsis Early Action",
    patientName: "Rakesh Saini",
    ownerRole: "NURSE",
    adherenceScore: 72,
    overdueSteps: 1,
    status: "WATCH",
    nextActionDue: "2026-04-17T10:15:00.000Z",
  },
  {
    id: "path-3",
    pathwayName: "Post-Op Recovery Bundle",
    patientName: "Neha Shah",
    ownerRole: "SURGEON",
    adherenceScore: 61,
    overdueSteps: 2,
    status: "AT_RISK",
    nextActionDue: "2026-04-17T09:45:00.000Z",
  },
];

const revenueLeakageFallbacks: RevenueLeakageRow[] = [
  {
    id: "leak-1",
    encounterId: "enc-91",
    patientName: "Arjun Mehta",
    category: "Missing Charge",
    potentialLeakage: 2200,
    status: "OPEN",
    recommendedAction: "Add consumables line from MAR and verify invoice.",
    detectedAt: "2026-04-17T08:20:00.000Z",
  },
  {
    id: "leak-2",
    encounterId: "enc-92",
    patientName: "Neha Shah",
    category: "Claim Lag",
    potentialLeakage: 5400,
    status: "UNDER_REVIEW",
    recommendedAction: "Submit insurer clarification and attach operative note.",
    detectedAt: "2026-04-17T07:55:00.000Z",
  },
  {
    id: "leak-3",
    encounterId: "enc-93",
    patientName: "Rakesh Saini",
    category: "Coding Mismatch",
    potentialLeakage: 3100,
    status: "RECOVERED",
    recommendedAction: "Correct ICD tag and regenerate package break-up.",
    detectedAt: "2026-04-16T16:40:00.000Z",
  },
];

const playbookFallbacks: PlaybookRuleRow[] = [
  {
    id: "pb-1",
    name: "Critical Lab Escalation 15m",
    trigger: "LAB_RESULT_ABNORMAL",
    condition: "severity=critical and unacknowledged>15m",
    action: "Escalate to duty consultant and ICU nurse",
    isActive: true,
    version: 3,
    updatedAt: "2026-04-17T08:10:00.000Z",
  },
  {
    id: "pb-2",
    name: "Discharge Billing Guardrail",
    trigger: "DISCHARGE_INITIATED",
    condition: "invoice_status!=ready",
    action: "Create billing blocker task and notify floor billing",
    isActive: true,
    version: 2,
    updatedAt: "2026-04-17T07:50:00.000Z",
  },
  {
    id: "pb-3",
    name: "Expiry Watch Auto Task",
    trigger: "INVENTORY_EXPIRY_WINDOW",
    condition: "days_to_expiry<=30 and stock_on_hand>0",
    action: "Assign FEFO transfer task to store manager",
    isActive: false,
    version: 1,
    updatedAt: "2026-04-16T18:00:00.000Z",
  },
];

const journeyScoreFallbacks: JourneyScoreRow[] = [
  {
    id: "journey-1",
    scope: "PATIENT",
    scopeId: "UHID-12091",
    patientName: "Arjun Mehta",
    clinicalSafety: 86,
    serviceTimeliness: 79,
    communication: 82,
    billingFriction: 74,
    compositeScore: 80,
    trend: "UP",
  },
  {
    id: "journey-2",
    scope: "PATIENT",
    scopeId: "UHID-12092",
    patientName: "Neha Shah",
    clinicalSafety: 83,
    serviceTimeliness: 71,
    communication: 78,
    billingFriction: 69,
    compositeScore: 75,
    trend: "STABLE",
  },
  {
    id: "journey-3",
    scope: "DEPARTMENT",
    scopeId: "Medicine",
    patientName: null,
    clinicalSafety: 81,
    serviceTimeliness: 73,
    communication: 77,
    billingFriction: 72,
    compositeScore: 76,
    trend: "DOWN",
  },
];

const riskFlagFallbacks: RiskFlagRow[] = [
  {
    id: "risk-1",
    patientName: "Arjun Mehta",
    riskType: "Sepsis Deterioration",
    severity: "HIGH",
    confidence: 0.84,
    factors: ["Rising lactate", "Tachycardia trend", "Delayed antibiotic dose"],
    recommendation: "Repeat lactate in 1 hour and initiate sepsis bundle reassessment.",
    status: "OPEN",
    reviewedBy: null,
  },
  {
    id: "risk-2",
    patientName: "Neha Shah",
    riskType: "Readmission Risk",
    severity: "MEDIUM",
    confidence: 0.72,
    factors: ["Recent ER revisit", "Polypharmacy", "High symptom burden"],
    recommendation: "Schedule 72-hour follow-up and medication reconciliation call.",
    status: "ACKNOWLEDGED",
    reviewedBy: "Dr. Sana Iyer",
  },
  {
    id: "risk-3",
    patientName: "Rakesh Saini",
    riskType: "AKI Progression",
    severity: "CRITICAL",
    confidence: 0.91,
    factors: ["Creatinine rise", "Low urine output", "Hypotension episode"],
    recommendation: "Escalate nephrology consult and start fluid protocol now.",
    status: "OPEN",
    reviewedBy: null,
  },
];

const accreditationEvidenceFallbacks: AccreditationEvidenceRow[] = [
  {
    id: "acc-1",
    standard: "NABH",
    controlCode: "CQI-4",
    title: "Critical Result Communication Logs",
    owner: "Quality Office",
    status: "READY",
    evidenceCount: 14,
    gapCount: 0,
    lastUpdated: "2026-04-17T08:40:00.000Z",
  },
  {
    id: "acc-2",
    standard: "NABL",
    controlCode: "LAB-7",
    title: "Calibration and Quality Control Records",
    owner: "Lab Quality Lead",
    status: "PARTIAL",
    evidenceCount: 9,
    gapCount: 2,
    lastUpdated: "2026-04-17T08:25:00.000Z",
  },
  {
    id: "acc-3",
    standard: "NABH",
    controlCode: "IMS-2",
    title: "Medication Administration Compliance",
    owner: "Nursing Superintendent",
    status: "GAP",
    evidenceCount: 5,
    gapCount: 4,
    lastUpdated: "2026-04-17T08:15:00.000Z",
  },
];

const portalMessagesFallbacks: PortalMessageRow[] = [
  { id: "msg-1", senderName: "Dr. Rao", senderRole: "Doctor", body: "Continue current medicines and send sugar readings every morning.", isRead: false, createdAt: "2026-04-16T09:00:00.000Z" },
  { id: "msg-2", senderName: "Care Team", senderRole: "Nurse", body: "Follow-up appointment set for tomorrow 10:30 AM.", isRead: true, createdAt: "2026-04-16T10:40:00.000Z" },
];

const healthGoalsFallbacks: HealthGoalRow[] = [
  { id: "goal-1", title: "Morning Sugar Check", target: "< 140 mg/dL", progress: 70, status: "ACTIVE" },
  { id: "goal-2", title: "Daily Walk", target: "30 minutes", progress: 45, status: "ACTIVE" },
];

const prescriptionFallbacks: PrescriptionRow[] = [
  { id: "rx-1", prescriptionNo: "PRX-210", patientName: "Arjun Mehta", status: "Ready", prescribedAt: "2026-04-16T09:15:00.000Z", medicationCount: 3 },
  { id: "rx-2", prescriptionNo: "PRX-211", patientName: "Neha Shah", status: "Dispensed", prescribedAt: "2026-04-16T10:20:00.000Z", medicationCount: 2 },
  { id: "rx-3", prescriptionNo: "PRX-212", patientName: "Rakesh Saini", status: "Pending", prescribedAt: "2026-04-16T12:10:00.000Z", medicationCount: 4 },
];

const formularyFallbacks: FormularyRow[] = [
  {
    id: "for-1",
    drugName: "Amoxicillin + Clavulanate",
    genericName: "Amoxicillin/Clavulanic Acid",
    category: "Antibiotic",
    substitutionPolicy: "Generic Allowed",
    status: "ACTIVE",
  },
  {
    id: "for-2",
    drugName: "Insulin Glargine",
    genericName: "Insulin Glargine",
    category: "Endocrine",
    substitutionPolicy: "Physician Approval",
    status: "ACTIVE",
  },
  {
    id: "for-3",
    drugName: "Diclofenac Injection",
    genericName: "Diclofenac",
    category: "Analgesic",
    substitutionPolicy: "No Substitution",
    status: "RESTRICTED",
  },
];

const controlledSubstanceFallbacks: ControlledSubstanceRow[] = [
  {
    id: "ctrl-1",
    drugName: "Morphine Sulfate 10mg",
    schedule: "Schedule II",
    balanceUnits: 42,
    lastIssuedTo: "ICU - Bed 02",
    lastIssuedAt: "2026-04-16T18:15:00.000Z",
    auditStatus: "RECONCILED",
  },
  {
    id: "ctrl-2",
    drugName: "Fentanyl Patch 25mcg",
    schedule: "Schedule II",
    balanceUnits: 18,
    lastIssuedTo: "Oncology Day Care",
    lastIssuedAt: "2026-04-16T16:05:00.000Z",
    auditStatus: "PENDING REVIEW",
  },
  {
    id: "ctrl-3",
    drugName: "Lorazepam 2mg",
    schedule: "Schedule IV",
    balanceUnits: 76,
    lastIssuedTo: "Emergency",
    lastIssuedAt: "2026-04-16T21:00:00.000Z",
    auditStatus: "RECONCILED",
  },
];

const clinicalNoteFallbacks: ClinicalNoteRow[] = [
  { id: "note-1", encounterType: "OPD", summary: "Stable diabetes follow-up with diet adherence.", createdAt: "2026-04-15T09:05:00.000Z" },
  { id: "note-2", encounterType: "EMERGENCY", summary: "Emergency intake stabilized and moved to ICU observation.", createdAt: "2026-04-12T09:15:00.000Z" },
];

const chronicRegistryFallbacks: ChronicRegistryRow[] = [
  {
    id: "chr-1",
    patientName: "Arjun Mehta",
    condition: "Type 2 Diabetes",
    riskLevel: "MODERATE",
    lastReviewAt: "2026-04-10T10:00:00.000Z",
    nextReviewAt: "2026-05-10T10:00:00.000Z",
  },
  {
    id: "chr-2",
    patientName: "Neha Shah",
    condition: "Bronchial Asthma",
    riskLevel: "LOW",
    lastReviewAt: "2026-04-14T12:00:00.000Z",
    nextReviewAt: "2026-06-14T12:00:00.000Z",
  },
  {
    id: "chr-3",
    patientName: "Rakesh Saini",
    condition: "Chronic Kidney Disease",
    riskLevel: "HIGH",
    lastReviewAt: "2026-04-08T08:30:00.000Z",
    nextReviewAt: "2026-04-22T08:30:00.000Z",
  },
];

const secondOpinionFallbacks: SecondOpinionRow[] = [
  {
    id: "so-1",
    caseNo: "SO-2026-014",
    patientName: "Arjun Mehta",
    specialty: "Endocrinology",
    requestedAt: "2026-04-15T15:20:00.000Z",
    status: "SENT",
  },
  {
    id: "so-2",
    caseNo: "SO-2026-015",
    patientName: "Neha Shah",
    specialty: "Pulmonology",
    requestedAt: "2026-04-16T10:45:00.000Z",
    status: "REVIEWED",
  },
  {
    id: "so-3",
    caseNo: "SO-2026-016",
    patientName: "Rakesh Saini",
    specialty: "Nephrology",
    requestedAt: "2026-04-16T18:10:00.000Z",
    status: "AWAITING RESPONSE",
  },
];

const surgicalNoteFallbacks: SurgicalNoteRow[] = [
  {
    id: "surg-1",
    patientName: "Kiran Rao",
    procedure: "Laparoscopic Cholecystectomy",
    surgeon: "Dr. Ajay Nair",
    phase: "POST-OP",
    noteStatus: "COMPLETED",
    updatedAt: "2026-04-16T14:25:00.000Z",
  },
  {
    id: "surg-2",
    patientName: "Meena Patel",
    procedure: "Total Knee Replacement",
    surgeon: "Dr. Vivek Sharma",
    phase: "INTRA-OP",
    noteStatus: "IN PROGRESS",
    updatedAt: "2026-04-16T11:40:00.000Z",
  },
  {
    id: "surg-3",
    patientName: "Rohit Das",
    procedure: "Appendectomy",
    surgeon: "Dr. Ajay Nair",
    phase: "PRE-OP",
    noteStatus: "PENDING",
    updatedAt: "2026-04-17T07:55:00.000Z",
  },
];

const analyticsFallback: AnalyticsSnapshot = {
  revenue: 840000,
  occupancy: 83,
  aLos: 3.8,
  satisfaction: 91,
  readmissions: 4.2,
  outbreakSignals: 1,
};

const reportTemplateFallbacks: ReportTemplateRow[] = [
  {
    id: "rpt-1",
    name: "Daily Bed Utilization",
    domain: "Operations",
    cadence: "Daily",
    lastRunAt: "2026-04-17T07:00:00.000Z",
    status: "READY",
  },
  {
    id: "rpt-2",
    name: "Weekly Clinical Outcomes",
    domain: "Clinical",
    cadence: "Weekly",
    lastRunAt: "2026-04-15T18:00:00.000Z",
    status: "READY",
  },
  {
    id: "rpt-3",
    name: "Monthly Payer Mix",
    domain: "Finance",
    cadence: "Monthly",
    lastRunAt: "2026-04-01T09:30:00.000Z",
    status: "DRAFT",
  },
];

const clinicalOutcomeFallbacks: ClinicalOutcomeRow[] = [
  { id: "co-1", department: "Medicine", readmissionRate: 5.1, complicationRate: 1.8, mortalityRate: 0.9, avgLengthOfStay: 3.6 },
  { id: "co-2", department: "Surgery", readmissionRate: 4.3, complicationRate: 2.6, mortalityRate: 1.2, avgLengthOfStay: 4.1 },
  { id: "co-3", department: "ICU", readmissionRate: 6.4, complicationRate: 3.1, mortalityRate: 1.8, avgLengthOfStay: 5.3 },
];

const epidemiologySignalFallbacks: EpidemiologySignalRow[] = [
  { id: "epi-1", syndrome: "Acute Respiratory Illness", unit: "Emergency", cases7d: 19, baseline: 12, riskLevel: "WATCH" },
  { id: "epi-2", syndrome: "Dengue-like Fever", unit: "General Ward", cases7d: 8, baseline: 7, riskLevel: "STABLE" },
  { id: "epi-3", syndrome: "GI Infection", unit: "Pediatrics", cases7d: 11, baseline: 6, riskLevel: "ALERT" },
];

const financeMetricFallbacks: FinanceMetricRow[] = [
  { id: "fin-1", department: "Cardiology", revenue: 1420000, cost: 980000, margin: 440000, collectionRate: 0.86 },
  { id: "fin-2", department: "Orthopedics", revenue: 1090000, cost: 790000, margin: 300000, collectionRate: 0.81 },
  { id: "fin-3", department: "Oncology", revenue: 1280000, cost: 1010000, margin: 270000, collectionRate: 0.78 },
];

const regulatoryReportFallbacks: RegulatoryReportRow[] = [
  {
    id: "reg-1",
    reportName: "NABH Quality Indicator Pack",
    authority: "NABH",
    dueDate: "2026-04-25",
    owner: "Quality Office",
    status: "IN PROGRESS",
  },
  {
    id: "reg-2",
    reportName: "Biomedical Waste Return",
    authority: "State PCB",
    dueDate: "2026-04-20",
    owner: "Operations",
    status: "READY FOR REVIEW",
  },
  {
    id: "reg-3",
    reportName: "HAI Surveillance Summary",
    authority: "Hospital Board",
    dueDate: "2026-04-30",
    owner: "Infection Control",
    status: "DRAFT",
  },
];

const satisfactionMetricFallbacks: SatisfactionMetricRow[] = [
  { id: "sat-1", touchpoint: "OPD Registration", nps: 62, csat: 88, complaints: 5, trend: "UP" },
  { id: "sat-2", touchpoint: "IPD Nursing", nps: 58, csat: 86, complaints: 9, trend: "STABLE" },
  { id: "sat-3", touchpoint: "Billing & Discharge", nps: 49, csat: 79, complaints: 14, trend: "DOWN" },
];

const settingUserFallbacks: SettingUserRow[] = [
  {
    id: "set-user-1",
    fullName: "Dr. Sana Iyer",
    role: "DOCTOR",
    department: "Medicine",
    accountStatus: "ACTIVE",
    lastSeenAt: "2026-04-17T08:40:00.000Z",
  },
  {
    id: "set-user-2",
    fullName: "Nisha Varma",
    role: "NURSE",
    department: "ICU",
    accountStatus: "ACTIVE",
    lastSeenAt: "2026-04-17T07:55:00.000Z",
  },
  {
    id: "set-user-3",
    fullName: "Imran Khan",
    role: "BILLING_STAFF",
    department: "Finance",
    accountStatus: "PENDING MFA",
    lastSeenAt: "2026-04-16T19:05:00.000Z",
  },
];

const notificationRuleFallbacks: NotificationRuleRow[] = [
  { id: "notif-1", trigger: "Appointment Confirmation", channel: "SMS", recipientGroup: "Patients", slaMinutes: 2, enabled: true },
  { id: "notif-2", trigger: "Critical Lab Result", channel: "WhatsApp", recipientGroup: "On-call Clinicians", slaMinutes: 5, enabled: true },
  { id: "notif-3", trigger: "Discharge Billing Ready", channel: "Email", recipientGroup: "Billing & Frontdesk", slaMinutes: 10, enabled: false },
];

const integrationFallbacks: IntegrationStatusRow[] = [
  {
    id: "int-1",
    integration: "ABDM Gateway",
    endpoint: "abdm.vektorcore.local",
    mode: "Production",
    status: "HEALTHY",
    lastSyncAt: "2026-04-17T08:35:00.000Z",
  },
  {
    id: "int-2",
    integration: "LIS Connector",
    endpoint: "lis.vektorcore.local",
    mode: "Production",
    status: "DEGRADED",
    lastSyncAt: "2026-04-17T08:20:00.000Z",
  },
  {
    id: "int-3",
    integration: "Payment Gateway",
    endpoint: "pay.vektorcore.local",
    mode: "Sandbox",
    status: "HEALTHY",
    lastSyncAt: "2026-04-17T08:42:00.000Z",
  },
];

const hospitalProfileFallback: HospitalProfileRow = {
  id: "hospital-1",
  hospitalName: "Vektor Core Multi-Specialty Hospital",
  licenseNo: "KA-HSP-2026-1182",
  gstin: "29AAECV1234B1Z2",
  nablStatus: "Active",
  nabhStatus: "Pre-Accredited",
  registeredAddress: "100 Health Tech Avenue, Bengaluru, Karnataka 560001",
};

const billingAnalyticsFallback: BillingAnalyticsSnapshot = {
  outstanding: 129300,
  denialRate: 0.12,
  collectionRate: 0.82,
  refundPipeline: 1800,
  paymentsToday: 3,
};

function includesText(value: string | null | undefined, search: string) {
  return (value || "").toLowerCase().includes(search.toLowerCase());
}

function filterPatients(search?: string) {
  if (!search) {
    return patientFallbacks;
  }

  return patientFallbacks.filter(
    (patient) =>
      includesText(patient.uhid, search) ||
      includesText(patient.fullName, search) ||
      includesText(patient.phone, search) ||
      includesText(patient.primaryCondition, search),
  );
}

function filterAppointments(search?: string) {
  if (!search) {
    return appointmentFallbacks;
  }

  return appointmentFallbacks.filter(
    (appointment) =>
      includesText(appointment.patientName, search) ||
      includesText(appointment.doctorName, search) ||
      includesText(appointment.status, search) ||
      includesText(appointment.type, search),
  );
}

export async function getDashboardSnapshot() {
  if (isDatabaseConfigured) {
    const [patients, appointments, invoices, labOrders] = await Promise.all([
      prisma.patient.count(),
      prisma.appointment.count(),
      prisma.billingInvoice.count({ where: { status: { in: ["PENDING", "OVERDUE"] } } }),
      prisma.labOrder.count({ where: { status: { in: ["ORDERED", "PROCESSING"] } } }),
    ]);

    return {
      kpis: {
        patients: patients || patientFallbacks.length,
        appointments: appointments || appointmentFallbacks.length,
        revenueToday: 840000,
        pendingClaims: invoices || billingFallbacks.filter((row) => !includesText(row.status, "paid")).length,
        abnormalLabs: labOrders || 5,
      },
    };
  }

  return {
    kpis: {
      patients: patientFallbacks.length,
      appointments: appointmentFallbacks.length,
      revenueToday: 840000,
      pendingClaims: 39,
      abnormalLabs: 5,
    },
  };
}

export async function listPatients(search?: string): Promise<PatientRow[]> {
  if (isDatabaseConfigured) {
    const where: Prisma.PatientWhereInput | undefined = search
      ? {
          OR: [
            { uhid: { contains: search, mode: "insensitive" } },
            { fullName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { aadhaar: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined;

    const rows = await prisma.patient.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        hospital: true,
        encounters: { orderBy: { startedAt: "desc" }, take: 1 },
      },
    });

    return demoRows(
      rows.map((row) => ({
      id: row.id,
      uhid: row.uhid,
      fullName: row.fullName,
      phone: row.phone,
      gender: row.gender,
      age: row.dateOfBirth ? Math.floor((Date.now() - row.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0,
      primaryCondition: row.encounters[0]?.type || "General follow-up",
      lastVisit: row.encounters[0]?.startedAt.toISOString().slice(0, 10) || row.updatedAt.toISOString().slice(0, 10),
      hospitalName: row.hospital.name,
      })),
      patientFallbacks,
    );
  }

  return filterPatients(search);
}

export async function getPatientByUhid(uhid: string): Promise<PatientDetailRecord | null> {
  if (isDatabaseConfigured) {
    const patient = await prisma.patient.findUnique({
      where: { uhid },
      include: {
        hospital: true,
        familyMembers: true,
        documents: true,
        consents: true,
        abhaLink: true,
        healthGoals: true,
        portalMessages: { orderBy: { createdAt: "desc" }, take: 5 },
        encounters: {
          orderBy: { startedAt: "desc" },
          include: {
            clinicalNotes: true,
            vitals: { orderBy: { recordedAt: "desc" }, take: 5 },
            labOrders: { include: { results: true }, orderBy: { orderedAt: "desc" } },
            prescriptions: { include: { medications: true }, orderBy: { prescribedAt: "desc" } },
            billingInvoice: { include: { payments: true, claims: true } },
            admission: { include: { bed: true } },
          },
        },
      },
    });

    if (!patient) {
      return {
        patient: patientFallbacks.find((entry) => entry.uhid === uhid) ?? patientFallbacks[0],
        familyMembers: [
          { id: "fam-1", fullName: "Priya Mehta", relation: "Spouse", phone: "+91-9820001155", dateOfBirth: new Date("1990-01-01T00:00:00.000Z"), conditions: ["Hypertension"], isEmergency: true },
          { id: "fam-2", fullName: "Riya Mehta", relation: "Daughter", phone: "+91-9820001166", dateOfBirth: new Date("2012-01-01T00:00:00.000Z"), conditions: [], isEmergency: false },
        ],
        documents: [
          { id: "doc-1", title: "Discharge Summary", documentType: "PDF", fileUrl: null, ocrText: "Discharge summary OCR text sample", createdAt: new Date("2026-04-10T00:00:00.000Z") },
          { id: "doc-2", title: "Lab Report CBC", documentType: "PDF", fileUrl: null, ocrText: "CBC report OCR text sample", createdAt: new Date("2026-04-12T00:00:00.000Z") },
        ],
        consents: [
          { id: "con-1", consentType: "Treatment Consent", status: "SIGNED", signedBy: "Arjun Mehta", signedAt: new Date("2026-04-15T08:00:00.000Z"), metadata: { channel: "web" } },
        ],
        abhaLink: { id: "abha-1", abhaAddress: `${uhid.toLowerCase()}@abdm`, healthId: "ABHA-1234-5678", status: "LINKED", linkedAt: new Date("2026-04-11T00:00:00.000Z") },
        healthGoals: healthGoalsFallbacks,
        portalMessages: portalMessagesFallbacks,
        encounters: [
          { id: "enc-1", startedAt: new Date("2026-04-15T09:00:00.000Z"), type: "OPD", notes: "Stable follow-up" },
          { id: "enc-2", startedAt: new Date("2026-04-12T09:00:00.000Z"), type: "EMERGENCY", notes: "ER stabilization" },
        ],
      };
    }

    return {
      patient: {
        id: patient.id,
        fullName: patient.fullName,
        uhid: patient.uhid,
        phone: patient.phone,
        gender: patient.gender,
        age: patient.dateOfBirth ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0,
        hospitalName: patient.hospital.name,
        hospital: { name: patient.hospital.name },
      },
      familyMembers: patient.familyMembers.map((member) => ({
        id: member.id,
        fullName: member.fullName,
        relation: member.relation,
        phone: member.phone,
        dateOfBirth: member.dateOfBirth,
        conditions: member.conditions,
        isEmergency: member.isEmergency,
      })),
      documents: patient.documents.map((document) => ({
        id: document.id,
        title: document.title,
        documentType: document.documentType,
        fileUrl: document.fileUrl,
        ocrText: document.ocrText,
        createdAt: document.createdAt,
      })),
      consents: patient.consents.map((consent) => ({
        id: consent.id,
        consentType: consent.consentType,
        status: consent.status,
        signedBy: consent.signedBy,
        signedAt: consent.signedAt,
        metadata: consent.metadata,
      })),
      abhaLink: patient.abhaLink
        ? {
            id: patient.abhaLink.id,
            abhaAddress: patient.abhaLink.abhaAddress,
            healthId: patient.abhaLink.healthId,
            status: patient.abhaLink.status,
            linkedAt: patient.abhaLink.linkedAt,
          }
        : null,
      healthGoals: patient.healthGoals.map((goal) => ({
        id: goal.id,
        title: goal.title,
        target: goal.target,
        progress: goal.progress,
        status: goal.status,
      })),
      portalMessages: patient.portalMessages.map((message) => ({
        id: message.id,
        senderName: message.senderName,
        senderRole: message.senderRole,
        body: message.body,
        isRead: message.isRead,
        createdAt: message.createdAt.toISOString(),
      })),
      encounters: patient.encounters.map((encounter) => ({
        id: encounter.id,
        type: encounter.type,
        startedAt: encounter.startedAt.toISOString(),
        notes: encounter.clinicalNotes[0]?.summary || encounter.clinicalNotes[0]?.noteType || "",
        vitals: encounter.vitals.map((vital) => ({
          heartRate: vital.heartRate,
          spo2: vital.spo2,
          bloodPressure: vital.bloodPressure,
          temperature: vital.temperature,
        })),
        labOrders: encounter.labOrders.map((order) => ({
          id: order.id,
          testCode: order.testCode,
          status: order.status,
          results: order.results,
        })),
        prescriptions: encounter.prescriptions.map((prescription) => ({
          id: prescription.id,
          status: prescription.status,
          notes: prescription.notes,
          medications: prescription.medications,
        })),
        billingInvoice: encounter.billingInvoice
          ? {
              invoiceNo: encounter.billingInvoice.invoiceNo,
              status: encounter.billingInvoice.status,
              totalAmount: Number(encounter.billingInvoice.totalAmount),
            }
          : null,
        admission: encounter.admission
          ? {
              status: encounter.admission.status,
              bed: {
                ward: encounter.admission.bed.ward,
                bedCode: encounter.admission.bed.bedCode,
                status: encounter.admission.bed.status,
              },
            }
          : null,
      })),
    };
  }

  return {
    patient: patientFallbacks.find((entry) => entry.uhid === uhid) ?? patientFallbacks[0],
    familyMembers: [
      { id: "fam-1", fullName: "Priya Mehta", relation: "Spouse", phone: "+91-9820001155", dateOfBirth: new Date("1990-01-01T00:00:00.000Z"), conditions: ["Hypertension"], isEmergency: true },
      { id: "fam-2", fullName: "Riya Mehta", relation: "Daughter", phone: "+91-9820001166", dateOfBirth: new Date("2012-01-01T00:00:00.000Z"), conditions: [], isEmergency: false },
    ],
    documents: [
      { id: "doc-1", title: "Discharge Summary", documentType: "PDF", fileUrl: null, ocrText: "Discharge summary OCR text sample", createdAt: new Date("2026-04-10T00:00:00.000Z") },
      { id: "doc-2", title: "Lab Report CBC", documentType: "PDF", fileUrl: null, ocrText: "CBC report OCR text sample", createdAt: new Date("2026-04-12T00:00:00.000Z") },
    ],
    consents: [
      { id: "con-1", consentType: "Treatment Consent", status: "SIGNED", signedBy: "Arjun Mehta", signedAt: new Date("2026-04-15T08:00:00.000Z"), metadata: { channel: "web" } },
    ],
    abhaLink: { id: "abha-1", abhaAddress: `${uhid.toLowerCase()}@abdm`, healthId: "ABHA-1234-5678", status: "LINKED", linkedAt: new Date("2026-04-11T00:00:00.000Z") },
    healthGoals: healthGoalsFallbacks,
    portalMessages: portalMessagesFallbacks,
    encounters: [
      { id: "enc-1", startedAt: new Date("2026-04-15T09:00:00.000Z"), type: "OPD", notes: "Stable follow-up" },
      { id: "enc-2", startedAt: new Date("2026-04-12T09:00:00.000Z"), type: "EMERGENCY", notes: "ER stabilization" },
    ],
  };
}

export async function listAppointments(search?: string) {
  if (isDatabaseConfigured) {
    const rows = await prisma.appointment.findMany({
      where: search
        ? {
            OR: [
              { reason: { contains: search, mode: "insensitive" } },
              { patient: { fullName: { contains: search, mode: "insensitive" } } },
            ],
          }
        : undefined,
      orderBy: { startsAt: "asc" },
      include: { patient: true },
    });

    return demoRows(
      rows.map((row) => ({
      id: row.id,
      patientName: row.patient.fullName,
      doctorName: row.doctorUserId,
      startsAt: row.startsAt.toISOString(),
      status: row.status,
      type: row.type,
      location: row.hospitalId,
      })),
      appointmentFallbacks,
    );
  }

  return filterAppointments(search);
}

export async function getAppointmentById(appointmentId: string) {
  if (isDatabaseConfigured) {
    const row = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { patient: true },
    });

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      patientName: row.patient.fullName,
      doctorName: row.doctorUserId,
      startsAt: row.startsAt.toISOString(),
      status: row.status,
      type: row.type,
      location: row.hospitalId,
    };
  }

  return appointmentFallbacks.find((row) => row.id === appointmentId) ?? appointmentFallbacks[0] ?? null;
}

export async function listAppointmentQueue(): Promise<AppointmentQueueRow[]> {
  const rows = await listAppointments();

  return rows
    .filter((row) => ["BOOKED", "CHECKED_IN", "IN_PROGRESS"].includes((row.status || "").toUpperCase()))
    .map((row, index) => ({
      id: row.id,
      token: `A-${String(index + 101).padStart(3, "0")}`,
      patientName: row.patientName,
      doctorName: row.doctorName,
      status: row.status,
      waitingMinutes: (index + 1) * 7,
    }));
}

export async function listPatientAppointments(patientUhid: string) {
  if (isDatabaseConfigured) {
    const patient = await prisma.patient.findUnique({
      where: { uhid: patientUhid },
      select: { id: true },
    });

    if (!patient) {
      return [];
    }

    const rows = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      orderBy: { startsAt: "asc" },
      include: { patient: true },
    });

    return demoRows(rows.map((row) => ({
      id: row.id,
      patientName: row.patient.fullName,
      doctorName: row.doctorUserId,
      startsAt: row.startsAt.toISOString(),
      status: row.status,
      type: row.type,
      location: row.hospitalId,
    })), appointmentFallbacks);
  }

  return appointmentFallbacks.filter((entry) =>
    patientUhid === "UHID-12091"
      ? entry.patientName === "Arjun Mehta"
      : patientUhid === "UHID-12092"
        ? entry.patientName === "Neha Shah"
        : true,
  );
}

export async function listBillingInvoices() {
  if (isDatabaseConfigured) {
    const rows = await prisma.billingInvoice.findMany({
      orderBy: { issuedAt: "desc" },
      include: { encounter: { include: { patient: true } } },
    });

    return demoRows(rows.map((row) => ({
      id: row.id,
      invoiceNo: row.invoiceNo,
      patientName: row.encounter.patient.fullName,
      totalAmount: Number(row.totalAmount),
      status: row.status,
      issuedAt: row.issuedAt.toISOString(),
    })), billingFallbacks);
  }

  return billingFallbacks;
}

export async function listBillingClaims() {
  if (isDatabaseConfigured) {
    const rows = await prisma.insuranceClaim.findMany({
      orderBy: { id: "desc" },
      include: { invoice: { include: { encounter: { include: { patient: true } } } } },
    });

    return demoRows(rows.map((row) => ({
      id: row.id,
      invoiceNo: row.invoice.invoiceNo,
      patientName: row.invoice.encounter.patient.fullName,
      payerName: row.payerName || "Insurer",
      claimAmount: Number(row.approvedAmount ?? row.invoice.totalAmount),
      status: row.status || "SUBMITTED",
      submittedAt: row.invoice.issuedAt.toISOString(),
    })), billingClaimFallbacks);
  }

  return billingClaimFallbacks;
}

export async function listPreauthRequests() {
  return preauthFallbacks;
}

export async function listPaymentLedger() {
  if (isDatabaseConfigured) {
    const rows = await prisma.payment.findMany({
      orderBy: { paidAt: "desc" },
      include: { invoice: { include: { encounter: { include: { patient: true } } } } },
    });

    return demoRows(rows.map((row) => ({
      id: row.id,
      invoiceNo: row.invoice.invoiceNo,
      patientName: row.invoice.encounter.patient.fullName,
      method: row.method || "Cash",
      amount: Number(row.amount),
      status: Number(row.amount) >= Number(row.invoice.totalAmount) ? "SETTLED" : "PARTIAL",
      paidAt: row.paidAt.toISOString(),
    })), paymentFallbacks);
  }

  return paymentFallbacks;
}

export async function listRefundRequests() {
  return refundFallbacks;
}

export async function listCreditAccounts() {
  return creditFallbacks;
}

export async function listBillingPackages() {
  return packageFallbacks;
}

export async function getBillingAnalyticsSnapshot(): Promise<BillingAnalyticsSnapshot> {
  if (isDatabaseConfigured) {
    const [invoices, claims, payments] = await Promise.all([
      prisma.billingInvoice.findMany({ select: { totalAmount: true, status: true } }),
      prisma.insuranceClaim.findMany({ select: { status: true, approvedAmount: true } }),
      prisma.payment.findMany({ select: { amount: true } }),
    ]);

    const outstanding = invoices
      .filter((invoice) => invoice.status !== "PAID")
      .reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
    const denied = claims.filter((claim) => (claim.status || "").toUpperCase() === "DENIED").length;
    const approved = claims.filter((claim) => (claim.status || "").toUpperCase() === "APPROVED").length;
    const collectionRate = claims.length ? approved / claims.length : 0;

    return {
      outstanding: outstanding || billingFallbacks.filter((invoice) => !includesText(invoice.status, "paid")).reduce((sum, invoice) => sum + invoice.totalAmount, 0),
      denialRate: claims.length ? denied / claims.length : 0.25,
      collectionRate: collectionRate || 0.68,
      refundPipeline: 1800,
      paymentsToday: payments.length || paymentFallbacks.length,
    };
  }

  return billingAnalyticsFallback;
}

export async function listPatientInvoices(patientUhid: string) {
  if (isDatabaseConfigured) {
    const patient = await prisma.patient.findUnique({
      where: { uhid: patientUhid },
      select: { id: true },
    });

    if (!patient) {
      return [];
    }

    const rows = await prisma.billingInvoice.findMany({
      where: { encounter: { patientId: patient.id } },
      orderBy: { issuedAt: "desc" },
      include: { encounter: { include: { patient: true } } },
    });

    return rows.map((row) => ({
      id: row.id,
      invoiceNo: row.invoiceNo,
      patientName: row.encounter.patient.fullName,
      totalAmount: Number(row.totalAmount),
      status: row.status,
      issuedAt: row.issuedAt.toISOString(),
    }));
  }

  return billingFallbacks.filter((entry) =>
    patientUhid === "UHID-12091"
      ? entry.patientName === "Arjun Mehta"
      : patientUhid === "UHID-12092"
        ? entry.patientName === "Neha Shah"
        : true,
  );
}

export async function listLabOrders() {
  if (isDatabaseConfigured) {
    const rows = await prisma.labOrder.findMany({
      orderBy: { orderedAt: "desc" },
      include: { encounter: { include: { patient: true } }, results: true },
    });

    return demoRows(rows.map((row) => ({
      id: row.id,
      testCode: row.testCode,
      patientName: row.encounter.patient.fullName,
      status: row.status,
      priority: row.priority,
      orderedAt: row.orderedAt.toISOString(),
      abnormal: row.results.some((result) => result.isAbnormal),
    })), labFallbacks);
  }

  return labFallbacks;
}

export async function listLabResults() {
  if (isDatabaseConfigured) {
    const rows = await prisma.labResult.findMany({
      orderBy: { resultedAt: "desc" },
      include: { labOrder: { include: { encounter: { include: { patient: true } } } } },
    });

    return demoRows(rows.map((row) => ({
      id: row.id,
      testCode: row.labOrder.testCode,
      patientName: row.labOrder.encounter.patient.fullName,
      value: row.value || "-",
      unit: row.unit || "",
      status: row.isAbnormal ? "ABNORMAL" : "NORMAL",
      resultedAt: row.resultedAt?.toISOString() || row.labOrder.orderedAt.toISOString(),
    })), labResultFallbacks);
  }

  return labResultFallbacks;
}

export async function listSampleTracking() {
  return sampleTrackingFallbacks;
}

export async function listRadiologyCases() {
  return radiologyFallbacks;
}

export async function listHomeCollections() {
  return homeCollectionFallbacks;
}

export async function listPrescriptions() {
  if (isDatabaseConfigured) {
    const rows = await prisma.prescription.findMany({
      orderBy: { prescribedAt: "desc" },
      include: { encounter: { include: { patient: true } }, medications: true },
    });

    return rows.map((row) => ({
      id: row.id,
      prescriptionNo: row.id.slice(0, 8).toUpperCase(),
      patientName: row.encounter.patient.fullName,
      status: row.status,
      prescribedAt: row.prescribedAt.toISOString(),
      medicationCount: row.medications.length,
    }));
  }

  return prescriptionFallbacks;
}

export async function listPharmacyInventory() {
  const rows = await listInventoryItems();

  return rows
    .filter((row) => includesText(row.category, "pharmacy"))
    .map((row) => ({
      id: row.id,
      sku: row.sku,
      name: row.name,
      stockOnHand: row.stockOnHand,
      reorderLevel: row.reorderLevel,
      expiryDate: row.expiryDate,
      stockStatus:
        row.stockOnHand <= row.reorderLevel
          ? "LOW"
          : row.stockOnHand <= row.reorderLevel * 1.3
            ? "WATCH"
            : "HEALTHY",
    }));
}

export async function listFormulary() {
  return formularyFallbacks;
}

export async function listControlledSubstances() {
  return controlledSubstanceFallbacks;
}

export async function listElectronicPrescriptions() {
  const rows = await listPrescriptions();
  return rows.filter((row) => row.status !== "Dispensed");
}

export async function listClinicalNotes() {
  if (isDatabaseConfigured) {
    const rows = await prisma.clinicalNote.findMany({ orderBy: { createdAt: "desc" }, include: { encounter: true } });

    return demoRows(rows.map((row) => ({
      id: row.id,
      encounterType: row.encounter.type,
      summary: row.summary || "Clinical note",
      createdAt: row.createdAt.toISOString(),
    })), clinicalNoteFallbacks);
  }

  return clinicalNoteFallbacks;
}

export async function listChronicRegistry() {
  return chronicRegistryFallbacks;
}

export async function listSecondOpinions() {
  return secondOpinionFallbacks;
}

export async function listSurgicalNotes() {
  return surgicalNoteFallbacks;
}

export async function listWardBeds() {
  if (isDatabaseConfigured) {
    const rows = await prisma.bed.findMany({
      orderBy: { ward: "asc" },
      include: {
        admissions: {
          where: { status: "ADMITTED" },
          include: { patient: true },
          take: 1,
        },
      },
    });

    return demoRows(rows.map((row) => ({
      id: row.id,
      ward: row.ward,
      bedCode: row.bedCode,
      status: row.status,
      patientName: row.admissions[0]?.patient.fullName ?? null,
    })), wardFallbacks);
  }

  return wardFallbacks;
}

export async function listWardAdmissions() {
  if (isDatabaseConfigured) {
    const rows = await prisma.admission.findMany({
      orderBy: { admittedAt: "desc" },
      include: { patient: true, bed: true },
    });

    return demoRows(rows.map((row) => ({
      id: row.id,
      patientName: row.patient.fullName,
      uhid: row.patient.uhid,
      ward: row.bed.ward,
      bedCode: row.bed.bedCode,
      status: row.status,
      admittedAt: row.admittedAt.toISOString(),
    })), wardAdmissionFallbacks);
  }

  return wardAdmissionFallbacks;
}

export async function listWardNursingTasks() {
  if (isDatabaseConfigured) {
    const rows = await prisma.admission.findMany({
      take: 10,
      orderBy: { admittedAt: "desc" },
      include: { patient: true, bed: true },
    });

    return demoRows(rows.map((row, index) => ({
      id: `${row.id}-task-${index}`,
      patientName: row.patient.fullName,
      task: index % 2 === 0 ? "Vitals round" : "Medication reconciliation",
      assignee: index % 2 === 0 ? "Ward Nurse" : "Charge Nurse",
      status: index % 3 === 0 ? "OPEN" : "IN_PROGRESS",
      dueAt: row.admittedAt.toISOString(),
    })), nursingFallbacks);
  }

  return nursingFallbacks;
}

export async function listMedicationAdministrationRecords() {
  return marFallbacks;
}

export async function listDietOrders() {
  return dietFallbacks;
}

export async function listIcuAlerts() {
  return icuFallbacks;
}

export async function listVisitorPasses() {
  return visitorFallbacks;
}

export async function getAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  if (isDatabaseConfigured) {
    const [revenueAggregate, occupancy, readmissions] = await Promise.all([
      prisma.billingInvoice.aggregate({ _sum: { totalAmount: true } }),
      prisma.bed.count({ where: { status: { contains: "Occupied", mode: "insensitive" } } }),
      prisma.encounter.count({ where: { type: "EMERGENCY" } }),
    ]);

    return {
      revenue: Number(revenueAggregate._sum.totalAmount ?? 0) || 840000,
      occupancy: occupancy || 78,
      aLos: 3.8,
      satisfaction: 91,
      readmissions: readmissions || 4,
      outbreakSignals: 1,
    };
  }

  return analyticsFallback;
}

export async function listReportTemplates() {
  return reportTemplateFallbacks;
}

export async function listClinicalOutcomes() {
  return clinicalOutcomeFallbacks;
}

export async function listEpidemiologySignals() {
  return epidemiologySignalFallbacks;
}

export async function listFinanceMetrics() {
  return financeMetricFallbacks;
}

export async function listRegulatoryReports() {
  return regulatoryReportFallbacks;
}

export async function listSatisfactionMetrics() {
  return satisfactionMetricFallbacks;
}

export async function listSettingUsers() {
  const staffRows = await listStaff();

  if (staffRows.length) {
    return staffRows.map((row, index) => ({
      id: row.id,
      fullName: row.fullName,
      role: row.role,
      department: row.department || "General",
      accountStatus: index % 3 === 0 ? "ACTIVE" : index % 3 === 1 ? "PENDING MFA" : "ACTIVE",
      lastSeenAt: new Date(Date.now() - (index + 1) * 1000 * 60 * 22).toISOString(),
    }));
  }

  return settingUserFallbacks;
}

export async function listNotificationRules() {
  return notificationRuleFallbacks;
}

export async function listIntegrationStatuses() {
  return integrationFallbacks;
}

export async function getHospitalProfile() {
  return hospitalProfileFallback;
}

export async function listStaff() {
  if (isDatabaseConfigured) {
    const rows = await prisma.user.findMany({
      orderBy: { fullName: "asc" },
      include: { staffProfile: true },
    });

    return demoRows(rows.map((row) => ({
      id: row.id,
      fullName: row.fullName,
      role: row.role,
      department: row.staffProfile?.department ?? null,
      specialty: row.staffProfile?.specialty ?? null,
      licenseNumber: row.staffProfile?.licenseNumber ?? null,
    })), staffFallbacks);
  }

  return staffFallbacks;
}

export async function listRoster() {
  return rosterFallbacks;
}

export async function listAttendance() {
  return attendanceFallbacks;
}

export async function listPayroll() {
  return payrollFallbacks;
}

export async function listCredentials() {
  return credentialFallbacks;
}

export async function listPerformanceMetrics() {
  return performanceFallbacks;
}

export async function listTrainingRecords() {
  return trainingFallbacks;
}

export async function listVendors() {
  return vendorFallbacks;
}

export async function listEquipment() {
  return equipmentFallbacks;
}

export async function listMaintenanceSchedule() {
  return scheduleFallbacks;
}

export async function listMaintenanceTickets() {
  return ticketFallbacks;
}

export async function listCalibrationLogs() {
  return calibrationFallbacks;
}

export async function listHousekeepingTasks() {
  return housekeepingFallbacks;
}

export async function listInspectionTasks() {
  return inspectionFallbacks;
}

export async function listInventoryItems() {
  if (isDatabaseConfigured) {
    const rows = await prisma.inventoryItem.findMany({ orderBy: { updatedAt: "desc" } });

    return demoRows(rows.map((row) => ({
      id: row.id,
      sku: row.sku,
      name: row.name,
      category: row.category,
      stockOnHand: row.stockOnHand,
      reorderLevel: row.reorderLevel,
      expiryDate: row.expiryDate?.toISOString() ?? null,
    })), inventoryFallbacks);
  }

  return inventoryFallbacks;
}

export async function listConsignmentItems() {
  return consignmentFallbacks;
}

export async function listExpiryWatchlist() {
  const rows = await listInventoryItems();
  const now = new Date();

  return rows
    .filter((row) => row.expiryDate)
    .map((row) => {
      const expiryDate = new Date(row.expiryDate as string);
      const millis = expiryDate.getTime() - now.getTime();
      const daysToExpire = Math.max(0, Math.ceil(millis / (1000 * 60 * 60 * 24)));

      return {
        id: row.id,
        itemName: row.name,
        sku: row.sku,
        expiryDate: row.expiryDate as string,
        daysToExpire,
        stockOnHand: row.stockOnHand,
      };
    })
    .sort((a, b) => a.daysToExpire - b.daysToExpire);
}

export async function listPurchaseOrders() {
  return purchaseOrderFallbacks;
}

export async function listLinenCycles() {
  return linenFallbacks;
}

export async function listAuditLogs() {
  if (isDatabaseConfigured) {
    const rows = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 25 });

    return rows.map((row) => ({
      id: row.id,
      actorName: row.actorName,
      action: row.action,
      resource: row.resource,
      resourceId: row.resourceId,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  return auditFallbacks;
}

export async function getCommandCenterSnapshot(): Promise<CommandCenterSnapshot> {
  const [beds, labs, admissions, invoices] = await Promise.all([
    listWardBeds(),
    listLabResults(),
    listWardAdmissions(),
    listBillingInvoices(),
  ]);

  const occupiedBeds = beds.filter((bed) => includesText(bed.status, "occupied")).length;
  const bedPressurePercent = beds.length ? Math.round((occupiedBeds / beds.length) * 100) : 78;
  const criticalLabsPending = labs.filter((row) => includesText(row.status, "abnormal")).length || 5;
  const emergencyLoad = admissions.filter((row) => includesText(row.status, "admitted")).length || 4;
  const dischargeBlockers = admissions.filter((row) => includesText(row.status, "transferred")).length || 2;
  const billingBlockers = invoices.filter((row) => !includesText(row.status, "paid")).length || 11;

  return {
    bedPressurePercent,
    criticalLabsPending,
    emergencyLoad,
    dischargeBlockers,
    billingBlockers,
    alerts: commandCenterAlertFallbacks,
  };
}

export async function listOrchestratedTasks(module?: string) {
  const rows = taskOrchestrationFallbacks;
  if (!module) {
    return rows;
  }

  return rows.filter((row) => includesText(row.module, module));
}

export async function listSlaSnapshots() {
  return slaSnapshotFallbacks;
}

export async function listAuditTimeline(resourceId?: string) {
  const rows = auditTimelineFallbacks;
  if (!resourceId) {
    return rows;
  }

  return rows.filter((row) => includesText(row.resourceId, resourceId));
}

export async function listOutcomePathways() {
  return pathwayFallbacks;
}

export async function listRevenueLeakageAlerts() {
  return revenueLeakageFallbacks;
}

export async function listPlaybookRules() {
  return playbookFallbacks;
}

export async function listJourneyScores(scope?: string) {
  if (!scope) {
    return journeyScoreFallbacks;
  }

  return journeyScoreFallbacks.filter((row) => includesText(row.scope, scope));
}

export async function listRiskFlags() {
  return riskFlagFallbacks;
}

export async function listAccreditationEvidence() {
  return accreditationEvidenceFallbacks;
}

export async function listPortalMessages(patientUhid?: string) {
  if (isDatabaseConfigured && patientUhid) {
    const patient = await prisma.patient.findUnique({
      where: { uhid: patientUhid },
      include: { portalMessages: { orderBy: { createdAt: "desc" }, take: 10 } },
    });

    return patient?.portalMessages.map((message) => ({
      id: message.id,
      senderName: message.senderName,
      senderRole: message.senderRole,
      body: message.body,
      isRead: message.isRead,
      createdAt: message.createdAt.toISOString(),
    })) ?? [];
  }

  return portalMessagesFallbacks;
}

export async function listHealthGoals(patientUhid?: string) {
  if (isDatabaseConfigured && patientUhid) {
    const patient = await prisma.patient.findUnique({
      where: { uhid: patientUhid },
      include: { healthGoals: { orderBy: { updatedAt: "desc" } } },
    });

    return patient?.healthGoals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      target: goal.target,
      progress: goal.progress,
      status: goal.status,
    })) ?? [];
  }

  return healthGoalsFallbacks;
}

export async function getHospitalOptions() {
  if (isDatabaseConfigured) {
    const hospitals = await prisma.hospital.findMany({ orderBy: { name: "asc" } });
    return hospitals.map((hospital) => ({ id: hospital.id, name: hospital.name, city: hospital.city ?? "" }));
  }

  return mockHospitals.map((hospital) => ({ id: hospital.id, name: hospital.name, city: "Bengaluru" }));
}

export async function getComplianceSnapshot() {
  return {
    auditCount: (await listAuditLogs()).length,
    portalMessages: (await listPortalMessages()).length,
    documentsIndexed: 2,
    consentRecords: 1,
    abhaLinked: true,
  };
}

export async function getPatientVitalsHistory(patientUhid: string) {
  if (isDatabaseConfigured) {
    const patient = await prisma.patient.findUnique({
      where: { uhid: patientUhid },
      include: {
        encounters: {
          orderBy: { startedAt: "desc" },
          include: { vitals: { orderBy: { recordedAt: "desc" } } },
        },
      },
    });

    if (!patient || !patient.encounters.length) {
      return [];
    }

    return patient.encounters.flatMap((encounter) =>
      encounter.vitals.map((vital) => ({
        encounterId: encounter.id,
        recordedAt: vital.recordedAt.toISOString(),
        heartRate: vital.heartRate,
        bloodPressure: vital.bloodPressure,
        spo2: vital.spo2,
        temperature: vital.temperature,
        weightKg: vital.weightKg,
      })),
    );
  }

  return [];
}
