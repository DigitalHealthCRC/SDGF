"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Download, Printer, Save } from "lucide-react"

import { StepProgress } from "@/components/step-progress"
import { useProgress } from "@/lib/progress-context"
import { usePersona } from "@/lib/persona-context"
import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import stepDataJson from "@/src/content/framework/step1.json"
import { getAppendixLabelFromHref } from "@/src/lib/appendix-labels"

interface StepContent {
  title: string
  summary: string
  checklist: string[]
  readMore?: string[]
}

interface StepFormState {
  checklist: boolean[]
}

const stepData = stepDataJson as StepContent

const normaliseTitle = (title?: string) => (title ? title.replace(/\s*[\u2013\u2014]\s*/, ": ") : "Step 1: Assess the Use Case")

const ensureChecklist = (source: boolean[] | undefined, length: number) =>
  Array.from({ length }, (_, idx) => (Array.isArray(source) ? Boolean(source[idx]) : false))

export default function Step1Page() {
  const stepNumber = 1
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const { persona, isStepVisible } = usePersona()

  const personaLabel = persona?.label
  const personaId = persona?.id
  const showPersonaNotice = Boolean(personaLabel && !isStepVisible(stepNumber))
  const nextStepForPersona = persona?.allowedSteps.find((n) => n > stepNumber) ?? null
  const recommendedStep = showPersonaNotice ? nextStepForPersona : null

  const saved = (getFormData(stepNumber) as StepFormState) || { checklist: [] }
  const [formState, setFormState] = useState<StepFormState>(() => ({
    checklist: ensureChecklist(saved.checklist, stepData.checklist.length),
  }))
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const checklistEntries = stepData.checklist.map((label, index) => ({ index, label }))

  const splitIndex = Math.min(3, checklistEntries.length)
  const primary = checklistEntries.slice(0, splitIndex)
  const secondary = checklistEntries.slice(splitIndex)

  const sections: Array<{ title: string; description: string; items: { index: number; label: string }[] }> = []

  if (primary.length > 0) {
    sections.push({
      title: "Use Case Assessment (Appendix 4)",
      description: "All three criteria must be met for the use case to proceed under this Framework.",
      items: primary,
    })
  }

  if (secondary.length > 0) {
    sections.push({
      title: "Impact Assessment (Appendix 5)",
      description: "Consider broader impacts including public interest, ethics, and community expectations.",
      items: secondary,
    })
  }

  const updateChecklist = (next: boolean[]) => {
    const state = { checklist: next }
    setFormState(state)
    saveFormData(stepNumber, state)
  }

  const toggleItem = (index: number) => {
    const next = formState.checklist.map((value, idx) => (idx === index ? !value : value))
    updateChecklist(next)
  }

  const allComplete = formState.checklist.length > 0 && formState.checklist.every(Boolean)

  const handleComplete = () => {
    if (!allComplete) return
    setShowCompleteModal(true)
  }

  const confirmComplete = () => {
    completeStep(stepNumber)
    setShowCompleteModal(false)
  }

  const handleSaveDraft = () => saveFormData(stepNumber, formState)

  const exportJSON = () => {
    const payload = {
      step: normaliseTitle(stepData.title),
      summary: stepData.summary,
      checklist: stepData.checklist.map((label, index) => ({
        label,
        completed: formState.checklist[index] ?? false,
      })),
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "step1-use-case-assessment.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const readMoreLinks = stepData.readMore ?? []
  const curatedResources = [
    { href: "/resources/appendix9", label: "Lawful Pathways Guide (Appendix 9)" },
    { href: "/resources/appendix8", label: "Decision Tree for Complex Cases (Appendix 8)" },
    { href: "/templates", label: "Download Assessment Templates" },
  ]
  const resourceMap = new Map<string, string>()
  curatedResources.forEach((resource) => {
    resourceMap.set(resource.href, resource.label)
  })
  readMoreLinks.forEach((href) => {
    const label = getAppendixLabelFromHref(href)
    if (label) resourceMap.set(href, label)
  })
  const combinedResources = Array.from(resourceMap.entries()).map(([href, label]) => ({ href, label }))
  const resourcesSection =
    combinedResources.length > 0 ? (
      <section className="space-y-3 rounded-xl border border-border/60 bg-card/70 p-6 text-sm">
        <h3 className="font-semibold text-foreground">Resources</h3>
        <ul className="space-y-2 text-emerald-300">
          {combinedResources.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="hover:underline">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    ) : null
  const pageTitle = normaliseTitle(stepData.title)

  const leftColumn = (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="font-semibold text-foreground">Why This Step</h3>
        <p className="text-muted-foreground">
          Confirm the use case is acceptable under this Framework by ensuring it meets public benefit criteria, aims for
          de-identification, and has transparent communications.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Prerequisites</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Clear project description</li>
          <li>Understanding of intended benefits</li>
          <li>Awareness of data sources</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Time Estimate</h3>
        <p className="text-muted-foreground">30-60 minutes</p>
      </div>
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-muted-foreground">
        <div className="mb-2 flex items-center gap-2 text-amber-500">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">If this fails</span>
        </div>
        If the use case does not satisfy these criteria, treat it as a complex scenario and seek alternative lawful
        pathways (for example, HREC approval).
      </div>
    </div>
  )

  const checklistContent = (
    <div className="space-y-6">
      {sections.map((section) => (
        <section key={section.title} className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
          <header>
            <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
            <p className="text-sm text-muted-foreground">{section.description}</p>
          </header>
          <div className="space-y-3">
            {section.items.map(({ index, label }) => (
              <label key={index} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formState.checklist[index] ?? false}
                  onChange={() => toggleItem(index)}
                  className="mt-1 h-4 w-4 rounded border-border text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
                  aria-label={`Toggle ${label}`}
                />
                <span className="text-sm text-foreground">{label}</span>
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
        >
          <Save className="h-4 w-4" />
          Save Draft
        </button>
        <button
          type="button"
          onClick={exportJSON}
          className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
        >
          <Download className="h-4 w-4" />
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
      </div>

      <button
        type="button"
        onClick={handleComplete}
        disabled={!allComplete || stepCompletion[stepNumber]}
        className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 ${allComplete && !stepCompletion[stepNumber]
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        aria-disabled={!allComplete || stepCompletion[stepNumber]}
      >
        {stepCompletion[stepNumber] ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Step Completed
          </span>
        ) : (
          "Mark Step Complete"
        )}
      </button>

      {stepCompletion[stepNumber] && (
        <Link
          href="/steps/2"
          className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-500/50 px-4 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/10"
        >
          Continue to Step 2 ?
        </Link>
      )}

      {resourcesSection}
    </div>
  )

  const rightColumn = (
    <div className="space-y-8">
      {checklistContent}
    </div>
  )

  return (
    <div className="space-y-6">
      <StepProgress currentStep={stepNumber} />
      {showPersonaNotice && personaLabel && (
        <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-8">
          <div className="space-y-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
            <p className="font-semibold text-amber-100">Step {stepNumber} is optional for the {personaLabel} journey.</p>
            <p className="text-amber-100/80">
              Feel free to work through the guidance below if it helps.{" "}
              {recommendedStep
                ? `We recommend moving on to Step ${recommendedStep} for your persona once you are ready.`
                : "All core activities for your persona remain available."}
            </p>
            <div className="flex flex-wrap gap-3">
              {recommendedStep && personaId && (
                <Link
                  href={`/steps/${recommendedStep}?persona=${personaId}`}
                  className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                >
                  Go to Step {recommendedStep}
                </Link>
              )}
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-amber-400/60 px-4 py-2 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/20"
              >
                Change persona
              </Link>
            </div>
          </div>
        </div>
      )}
      <TwoColumnLayout title={pageTitle} description={stepData.summary} left={leftColumn} right={rightColumn} />

      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md space-y-6 rounded-xl border border-border/60 bg-background p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-foreground">Complete Step 1?</h3>
            <p className="text-sm text-muted-foreground">
              You have completed all required assessments for Step 1. Marking this step complete will save your progress.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 rounded-lg border border-border/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmComplete}
                className="flex-1 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
