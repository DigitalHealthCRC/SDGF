"use client"

import Link from "next/link"
import { useProgress } from "@/lib/progress-context"
import { CheckCircle2 } from "lucide-react"

export function StepProgress({ currentStep }: { currentStep: number }) {
  const { stepCompletion } = useProgress()

  const steps = [
    { num: 1, title: "Use Case" },
    { num: 2, title: "Source Data" },
    { num: 3, title: "Generate" },
    { num: 4, title: "Re-ID Risk" },
    { num: 5, title: "Safety" },
    { num: 6, title: "Final" },
  ]

  return (
    <div className="border-b bg-muted/30">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-4 lg:px-8">
        <div className="mx-auto flex max-w-none items-center justify-between gap-4">
          {steps.map((step, idx) => {
            const isCompleted = stepCompletion[step.num]
            const isCurrent = step.num === currentStep
            const isIncomplete = !isCompleted && !isCurrent

            let circleClasses = ""

            if (isCompleted) {
              circleClasses = "bg-chart-2 text-white"
            } else if (isCurrent) {
              circleClasses = "bg-primary text-primary-foreground"
            } else {
              circleClasses = "bg-muted border-2 text-muted-foreground"
            }

            return (
              <div key={step.num} className="flex items-center flex-1">
                <Link
                  href={`/steps/${step.num}`}
                  className={`flex flex-col items-center gap-2 transition-opacity ${isIncomplete ? "opacity-60 hover:opacity-100" : ""
                    }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${circleClasses
                      }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                  </div>
                  <div className="flex flex-col items-center">
                    <span
                      className={`text-xs font-medium text-center ${isCurrent ? "text-primary" : "text-muted-foreground"
                        }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </Link>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${stepCompletion[step.num] ? "bg-chart-2" : "bg-border"}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
