import type { Role } from "@prisma/client";

export type DemoUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  hospitalId: string;
  hospitalName: string;
  patientUhid?: string;
};

export const demoUsers: DemoUser[] = [
  {
    id: "demo-admin",
    email: "admin@vektorcore.health",
    password: "VektorCore@2026",
    name: "Aarav Menon",
    role: "HOSPITAL_ADMIN",
    hospitalId: "hsp_apollo_north",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "doc-000-sana-iyer",
    email: "sana.iyer@apollo.health",
    password: "VektorCore@2026",
    name: "Dr. Sana Iyer",
    role: "DOCTOR",
    hospitalId: "hsp_apollo_north",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "doc-000-sana-iyer",
    email: "doctor@vektorcore.health",
    password: "VektorCore@2026",
    name: "Dr. Sana Iyer",
    role: "DOCTOR",
    hospitalId: "hsp_apollo_north",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "demo-nurse",
    email: "nurse@vektorcore.health",
    password: "VektorCore@2026",
    name: "Nisha Verma",
    role: "NURSE",
    hospitalId: "hsp_apollo_north",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "demo-pharmacist",
    email: "pharmacy@vektorcore.health",
    password: "VektorCore@2026",
    name: "Imran Siddiqui",
    role: "PHARMACIST",
    hospitalId: "hsp_apollo_north",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "demo-lab",
    email: "lab@vektorcore.health",
    password: "VektorCore@2026",
    name: "Anita Nair",
    role: "LAB_TECH",
    hospitalId: "hsp_apollo_north",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "demo-billing",
    email: "billing@vektorcore.health",
    password: "VektorCore@2026",
    name: "Rohit Sen",
    role: "BILLING_STAFF",
    hospitalId: "hsp_apollo_north",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "demo-reception",
    email: "reception@vektorcore.health",
    password: "VektorCore@2026",
    name: "Pooja Das",
    role: "RECEPTIONIST",
    hospitalId: "hsp_apollo_north",
    hospitalName: "Apollo North Campus",
  },
  {
    id: "demo-patient",
    email: "patient@vektorcore.health",
    password: "VektorCore@2026",
    name: "Arjun Mehta",
    role: "PATIENT",
    hospitalId: "hsp_apollo_north",
    hospitalName: "Apollo North Campus",
    patientUhid: "UHID-12091",
  },
];

export function findDemoUser(email: string, password: string) {
  return demoUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
  );
}
