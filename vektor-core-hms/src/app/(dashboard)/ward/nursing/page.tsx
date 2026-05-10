"use client";

import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { RecordVitalsModal, type VitalsData } from "@/components/record-vitals-modal";

interface NursingTask {
  id: string;
  patientName: string;
  task: string;
  assignee: string;
  status: string;
  dueAt: string;
}

export default function Page() {
  const [tasks, setTasks] = useState<NursingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<NursingTask | null>(null);
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isSavingVitals, setIsSavingVitals] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("/api/v1/ward/nursing-tasks");
        if (response.ok) {
          setTasks(await response.json());
        }
      } catch (error) {
        console.error("Failed to load nursing tasks:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, []);

  const handleRecordVitals = (task: NursingTask) => {
    setSelectedTask(task);
    setIsVitalsModalOpen(true);
  };

  const handleVitalsSave = async (vitals: VitalsData) => {
    if (!selectedTask) return;

    setIsSavingVitals(true);
    try {
      const response = await fetch("/api/v1/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: selectedTask.id,
          bloodPressure: `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`,
          heartRate: vitals.heartRate,
          spo2: vitals.spo2,
          temperature: vitals.temperature,
          weightKg: vitals.weightKg,
        }),
      });

      if (response.ok) {
        // Refresh tasks
        const tasksRes = await fetch("/api/v1/ward/nursing-tasks");
        if (tasksRes.ok) {
          setTasks(await tasksRes.json());
        }
        setIsVitalsModalOpen(false);
        alert("Vitals recorded successfully!");
      } else {
        alert("Failed to save vitals");
      }
    } catch (error) {
      console.error("Error saving vitals:", error);
      alert("Error saving vitals");
    } finally {
      setIsSavingVitals(false);
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
        <div className="flex items-center gap-2 text-brand">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.15em]">Inpatient and Ward</p>
        </div>
        <h1 className="mt-3 text-3xl">Nursing Station</h1>
        <p className="mt-2 text-sm text-foreground/70">Track nursing tasks, handover, and patient assignments.</p>
      </section>

      <section className="panel overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-strong text-foreground/75">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-line bg-white">
                <td className="px-4 py-3 font-medium">{task.patientName}</td>
                <td className="px-4 py-3">{task.task}</td>
                <td className="px-4 py-3">{task.assignee}</td>
                <td className="px-4 py-3">{task.status}</td>
                <td className="px-4 py-3">{new Date(task.dueAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {task.task === "Vitals round" && (
                    <button
                      onClick={() => handleRecordVitals(task)}
                      className="text-sm font-medium text-brand hover:underline"
                    >
                      Record Vitals
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <RecordVitalsModal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        onSubmit={handleVitalsSave}
        patientName={selectedTask?.patientName || ""}
        isLoading={isSavingVitals}
      />
    </div>
  );
}