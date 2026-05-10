import { z } from "zod";

export const patientCreateSchema = z.object({
  hospitalId: z.string().min(1).default("hsp_apollo_north"),
  uhid: z.string().min(1).optional(),
  fullName: z.string().min(2),
  phone: z.string().min(7).optional().nullable(),
  gender: z.string().optional().nullable(),
  dateOfBirth: z.string().datetime().optional().nullable(),
  aadhaar: z.string().optional().nullable(),
  bloodGroup: z.string().optional().nullable(),
});

export const appointmentCreateSchema = z.object({
  hospitalId: z.string().min(1),
  patientId: z.string().min(1),
  doctorUserId: z.string().min(1),
  type: z.enum(["OPD", "TELE", "WALK_IN", "EMERGENCY"]).default("OPD"),
  status: z.enum(["BOOKED", "CHECKED_IN", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional().nullable(),
  reason: z.string().optional().nullable(),
});

export const emrNoteCreateSchema = z.object({
  encounterId: z.string().min(1),
  authorUserId: z.string().min(1),
  noteType: z.string().min(1).default("SOAP"),
  summary: z.string().optional().nullable(),
  contentFhir: z.record(z.string(), z.any()).optional().default({}),
});

export const labOrderCreateSchema = z.object({
  encounterId: z.string().min(1),
  orderedByUserId: z.string().min(1),
  testCode: z.string().min(1),
  status: z.enum(["ORDERED", "SAMPLE_COLLECTED", "PROCESSING", "RESULTED", "CANCELLED"]).optional(),
  priority: z.enum(["ROUTINE", "URGENT", "STAT"]).optional(),
});

export const prescriptionCreateSchema = z.object({
  encounterId: z.string().min(1),
  prescribedByUserId: z.string().min(1),
  status: z.string().optional(),
  notes: z.string().optional().nullable(),
});

export const billingInvoiceCreateSchema = z.object({
  encounterId: z.string().min(1),
  invoiceNo: z.string().optional(),
  status: z.enum(["DRAFT", "SENT", "PENDING", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  totalAmount: z.number().nonnegative(),
  taxAmount: z.number().nonnegative().optional().default(0),
  dueDate: z.string().datetime().optional().nullable(),
});

export const inventoryItemCreateSchema = z.object({
  hospitalId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1).optional().default("GENERAL"),
  stockOnHand: z.number().int().nonnegative().optional().default(0),
  reorderLevel: z.number().int().nonnegative().optional().default(0),
  expiryDate: z.string().datetime().optional().nullable(),
});

export const emergencyEventCreateSchema = z.object({
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  patient_uhid: z.string().optional(),
  vitals_snapshot: z
    .object({
      hr: z.number().optional(),
      spo2: z.number().optional(),
      bp: z.string().optional(),
    })
    .optional(),
  timestamp: z.string().datetime().optional(),
});
