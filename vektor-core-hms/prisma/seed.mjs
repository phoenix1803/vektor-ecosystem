import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const HOSPITAL = {
  id: "hsp_apollo_north",
  code: "APOLLO_NORTH",
  name: "Apollo North Campus",
  type: "Multi-specialty",
  city: "New Delhi",
  state: "Delhi",
  country: "India",
  nabhStatus: "NABH Certified",
  gstNumber: "07ABCDE1234F1Z5",
};

const DEMO_PASSWORD = "plain:VektorCore@2026";

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

function hoursAgo(n) {
  return new Date(Date.now() - n * 60 * 60 * 1000);
}

async function main() {
  console.log("[seed] Seeding Prisma demo data...");

  const hospital = await prisma.hospital.upsert({
    where: { code: HOSPITAL.code },
    update: {
      name: HOSPITAL.name,
      type: HOSPITAL.type,
      city: HOSPITAL.city,
      state: HOSPITAL.state,
      country: HOSPITAL.country,
      nabhStatus: HOSPITAL.nabhStatus,
      gstNumber: HOSPITAL.gstNumber,
    },
    create: HOSPITAL,
  });

  const [admin, doctor, nurse, pharmacist, labTech, billing, reception] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@vektorcore.health" },
      update: { fullName: "Aarav Menon", role: "HOSPITAL_ADMIN", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD, isActive: true },
      create: { id: "demo-admin", email: "admin@vektorcore.health", fullName: "Aarav Menon", role: "HOSPITAL_ADMIN", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD },
    }),
    prisma.user.upsert({
      where: { email: "doctor@vektorcore.health" },
      update: { fullName: "Dr. Sana Iyer", role: "DOCTOR", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD, isActive: true },
      create: { id: "demo-doctor", email: "doctor@vektorcore.health", fullName: "Dr. Sana Iyer", role: "DOCTOR", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD },
    }),
    prisma.user.upsert({
      where: { email: "nurse@vektorcore.health" },
      update: { fullName: "Nisha Verma", role: "NURSE", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD, isActive: true },
      create: { id: "demo-nurse", email: "nurse@vektorcore.health", fullName: "Nisha Verma", role: "NURSE", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD },
    }),
    prisma.user.upsert({
      where: { email: "pharmacy@vektorcore.health" },
      update: { fullName: "Imran Siddiqui", role: "PHARMACIST", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD, isActive: true },
      create: { id: "demo-pharmacist", email: "pharmacy@vektorcore.health", fullName: "Imran Siddiqui", role: "PHARMACIST", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD },
    }),
    prisma.user.upsert({
      where: { email: "lab@vektorcore.health" },
      update: { fullName: "Anita Nair", role: "LAB_TECH", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD, isActive: true },
      create: { id: "demo-lab", email: "lab@vektorcore.health", fullName: "Anita Nair", role: "LAB_TECH", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD },
    }),
    prisma.user.upsert({
      where: { email: "billing@vektorcore.health" },
      update: { fullName: "Rohit Sen", role: "BILLING_STAFF", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD, isActive: true },
      create: { id: "demo-billing", email: "billing@vektorcore.health", fullName: "Rohit Sen", role: "BILLING_STAFF", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD },
    }),
    prisma.user.upsert({
      where: { email: "reception@vektorcore.health" },
      update: { fullName: "Pooja Das", role: "RECEPTIONIST", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD, isActive: true },
      create: { id: "demo-reception", email: "reception@vektorcore.health", fullName: "Pooja Das", role: "RECEPTIONIST", hospitalId: hospital.id, passwordHash: DEMO_PASSWORD },
    }),
  ]);

  await Promise.all([
    prisma.staffProfile.upsert({
      where: { userId: doctor.id },
      update: { specialty: "Cardiology", department: "Cardiology", licenseNumber: "DMC-DEL-22018", qualifications: "MD (AIIMS), DM Cardiology" },
      create: { userId: doctor.id, specialty: "Cardiology", department: "Cardiology", licenseNumber: "DMC-DEL-22018", qualifications: "MD (AIIMS), DM Cardiology" },
    }),
    prisma.staffProfile.upsert({
      where: { userId: nurse.id },
      update: { specialty: "Critical Care", department: "ICU", licenseNumber: "NUR-DEL-10442", qualifications: "BSc Nursing" },
      create: { userId: nurse.id, specialty: "Critical Care", department: "ICU", licenseNumber: "NUR-DEL-10442", qualifications: "BSc Nursing" },
    }),
    prisma.staffProfile.upsert({
      where: { userId: pharmacist.id },
      update: { specialty: "Clinical Pharmacy", department: "Pharmacy", licenseNumber: "PHARM-DEL-7711", qualifications: "PharmD" },
      create: { userId: pharmacist.id, specialty: "Clinical Pharmacy", department: "Pharmacy", licenseNumber: "PHARM-DEL-7711", qualifications: "PharmD" },
    }),
    prisma.staffProfile.upsert({
      where: { userId: labTech.id },
      update: { specialty: "Diagnostics", department: "Lab", licenseNumber: "LAB-DEL-5502", qualifications: "BMLT" },
      create: { userId: labTech.id, specialty: "Diagnostics", department: "Lab", licenseNumber: "LAB-DEL-5502", qualifications: "BMLT" },
    }),
    prisma.staffProfile.upsert({
      where: { userId: billing.id },
      update: { specialty: "Billing", department: "Finance", licenseNumber: "FIN-DEL-2901", qualifications: "MBA Finance" },
      create: { userId: billing.id, specialty: "Billing", department: "Finance", licenseNumber: "FIN-DEL-2901", qualifications: "MBA Finance" },
    }),
    prisma.staffProfile.upsert({
      where: { userId: reception.id },
      update: { specialty: "Front Desk", department: "OPD", licenseNumber: "FD-DEL-881", qualifications: "BBA" },
      create: { userId: reception.id, specialty: "Front Desk", department: "OPD", licenseNumber: "FD-DEL-881", qualifications: "BBA" },
    }),
  ]);

  const patient = await prisma.patient.upsert({
    where: { uhid: "UHID-12091" },
    update: {
      hospitalId: hospital.id,
      fullName: "Arjun Mehta",
      dateOfBirth: new Date("1989-06-12T00:00:00.000Z"),
      gender: "Male",
      bloodGroup: "B+",
      phone: "+91-98100-12091",
      emergencyContact: { name: "Meera Mehta", relation: "Spouse", phone: "+91-98100-12092" },
      insuranceDetails: { payer: "Star Health", policy: "STAR-DEL-2026-12091", tpa: "MediAssist" },
    },
    create: {
      id: "pat_uhid_12091",
      hospitalId: hospital.id,
      uhid: "UHID-12091",
      fullName: "Arjun Mehta",
      dateOfBirth: new Date("1989-06-12T00:00:00.000Z"),
      gender: "Male",
      bloodGroup: "B+",
      phone: "+91-98100-12091",
      emergencyContact: { name: "Meera Mehta", relation: "Spouse", phone: "+91-98100-12092" },
      insuranceDetails: { payer: "Star Health", policy: "STAR-DEL-2026-12091", tpa: "MediAssist" },
    },
  });

  const [bedA101, bedIcu1] = await Promise.all([
    prisma.bed.upsert({
      where: { hospitalId_bedCode: { hospitalId: hospital.id, bedCode: "A-101" } },
      update: { ward: "Ward A", status: "occupied" },
      create: { hospitalId: hospital.id, ward: "Ward A", bedCode: "A-101", status: "occupied" },
    }),
    prisma.bed.upsert({
      where: { hospitalId_bedCode: { hospitalId: hospital.id, bedCode: "ICU-01" } },
      update: { ward: "ICU", status: "available" },
      create: { hospitalId: hospital.id, ward: "ICU", bedCode: "ICU-01", status: "available" },
    }),
  ]);

  const encounter = await prisma.encounter.upsert({
    where: { id: "enc_demo_12091" },
    update: { hospitalId: hospital.id, patientId: patient.id, type: "OPD", status: "OPEN", startedAt: hoursAgo(3) },
    create: { id: "enc_demo_12091", hospitalId: hospital.id, patientId: patient.id, type: "OPD", status: "OPEN", startedAt: hoursAgo(3) },
  });

  await prisma.vital.createMany({
    data: [
      { encounterId: encounter.id, recordedAt: hoursAgo(3), heartRate: 96, spo2: 98, bloodPressure: "128/82", temperature: 98.6, weightKg: 78.2 },
      { encounterId: encounter.id, recordedAt: hoursAgo(2), heartRate: 102, spo2: 97, bloodPressure: "132/86", temperature: 99.1, weightKg: 78.2 },
    ],
    skipDuplicates: true,
  });

  await prisma.clinicalNote.upsert({
    where: { id: "note_demo_12091" },
    update: {
      encounterId: encounter.id,
      authorUserId: doctor.id,
      noteType: "SOAP",
      summary: "Mild breathlessness post exertion; advised ECG + labs; started on conservative regimen.",
      contentFhir: { resourceType: "Observation", status: "final", code: { text: "Clinical summary" } },
    },
    create: {
      id: "note_demo_12091",
      encounterId: encounter.id,
      authorUserId: doctor.id,
      noteType: "SOAP",
      summary: "Mild breathlessness post exertion; advised ECG + labs; started on conservative regimen.",
      contentFhir: { resourceType: "Observation", status: "final", code: { text: "Clinical summary" } },
    },
  });

  const labOrder = await prisma.labOrder.upsert({
    where: { id: "lab_order_demo_12091" },
    update: { encounterId: encounter.id, orderedByUserId: doctor.id, testCode: "TROPONIN-I", status: "RESULTED", priority: "STAT", orderedAt: hoursAgo(2) },
    create: { id: "lab_order_demo_12091", encounterId: encounter.id, orderedByUserId: doctor.id, testCode: "TROPONIN-I", status: "RESULTED", priority: "STAT", orderedAt: hoursAgo(2) },
  });

  await prisma.labResult.upsert({
    where: { id: "lab_result_demo_12091" },
    update: { labOrderId: labOrder.id, value: "0.02", unit: "ng/mL", referenceRange: "0.00–0.04", isAbnormal: false, resultedAt: hoursAgo(1) },
    create: { id: "lab_result_demo_12091", labOrderId: labOrder.id, value: "0.02", unit: "ng/mL", referenceRange: "0.00–0.04", isAbnormal: false, resultedAt: hoursAgo(1) },
  });

  const prescription = await prisma.prescription.upsert({
    where: { id: "rx_demo_12091" },
    update: { encounterId: encounter.id, prescribedByUserId: doctor.id, status: "FINAL", notes: "Avoid heavy exertion for 48h; follow-up in 7 days.", prescribedAt: hoursAgo(2) },
    create: { id: "rx_demo_12091", encounterId: encounter.id, prescribedByUserId: doctor.id, status: "FINAL", notes: "Avoid heavy exertion for 48h; follow-up in 7 days.", prescribedAt: hoursAgo(2) },
  });

  await prisma.medication.createMany({
    data: [
      { prescriptionId: prescription.id, drugName: "Aspirin", strength: "75mg", frequency: "OD", durationDays: 7, quantity: 7, route: "PO" },
      { prescriptionId: prescription.id, drugName: "Atorvastatin", strength: "10mg", frequency: "OD", durationDays: 30, quantity: 30, route: "PO" },
    ],
    skipDuplicates: true,
  });

  const invoice = await prisma.billingInvoice.upsert({
    where: { invoiceNo: "INV-2026-12091" },
    update: { encounterId: encounter.id, status: "PENDING", totalAmount: "2450.00", taxAmount: "0.00", dueDate: daysAgo(-7), issuedAt: hoursAgo(2) },
    create: { id: "inv_demo_12091", encounterId: encounter.id, invoiceNo: "INV-2026-12091", status: "PENDING", totalAmount: "2450.00", taxAmount: "0.00", dueDate: daysAgo(-7), issuedAt: hoursAgo(2) },
  });

  await prisma.payment.upsert({
    where: { id: "pay_demo_12091" },
    update: { invoiceId: invoice.id, amount: "1000.00", method: "UPI", reference: "UPI/DEMO/12091", paidAt: hoursAgo(1) },
    create: { id: "pay_demo_12091", invoiceId: invoice.id, amount: "1000.00", method: "UPI", reference: "UPI/DEMO/12091", paidAt: hoursAgo(1) },
  });

  await prisma.insuranceClaim.upsert({
    where: { id: "claim_demo_12091" },
    update: { invoiceId: invoice.id, payerName: "Star Health", claimNumber: "STAR-CLM-12091", status: "SUBMITTED", approvedAmount: null },
    create: { id: "claim_demo_12091", invoiceId: invoice.id, payerName: "Star Health", claimNumber: "STAR-CLM-12091", status: "SUBMITTED", approvedAmount: null },
  });

  await prisma.admission.upsert({
    where: { encounterId: encounter.id },
    update: { patientId: patient.id, bedId: bedA101.id, admittedAt: hoursAgo(3), status: "ADMITTED" },
    create: { id: "adm_demo_12091", patientId: patient.id, encounterId: encounter.id, bedId: bedA101.id, admittedAt: hoursAgo(3), status: "ADMITTED" },
  });

  await Promise.all([
    prisma.familyMember.upsert({
      where: { id: "fam_demo_12091" },
      update: { patientId: patient.id, fullName: "Meera Mehta", relation: "Spouse", phone: "+91-98100-12092", isEmergency: true, conditions: ["Asthma"] },
      create: { id: "fam_demo_12091", patientId: patient.id, fullName: "Meera Mehta", relation: "Spouse", phone: "+91-98100-12092", isEmergency: true, conditions: ["Asthma"] },
    }),
    prisma.documentVaultItem.upsert({
      where: { id: "doc_demo_12091" },
      update: { patientId: patient.id, title: "ECG Report (Demo)", documentType: "ECG", fileUrl: "https://example.com/ecg-demo.pdf", ocrText: "Normal sinus rhythm. No acute ST changes." },
      create: { id: "doc_demo_12091", patientId: patient.id, title: "ECG Report (Demo)", documentType: "ECG", fileUrl: "https://example.com/ecg-demo.pdf", ocrText: "Normal sinus rhythm. No acute ST changes." },
    }),
    prisma.consentRecord.upsert({
      where: { id: "consent_demo_12091" },
      update: { patientId: patient.id, consentType: "GENERAL_TREATMENT", signedBy: "Arjun Mehta", status: "SIGNED", metadata: { locale: "en-IN" } },
      create: { id: "consent_demo_12091", patientId: patient.id, consentType: "GENERAL_TREATMENT", signedBy: "Arjun Mehta", status: "SIGNED", metadata: { locale: "en-IN" } },
    }),
    prisma.abhaLink.upsert({
      where: { patientId: patient.id },
      update: { abhaAddress: "arjun.mehta@abdm", healthId: "ABHA-1209-1209-1209", status: "LINKED", linkedAt: daysAgo(10) },
      create: { id: "abha_demo_12091", patientId: patient.id, abhaAddress: "arjun.mehta@abdm", healthId: "ABHA-1209-1209-1209", status: "LINKED", linkedAt: daysAgo(10) },
    }),
  ]);

  await prisma.portalMessage.createMany({
    data: [
      { id: "msg_demo_12091_1", patientId: patient.id, senderName: "Dr. Sana Iyer", senderRole: "Doctor", body: "Your ECG is stable. Continue medications and hydrate well.", isRead: false, createdAt: hoursAgo(1) },
      { id: "msg_demo_12091_2", patientId: patient.id, senderName: "Apollo Lab", senderRole: "Lab", body: "Troponin-I result is within normal range.", isRead: true, createdAt: hoursAgo(2) },
      { id: "msg_demo_12091_3", patientId: patient.id, senderName: "Billing Desk", senderRole: "Billing", body: "Invoice INV-2026-12091 is generated. Partial payment received.", isRead: true, createdAt: hoursAgo(3) },
    ],
    skipDuplicates: true,
  });

  await prisma.healthGoal.createMany({
    data: [
      { id: "goal_demo_12091_1", patientId: patient.id, title: "Daily Steps", target: "6000 steps", progress: 62, status: "ACTIVE" },
      { id: "goal_demo_12091_2", patientId: patient.id, title: "BP Control", target: "Maintain < 130/80", progress: 48, status: "ACTIVE" },
    ],
    skipDuplicates: true,
  });

  await prisma.inventoryItem.upsert({
    where: { hospitalId_sku: { hospitalId: hospital.id, sku: "MED-ASP-75" } },
    update: { name: "Aspirin 75mg", category: "Medication", stockOnHand: 340, reorderLevel: 80, expiryDate: daysAgo(-180) },
    create: { hospitalId: hospital.id, sku: "MED-ASP-75", name: "Aspirin 75mg", category: "Medication", stockOnHand: 340, reorderLevel: 80, expiryDate: daysAgo(-180) },
  });

  await prisma.appointment.upsert({
    where: { id: "appt_demo_12091" },
    update: { hospitalId: hospital.id, patientId: patient.id, doctorUserId: doctor.id, type: "OPD", status: "BOOKED", startsAt: daysAgo(-0), endsAt: daysAgo(-0), reason: "Follow-up (Demo)" },
    create: { id: "appt_demo_12091", hospitalId: hospital.id, patientId: patient.id, doctorUserId: doctor.id, type: "OPD", status: "BOOKED", startsAt: daysAgo(-0), endsAt: daysAgo(-0), reason: "Follow-up (Demo)" },
  });

  await prisma.shift.upsert({
    where: { id: "shift_demo_doc" },
    update: { userId: doctor.id, startsAt: hoursAgo(6), endsAt: hoursAgo(-2), area: "OPD", notes: "Demo roster" },
    create: { id: "shift_demo_doc", userId: doctor.id, startsAt: hoursAgo(6), endsAt: hoursAgo(-2), area: "OPD", notes: "Demo roster" },
  });

  await prisma.auditLog.createMany({
    data: [
      { id: "audit_demo_1", userId: admin.id, actorName: "Aarav Menon", action: "SEED", resource: "DEMO_DATA", resourceId: hospital.id, metadata: { note: "Demo data seeded" } },
      { id: "audit_demo_2", userId: doctor.id, actorName: "Dr. Sana Iyer", action: "VIEW", resource: "PATIENT", resourceId: patient.id, metadata: { uhid: patient.uhid } },
    ],
    skipDuplicates: true,
  });

  console.log("[seed] Done.");
  console.log(`[seed] Hospital: ${hospital.name} (${hospital.code})`);
  console.log(`[seed] Patient: ${patient.fullName} (${patient.uhid})`);
  console.log("[seed] Demo login (DB user passwordHash uses plain:VektorCore@2026). NextAuth demo-users still work too.");
}

main()
  .catch((e) => {
    console.error("[seed] Failed", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

