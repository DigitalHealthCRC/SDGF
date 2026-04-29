"use client"

import { CheckCircle2, ListChecks } from "lucide-react"

import { getStepCompletionRequirements, type StepRequirement } from "@/src/lib/step-completion"

interface StepCompletionRequirementsProps {
  requirements: StepRequirement[]
  isComplete?: boolean
}

export function StepCompletionRequirements({ requirements, isComplete = false }: StepCompletionRequirementsProps) {
  const status = getStepCompletionRequirements(requirements)
  const visibleMissing = status.missing.slice(0, 5)
  const hiddenCount = status.missing.length - visibleMissing.length

  return (
    <section className="rounded-xl border border-border/60 bg-card/70 p-4 text-sm shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {status.ready || isComplete ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          ) : (
            <ListChecks className="h-5 w-5 text-amber-400" aria-hidden="true" />
          )}
          <h3 className="font-semibold text-foreground">Step completion requirements</h3>
        </div>
        <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
          {status.completed} / {status.total} complete
        </span>
      </div>
      {isComplete ? (
        <p className="mt-3 text-muted-foreground">This step has already been marked complete.</p>
      ) : status.ready ? (
        <p className="mt-3 text-emerald-300">All required checklist items are complete. You can mark this step complete.</p>
      ) : (
        <div className="mt-3 space-y-2">
          <p className="text-muted-foreground">Finish these before marking the step complete:</p>
          <ul className="space-y-1 text-muted-foreground">
            {visibleMissing.map((label) => (
              <li key={label} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
            {hiddenCount > 0 && <li>And {hiddenCount} more required item{hiddenCount === 1 ? "" : "s"}.</li>}
          </ul>
        </div>
      )}
    </section>
  )
}
