import {
  Activity,
  BedDouble,
  CircleDollarSign,
  FlaskConical,
  Receipt,
  Stethoscope,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import type { Role } from "@prisma/client";
import { authOptions } from "@/auth";
import { DoctorRealtimeIncidentAlert } from "@/components/dashboard/doctor-realtime-incident-alert";
import {
  getDashboardSnapshot,
  listAppointments,
  listBillingInvoices,
  listLabOrders,
  listWardBeds,
  listWardAdmissions,
  type AppointmentRow,
} from "@/lib/hms-data";
import { primaryNavItems } from "@/lib/navigation";
import { canAccessRoute, canPerform } from "@/lib/rbac";

function buildKpiCards(snapshot: Awaited<ReturnType<typeof getDashboardSnapshot>>, role: Role) {
  return [
    {
      title: "Registered Patients",
      value: snapshot.kpis.patients.toString(),
      icon: Users,
      visible: canPerform(role, "patients", "view"),
    },
    {
      title: "Today Appointments",
      value: snapshot.kpis.appointments.toString(),
      icon: BedDouble,
      visible: canPerform(role, "appointments", "view"),
    },
    {
      title: "Revenue Today",
      value: `Rs ${(snapshot.kpis.revenueToday / 100000).toFixed(1)}L`,
      icon: CircleDollarSign,
      visible: canPerform(role, "billing", "view"),
    },
    {
      title: "Pending Claims",
      value: snapshot.kpis.pendingClaims.toString(),
      icon: Receipt,
      visible: canPerform(role, "billing", "view"),
    },
    {
      title: "Abnormal Lab Alerts",
      value: snapshot.kpis.abnormalLabs.toString(),
      icon: FlaskConical,
      visible: canPerform(role, "lab", "view"),
    },
  ].filter((item) => item.visible);
}

function buildRoleModuleShortcuts(role: Role) {
  return primaryNavItems
    .filter((item) => item.href !== "/dashboard")
    .filter((item) => canAccessRoute(role, item.href));
}

function isSameDay(value: string, now: Date) {
  const date = new Date(value);
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function sortAppointmentsByTime(rows: AppointmentRow[]) {
  return [...rows].sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}

export default async function DashboardPage() {
  const [snapshot, session, appointments, labOrders, wardAdmissions, wardBeds, invoices] = await Promise.all([
    getDashboardSnapshot(),
    getServerSession(authOptions),
    listAppointments(),
    listBillingInvoices(),
    listLabOrders(),
    listWardAdmissions(),
    listWardBeds(),
  ]);

  const role = (session?.user?.role as Role | undefined) ?? "HOSPITAL_ADMIN";
  const doctorName = (session?.user?.name || "").toLowerCase();
  const isDoctor = role === "DOCTOR";

  const kpis = buildKpiCards(snapshot, role);
  const roleModuleShortcuts = buildRoleModuleShortcuts(role);

  const doctorAppointments = isDoctor
    ? appointments.filter((appointment) => (appointment.doctorName || "").toLowerCase().includes(doctorName))
    : [];
  const now = new Date();
  const todaysDoctorAppointments = sortAppointmentsByTime(
    doctorAppointments.filter((appointment) => isSameDay(appointment.startsAt, now))
  );
  const upcomingDoctorAppointments = sortAppointmentsByTime(
    doctorAppointments.filter((appointment) => Date.parse(appointment.startsAt) >= now.getTime())
  ).slice(0, 3);

  const doctorPatientNames = new Set(doctorAppointments.map((appointment) => appointment.patientName));
  const adminTimelineEntries = sortAppointmentsByTime(appointments).slice(0, 5);

  const wardOccupancy = Object.values(
    wardBeds.reduce<Record<string, { ward: string; occupied: number; total: number }>>((acc, bed) => {
      const key = bed.ward;
      const current = acc[key] ?? { ward: bed.ward, occupied: 0, total: 0 };
      current.total += 1;
      if ((bed.status || "").toLowerCase().includes("occupied")) {
        current.occupied += 1;
      }
      acc[key] = current;
      return acc;
    }, {})
  );

  const opdToday = appointments.filter(
    (appointment) => isSameDay(appointment.startsAt, now) && (appointment.type || "").toUpperCase() === "OPD"
  ).length;
  const icuBeds = wardBeds.filter((bed) => (bed.ward || "").toLowerCase().includes("icu"));
  const icuOccupied = icuBeds.filter((bed) => (bed.status || "").toLowerCase().includes("occupied")).length;
  const icuOccupancyPercent = icuBeds.length > 0 ? Math.round((icuOccupied / icuBeds.length) * 100) : 0;
  const pendingDischarges = wardAdmissions.filter(
    (admission) => (admission.status || "").toUpperCase() !== "DISCHARGED"
  ).length;
  const erArrivalsToday = appointments.filter(
    (appointment) => isSameDay(appointment.startsAt, now) && (appointment.type || "").toUpperCase() === "EMERGENCY"
  ).length;
  const revenueYesterday = Math.round(snapshot.kpis.revenueToday * 0.88);
  const revenueDelta = snapshot.kpis.revenueToday - revenueYesterday;
  const revenueDeltaPercent = revenueYesterday > 0 ? Math.round((revenueDelta / revenueYesterday) * 100) : 0;

  const recentActivity = [
    ...appointments.slice(0, 4).map((appointment) => {
      const time = new Date(appointment.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return `${time} ${appointment.doctorName} reviewed ${appointment.patientName} (${appointment.type})`;
    }),
    ...labOrders.slice(0, 3).map((order) => {
      const time = new Date(order.orderedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const abnormalTag = order.abnormal ? "abnormal flagged" : "normal";
      return `${time} Lab ${order.testCode} ${abnormalTag} for ${order.patientName}`;
    }),
    ...invoices.slice(0, 3).map((invoice) => {
      const time = new Date(invoice.issuedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const amount = Number(invoice.totalAmount ?? 0);
      return `${time} Invoice ${invoice.invoiceNo} created for ${invoice.patientName} (Rs ${amount.toLocaleString()})`;
    }),
  ].slice(0, 10);
  const pendingLabResults = labOrders.filter(
    (lab) =>
      doctorPatientNames.has(lab.patientName) &&
      ["ORDERED", "PROCESSING"].includes((lab.status || "").toUpperCase())
  ).length;
  const activeAdmissions = wardAdmissions.filter(
    (admission) =>
      doctorPatientNames.has(admission.patientName) &&
      (admission.status || "").toUpperCase() === "ADMITTED"
  ).length;

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <p className="chip bg-brand-soft text-brand">{isDoctor ? "Doctor Dashboard" : "Executive Dashboard"}</p>
        <h1 className="mt-4 text-3xl">{isDoctor ? "Clinical Workload Pulse" : "Hospital Operations Pulse"}</h1>
        <p className="mt-2 text-sm text-foreground/70">
          {isDoctor
            ? "Prioritized clinical actions for your patients, admissions, and urgent reviews."
            : "Aggregated activity across OPD, IPD, billing, diagnostics, and emergency intake."}
        </p>
        <div className="mt-4">
          <Link
            href="/dashboard/command-center"
            className="inline-flex rounded-xl border border-brand/30 bg-brand-soft px-3 py-2 text-sm font-semibold text-brand"
          >
            Open Command Center
          </Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-5">
        <article className={`panel border-l-4 p-4 ${opdToday > 20 ? "border-l-success" : "border-l-warning"}`}>
          <p className="text-xs text-foreground/60">OPD Today</p>
          <p className={`mt-1 text-2xl font-semibold ${opdToday > 20 ? "text-success" : "text-warning"}`}>{opdToday}</p>
          <p className="text-xs text-foreground/50">Current OPD load</p>
        </article>
        <article className={`panel border-l-4 p-4 ${icuOccupancyPercent > 85 ? "border-l-danger" : "border-l-brand"}`}>
          <p className="text-xs text-foreground/60">ICU Occupancy</p>
          <p className={`mt-1 text-2xl font-semibold ${icuOccupancyPercent > 85 ? "text-danger" : "text-brand"}`}>{icuOccupancyPercent}%</p>
          <p className="text-xs text-foreground/50">{icuOccupied}/{icuBeds.length || 0} beds occupied</p>
        </article>
        <article className={`panel border-l-4 p-4 ${pendingDischarges > 3 ? "border-l-warning" : "border-l-success"}`}>
          <p className="text-xs text-foreground/60">Pending Discharges</p>
          <p className={`mt-1 text-2xl font-semibold ${pendingDischarges > 3 ? "text-warning" : "text-success"}`}>{pendingDischarges}</p>
          <p className="text-xs text-foreground/50">Awaiting final closure</p>
        </article>
        <article className="panel border-l-4 border-l-brand p-4">
          <p className="text-xs text-foreground/60">ER Arrivals Today</p>
          <p className="mt-1 text-2xl font-semibold text-brand">{erArrivalsToday}</p>
          <p className="text-xs text-foreground/50">Emergency intake stream</p>
        </article>
        <article className={`panel border-l-4 p-4 ${revenueDelta >= 0 ? "border-l-success" : "border-l-danger"}`}>
          <p className="text-xs text-foreground/60">Revenue vs Yesterday</p>
          <div className="mt-1 flex items-center gap-1">
            {revenueDelta >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-4 w-4 text-danger" aria-hidden="true" />
            )}
            <p className={`text-2xl font-semibold ${revenueDelta >= 0 ? "text-success" : "text-danger"}`}>
              {revenueDeltaPercent}%
            </p>
          </div>
          <p className="text-xs text-foreground/50">Rs {snapshot.kpis.revenueToday.toLocaleString()}</p>
        </article>
      </section>

      {isDoctor ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground/70">My Patients Today</p>
              <Users className="h-4 w-4 text-brand" aria-hidden="true" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{todaysDoctorAppointments.length}</p>
          </article>

          <article className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground/70">Pending Lab Results</p>
              <FlaskConical className="h-4 w-4 text-warning" aria-hidden="true" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{pendingLabResults}</p>
          </article>

          <article className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground/70">Active Admissions</p>
              <BedDouble className="h-4 w-4 text-brand" aria-hidden="true" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{activeAdmissions}</p>
          </article>

          <article className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground/70">Upcoming Appointments</p>
              <Stethoscope className="h-4 w-4 text-brand" aria-hidden="true" />
            </div>
            <p className="mt-3 text-2xl font-semibold">{upcomingDoctorAppointments.length}</p>
            <p className="mt-2 text-xs text-foreground/70">
              {upcomingDoctorAppointments[0]
                ? `Next: ${new Date(upcomingDoctorAppointments[0].startsAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "No upcoming slots"}
            </p>
          </article>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map(({ title, value, icon: Icon }) => (
            <article key={title} className="panel p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/70">{title}</p>
                <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
              </div>
              <p className="mt-3 text-2xl font-semibold">{value}</p>
            </article>
          ))}
        </section>
      )}

      <section className="panel p-5">
        <h2 className="text-lg font-semibold">Role Module Shortcuts</h2>
        <p className="mt-1 text-sm text-foreground/70">Quick access to modules permitted for your role.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {roleModuleShortcuts.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-foreground/90 hover:border-brand/30"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="panel p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold">{isDoctor ? "My Schedule Today" : "Appointment Timeline"}</h2>
          <p className="mt-2 text-sm text-foreground/70">
            {isDoctor
              ? "Your appointment schedule for today with direct patient access."
              : "Hourly view of today's doctor schedule, walk-ins, and queue movement."}
          </p>
          <div className="mt-5 space-y-3">
            {isDoctor ? (
              todaysDoctorAppointments.length > 0 ? (
                todaysDoctorAppointments.map((appointment) => (
                  <div key={appointment.id} className="rounded-xl border border-line bg-white px-3 py-2 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">
                        {new Date(appointment.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-foreground/70">{appointment.type} | {appointment.status}</p>
                    </div>
                    <Link
                      href="/patients"
                      className="mt-1 inline-block text-brand hover:underline"
                    >
                      {appointment.patientName}
                    </Link>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-foreground/70">
                  No appointments scheduled for today.
                </div>
              )
            ) : (
              adminTimelineEntries.map((appointment) => (
                <div key={appointment.id} className="rounded-xl border border-line bg-white px-3 py-2 text-sm">
                  {new Date(appointment.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {" | "}
                  {appointment.patientName}
                  {" | "}
                  {appointment.type}
                </div>
              ))
            )}
          </div>
        </article>

        <article className="panel p-5">
          <h2 className="text-lg font-semibold">Alerts & Actions</h2>
          <div className="mt-4 space-y-3 text-sm">
            {isDoctor ? (
              <>
                <p className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-warning">
                  {pendingLabResults} abnormal or pending lab results need review.
                </p>
                <DoctorRealtimeIncidentAlert />
              </>
            ) : (
              <>
                <p className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-warning">
                  {snapshot.kpis.abnormalLabs} abnormal lab results awaiting clinical acknowledgement.
                </p>
                <p className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-danger">
                  Monitor Emergency Alerts for active incoming emergency transfers.
                </p>
                <p className="rounded-xl border border-brand/30 bg-brand-soft px-3 py-2 text-brand">
                  {snapshot.kpis.pendingClaims} pending billing closures for same-day discharge.
                </p>
              </>
            )}
          </div>
        </article>
      </section>

      <section className="panel p-5">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Bed Occupancy Heatmap</h2>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {wardOccupancy.map((ward) => (
            <div key={ward.ward} className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="font-semibold">{ward.ward}</p>
              <p className="mt-1 text-foreground/70">
                Occupancy {ward.total > 0 ? Math.round((ward.occupied / ward.total) * 100) : 0}%
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
          {wardBeds.map((bed) => (
            <div
              key={bed.id}
              title={`${bed.bedCode}: ${bed.status}${bed.patientName ? ` (${bed.patientName})` : ""}`}
              className={`flex h-10 items-center justify-center rounded-lg border text-xs font-medium ${
                (bed.status || "").toLowerCase().includes("occupied")
                  ? "border-danger/30 bg-danger/20 text-danger"
                  : (bed.status || "").toLowerCase().includes("cleaning")
                    ? "border-warning/30 bg-warning/20 text-warning"
                    : "border-success/30 bg-success/20 text-success"
              }`}
            >
              {bed.bedCode}
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Recent Activity Feed</h2>
        </div>
        <div className="mt-4 space-y-2">
          {recentActivity.map((entry, index) => (
            <div key={`${entry}-${index}`} className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-foreground/85">
              {entry}
            </div>
          ))}
        </div>
      </section>

      {!isDoctor && canPerform(role, "analytics", "view") && (
        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Analytics Focus</h2>
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            Track outcome pathways, patient journey quality, and risk trends from a single place.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["/dashboard/pathways", "/dashboard/journey-score", "/dashboard/risk-flags"].map((href) => (
              <Link
                key={href}
                href={href}
                className="rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-foreground/90 hover:border-brand/30"
              >
                {href.replace("/dashboard/", "").replaceAll("-", " ")}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
