"use client";

import { CalendarDays } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BookFollowUpModal, type AppointmentBookingData } from "@/components/book-followup-modal";

interface AppointmentItem {
  id: string;
  startsAt: string;
  doctorName: string;
  status: string;
  type: string;
}

interface Department {
  id: string;
  name: string;
}

export default function PortalAppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!session?.user?.patientUhid) return;

      try {
        const [appointmentsRes, departmentsRes] = await Promise.all([
          fetch(`/api/v1/appointments?patientUhid=${session.user.patientUhid}`),
          fetch("/api/v1/departments"),
        ]);

        if (appointmentsRes.ok) {
          setAppointments(await appointmentsRes.json());
        }
        if (departmentsRes.ok) {
          setDepartments(await departmentsRes.json());
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [session?.user?.patientUhid]);

  const handleBookAppointment = async (data: AppointmentBookingData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientUhid: session?.user?.patientUhid,
          departmentId: data.departmentId,
          preferredDate: data.preferredDate,
          reason: data.reason,
          type: "WALK_IN",
        }),
      });

      if (response.ok) {
        const newAppointment = await response.json();

        // Refresh appointments
        const appointmentsRes = await fetch(
          `/api/v1/appointments?patientUhid=${session?.user?.patientUhid}`,
        );
        if (appointmentsRes.ok) {
          setAppointments(await appointmentsRes.json());
        }

        setIsModalOpen(false);
        alert(`Appointment booked successfully!\nDate: ${data.preferredDate}`);
      } else {
        alert("Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <section className="panel p-6">
          <p className="text-foreground/60">Loading...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="panel p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em]">Appointments</p>
              <h1 className="mt-3 text-3xl">My Appointment Schedule</h1>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            Book Follow-up
          </button>
        </div>
      </section>

      {appointments.length > 0 ? (
        <section className="panel overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-strong text-foreground/75">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t border-line bg-white hover:bg-surface-strong/30">
                  <td className="px-4 py-3 font-medium">
                    {new Date(appointment.startsAt).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">{appointment.doctorName || "To be assigned"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        appointment.status === "BOOKED"
                          ? "bg-brand/10 text-brand"
                          : appointment.status === "COMPLETED"
                            ? "bg-success/10 text-success"
                            : "bg-foreground/10 text-foreground/70"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{appointment.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <section className="panel p-8 text-center">
          <CalendarDays className="mx-auto mb-3 h-12 w-12 text-foreground/30" />
          <p className="text-foreground/60">No appointments scheduled yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Book Your First Appointment
          </button>
        </section>
      )}

      <BookFollowUpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleBookAppointment}
        departments={departments}
        isLoading={isSubmitting}
      />
    </div>
  );
}
