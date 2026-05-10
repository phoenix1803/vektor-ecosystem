"use client";

const steps = ["Intake", "Classify", "Decide", "Hospital", "Route", "Dispatch"];

export function AgentPipelineBar({ completedSteps = 0 }: { completedSteps: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-1">
          <div
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              index < completedSteps
                ? "bg-success text-white"
                : index === completedSteps
                  ? "bg-brand text-white animate-pulse"
                  : "bg-surface-strong text-foreground/50"
            }`}
          >
            {step}
          </div>
          {index < steps.length - 1 ? (
            <div className={`h-px w-4 ${index < completedSteps ? "bg-success" : "bg-line"}`} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
