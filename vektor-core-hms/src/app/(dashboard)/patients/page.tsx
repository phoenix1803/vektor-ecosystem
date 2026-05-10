"use client";

import Link from "next/link";
import { Search, Plus, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { SkeletonTable } from "@/components/shared/skeleton-rows";

interface Patient {
  id: string;
  uhid: string;
  fullName: string;
  phone: string | null;
  gender: string | null;
  age: number;
  primaryCondition: string;
  lastVisit: string;
  hospitalName: string;
  doctorUserId?: string;
}

function parsePatientsPayload(payload: unknown): Patient[] {
  if (Array.isArray(payload)) {
    return payload as Patient[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) {
      return record.data as Patient[];
    }

    if (Array.isArray(record.patients)) {
      return record.patients as Patient[];
    }
  }

  return [];
}

export default function PatientsPage() {
  const { data: session } = useSession();
  const [allPatients, setAllPatients] = useState<Patient[]>([]);
  const [myPatients, setMyPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchQuery(searchInput), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    async function loadPatients() {
      try {
        const [allRes, myRes] = await Promise.all([
          fetch("/api/v1/patients"),
          fetch("/api/v1/patients/my-patients"),
        ]);

        if (allRes.ok) {
          const allPayload = await allRes.json();
          setAllPatients(parsePatientsPayload(allPayload));
        } else {
          setAllPatients([]);
        }
        if (myRes.ok) {
          const myPayload = await myRes.json();
          setMyPatients(parsePatientsPayload(myPayload));
        } else {
          setMyPatients([]);
        }
      } catch (error) {
        console.error("Failed to load patients:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user?.id) {
      loadPatients();
    }
  }, [session?.user?.id]);

  const currentPatients = Array.isArray(activeTab === "my" ? myPatients : allPatients)
    ? (activeTab === "my" ? myPatients : allPatients)
    : [];

  const now = new Date();
  const admittedCount = currentPatients.filter((patient) => {
    const condition = (patient.primaryCondition || "").toLowerCase();
    return condition.includes("ckd") || condition.includes("post-mi") || patient.age >= 65;
  }).length;
  const criticalFlags = currentPatients.filter((patient) => {
    const condition = (patient.primaryCondition || "").toLowerCase();
    return condition.includes("diabetes") || condition.includes("hypertension") || condition.includes("mi");
  }).length;

  const totalRegistered = allPatients.length;
  const opdToday = currentPatients.filter((patient) => {
    const visit = new Date(patient.lastVisit);
    return !Number.isNaN(visit.getTime()) && visit.toDateString() === now.toDateString();
  }).length;

  const getPatientStatus = (patient: Patient) => {
    const condition = (patient.primaryCondition || "").toLowerCase();
    const visit = new Date(patient.lastVisit);
    if (condition.includes("ckd") || condition.includes("post-mi") || patient.age >= 65) {
      return "Admitted";
    }
    if (!Number.isNaN(visit.getTime())) {
      const dayDiff = Math.floor((now.getTime() - visit.getTime()) / (24 * 60 * 60 * 1000));
      if (dayDiff >= 2) {
        return "Discharged";
      }
    }
    return "OPD";
  };

  const statusChipClass = (status: string) => {
    if (status === "Admitted") {
      return "chip border-danger/30 bg-danger/10 text-danger";
    }
    if (status === "Discharged") {
      return "chip border-line bg-surface-strong text-foreground/70";
    }
    return "chip border-success/30 bg-success/10 text-success";
  };

  const filteredPatients = currentPatients.filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.uhid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.phone && patient.phone.includes(searchQuery)) ||
      patient.primaryCondition.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="space-y-5">
        <section className="panel p-6">
          <p className="text-foreground/60">Loading patient registry...</p>
        </section>
        <SkeletonTable rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <h1 className="text-3xl">Patient Registry</h1>
        <p className="mt-2 text-sm text-foreground/70">Search by UHID, name, phone, or condition.</p>
      </section>

      <section className="panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50" />
            <input
              type="search"
              placeholder="Search patient"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-line bg-white py-2 pl-9 pr-3 text-sm"
            />
          </label>
          <Link
            href="/patients/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Register New Patient
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="panel p-5">
          <p className="text-sm text-foreground/70">Total Registered</p>
          <p className="mt-2 text-2xl font-semibold">{totalRegistered}</p>
          <p className="mt-1 text-xs text-foreground/50">Live registry view</p>
        </article>
        <article className="panel p-5">
          <p className="text-sm text-foreground/70">Currently Admitted</p>
          <p className="mt-2 text-2xl font-semibold text-brand">{admittedCount}</p>
        </article>
        <article className="panel p-5">
          <p className="text-sm text-foreground/70">OPD Today</p>
          <p className="mt-2 text-2xl font-semibold text-success">{opdToday}</p>
        </article>
        <article className="panel p-5">
          <p className="text-sm text-foreground/70">Critical Flags</p>
          <p className="mt-2 text-2xl font-semibold text-danger">{criticalFlags}</p>
        </article>
      </section>

      {/* Tabs */}
      <section className="panel border-b border-line">
        <div className="flex gap-8 px-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "border-brand text-brand"
                : "border-transparent text-foreground/60 hover:text-foreground"
            }`}
          >
            All Patients
          </button>
          {session?.user?.role === "DOCTOR" && (
            <button
              onClick={() => setActiveTab("my")}
              className={`border-b-2 py-4 text-sm font-medium transition-colors ${
                activeTab === "my"
                  ? "border-brand text-brand"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              My Patients ({myPatients.length})
            </button>
          )}
        </div>
      </section>

      {/* Patient Table */}
      <section className="panel overflow-hidden">
        {filteredPatients.length > 0 ? (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-strong text-foreground/75">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">UHID</th>
                <th className="px-4 py-3">Last Visit</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Primary Condition</th>
                <th className="px-4 py-3">Status</th>
                {activeTab === "my" && <th className="px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => {
                const status = getPatientStatus(patient);
                return (
                <tr key={patient.uhid} className="border-t border-line bg-white hover:bg-surface-strong/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/patients/${patient.uhid}`}
                      className="font-semibold text-brand hover:underline"
                    >
                      {patient.fullName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{patient.uhid}</td>
                  <td className="px-4 py-3">{patient.lastVisit}</td>
                  <td className="px-4 py-3">{patient.age}</td>
                  <td className="px-4 py-3 text-foreground/70">{patient.primaryCondition}</td>
                  <td className="px-4 py-3">
                    <span className={statusChipClass(status)}>{status}</span>
                  </td>
                  {activeTab === "my" && (
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/patients/${patient.uhid}`}
                          className="text-xs font-medium text-brand hover:underline"
                        >
                          View Record
                        </Link>
                        {patient.id && (
                          <Link
                            href={`/emr/${patient.id}`}
                            className="text-xs font-medium text-brand hover:underline"
                          >
                            Start Encounter
                          </Link>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
              })}
            </tbody>
          </table>
        ) : (
          <EmptyState
            title={searchQuery ? "No matching patients" : "No patients available"}
            subtitle={searchQuery ? "Try a different name, UHID, or condition." : "Newly registered patients will appear here."}
            icon={Users}
          />
        )}
      </section>
    </div>
  );
}
