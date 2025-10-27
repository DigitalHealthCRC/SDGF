"use client"

import Link from "next/link"
import { useProgress } from "@/lib/progress-context"
import { usePersona } from "@/lib/persona-context"
import { CheckCircle2, Lock } from "lucide-react"

export function StepProgress({ currentStep }: { currentStep: number }) {
  const { stepCompletion } = useProgress()
  const { isStepVisible } = usePersona()

  const steps = [
    { num: 1, title: "Use Case" },
    { num: 2, title: "Source Data" },
    { num: 3, title: "Generate" },
    { num: 4, title: "Re-ID Risk" },
    { num: 5, title: "Safety" },
  ]
  const visibleSteps = steps.filter((step) => isStepVisible(step.num))

  const isStepAccessible = (stepNum: number) => {
    if (stepNum === 1) return true
    return stepCompletion[stepNum - 1]
  }

  return (
    <div className="border-b bg-muted/30">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-4 lg:px-8">
        <div className="mx-auto flex max-w-none items-center justify-between gap-4">
          {visibleSteps.map((step, idx) => {
            const isCompleted = stepCompletion[step.num]
            const isCurrent = step.num === currentStep
            const isAccessible = isStepAccessible(step.num)

            return (
              <div key={step.num} className="flex items-center flex-1">
                <Link
                  href={isAccessible ? `/steps/${step.num}` : "#"}
                  className={`flex flex-col items-center gap-2 ${
                    isAccessible ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      isCompleted
                        ? "bg-chart-2 text-white"
                        : isCurrent
                          ? "bg-primary text-primary-foreground"
                          : isAccessible
                            ? "bg-muted border-2"
                            : "bg-muted/50 border-2 border-dashed"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : !isAccessible ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      step.num
                    )}
                  </div>
                  <span className={`text-xs font-medium text-center ${isCurrent ? "text-primary" : ""}`}>
                    {step.title}
                  </span>
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
