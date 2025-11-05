"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Download, Printer, Save } from "lucide-react"

import { StepProgress } from "@/components/step-progress"
import { useProgress } from "@/lib/progress-context"
import { usePersona } from "@/lib/persona-context"
import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import stepDataJson from "@/src/content/framework/step3.json"

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

const normaliseTitle = (title?: string) => (title ? title.replace(/\s*[\u2013\u2014]\s*/, ": ") : "Step 3: Generate Synthetic Data")

const ensureChecklist = (source: boolean[] | undefined, length: number) =>
  Array.from({ length }, (_, idx) => (Array.isArray(source) ? Boolean(source[idx]) : false))

const formatReadMoreLabel = (href: string) => {
  const match = href.match(/appendix(\d+)/i)
  if (match) return `Appendix ${match[1]}`
  return href.replace(/^\//, "")
}

export default function Step3Page() {
  const stepNumber = 3
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const { persona, isStepVisible } = usePersona()

  const fallbackStep = useMemo(() => {
    if (!persona) return stepNumber
    return persona.allowedSteps.find((n) => n > stepNumber) ?? persona.allowedSteps[0] ?? stepNumber
  }, [persona, stepNumber])

  if (persona && !isStepVisible(stepNumber)) {
    return (
      <div className="space-y-6">
        <StepProgress currentStep={fallbackStep} />
        <TwoColumnLayout
          title={`Step ${stepNumber} is not required for ${persona.label}`}
          description="Only personas responsible for synthesis execution need to complete this stage."
          left={(
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>The {persona.label} persona is not expected to document synthesis parameters.</p>
              <p>If you need to contribute to this workstream, choose a persona with technical responsibilities.</p>
            </div>
          )}
          right={(
            <div className="space-y-4">
              <Link
                href={`/steps/${fallbackStep}?persona=${persona.id}`}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Go to Step {fallbackStep}
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-border/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60"
              >
                Change persona
              </Link>
            </div>
          )}
        />
      </div>
    )
  }
  const saved = (getFormData(stepNumber) as StepFormState) || { checklist: [] }
  const [formState, setFormState] = useState<StepFormState>(() => ({
    checklist: ensureChecklist(saved.checklist, stepData.checklist.length),
  }))
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const checklistEntries = useMemo(
    () => stepData.checklist.map((label, index) => ({ index, label })),
    [stepData.checklist],
  )

  const sections = useMemo(() => {
    const splitIndex = Math.min(4, checklistEntries.length)
    const primary = checklistEntries.slice(0, splitIndex)
    const secondary = checklistEntries.slice(splitIndex)

    const result: Array<{ title: string; description: string; items: { index: number; label: string }[] }> = []

    if (primary.length > 0) {
      result.push({
        title: "Synthesis Approach",
        description: "Document method selection, configuration, and validation planning for transparency.",
        items: primary,
      })
    }

    if (secondary.length > 0) {
      result.push({
        title: "Documentation Requirements",
        description: "Capture artefacts required to evidence reproducibility and audit trails.",
        items: secondary,
      })
    }

    return result
  }, [checklistEntries])

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
    link.download = "step3-synthetic-data-generation.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const readMoreLinks = stepData.readMore ?? []
  const pageTitle = normaliseTitle(stepData.title)

  const leftColumn = (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="font-semibold text-foreground">Why This Step</h3>
        <p className="text-muted-foreground">
          Document the synthesis approach to ensure reproducibility, transparency, and appropriate privacy-utility balance.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Prerequisites</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Validated source data</li>
          <li>Synthesis tool or platform</li>
          <li>Technical expertise in synthesis methods</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Time Estimate</h3>
        <p className="text-muted-foreground">2-4 hours</p>
      </div>
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-muted-foreground">
        <div className="mb-2 flex items-center gap-2 text-amber-500">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">Documentation critical</span>
        </div>
        Thorough documentation enables reproducibility and supports downstream risk assessments and audits.
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
        className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 ${
          allComplete && !stepCompletion[stepNumber]
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
          href="/steps/4"
          className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-500/50 px-4 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/10"
        >
          Continue to Step 4 ?
        </Link>
      )}

      {readMoreLinks.length > 0 && (
        <section className="space-y-3 rounded-xl border border-border/60 bg-card/70 p-6 text-sm">
          <h3 className="font-semibold text-foreground">Read more</h3>
          <ul className="list-disc list-inside space-y-1">
            {readMoreLinks.map((href) => (
              <li key={href}>
                <Link href={href} className="text-emerald-300 hover:underline">
                  {formatReadMoreLabel(href)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )

  const supportColumn = (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card/70 p-5 shadow-md">
        <h3 className="font-semibold text-foreground">Key Terms</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Synthesis Method:</span> Technique used to generate synthetic data (e.g. GANs, SMOTE).
          </li>
          <li>
            <span className="font-medium text-foreground">Privacy-Utility Trade-off:</span> Balance between privacy protection and analytical usefulness.
          </li>
          <li>
            <span className="font-medium text-foreground">Utility Preservation:</span> Maintaining statistical properties of source data.
          </li>
        </ul>
        <Link
          href="/resources/appendices/appendix2"
          className="mt-4 inline-flex text-sm text-emerald-300 hover:underline"
        >
          View Glossary (Appendix 2)
        </Link>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/70 p-5 shadow-md">
        <h3 className="font-semibold text-foreground">Related Resources</h3>
        <ul className="mt-4 space-y-2 text-sm text-emerald-300">
          <li>
            <Link href="/resources/appendices/appendix1" className="hover:underline">
              About Synthetic Data (Appendix 1)
            </Link>
          </li>
          <li>
            <Link href="/templates" className="hover:underline">
              Synthesis Documentation Templates
            </Link>
          </li>
        </ul>
      </div>

      {readMoreLinks.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card/70 p-5 shadow-md">
          <h3 className="font-semibold text-foreground">Appendices</h3>
          <ul className="mt-4 space-y-2 text-sm text-emerald-300">
            {readMoreLinks.map((href) => (
              <li key={href}>
                <Link href={href} className="hover:underline">
                  {formatReadMoreLabel(href)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  const rightColumn = (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-8">{checklistContent}</div>
        <div className="space-y-6">{supportColumn}</div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <StepProgress currentStep={stepNumber} />
      <TwoColumnLayout title={pageTitle} description={stepData.summary} left={leftColumn} right={rightColumn} />

      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md space-y-6 rounded-xl border border-border/60 bg-background p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-foreground">Complete Step 3?</h3>
            <p className="text-sm text-muted-foreground">
              You've documented your synthesis approach. Next, you'll assess re-identification risks.
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


