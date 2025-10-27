"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Download, Printer, Save } from "lucide-react"

import { StepProgress } from "@/components/step-progress"
import { useProgress } from "@/lib/progress-context"
import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import stepDataJson from "@/src/content/framework/step2.json"

interface StepContent {
  title: string
  summary: string
  readMore?: string[]
}

interface StepFormState {
  [key: string]: boolean | string
}

const stepData = stepDataJson as StepContent

const normaliseTitle = (title?: string) => (title ? title.replace(/\s*[\u2013\u2014]\s*/, ": ") : "Step 2: Prepare Source Data")

export default function Step2Page() {
  const stepNumber = 2
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const [formData, setFormData] = useState<StepFormState>(() => ({ ...getFormData(stepNumber) }))
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const dataQualityChecks = [
    {
      id: "completeness",
      label: "Data completeness assessed",
      description: "Missing values, gaps, and coverage evaluated",
    },
    {
      id: "accuracy",
      label: "Data accuracy verified",
      description: "Source data validated against known standards",
    },
    {
      id: "consistency",
      label: "Data consistency checked",
      description: "Internal consistency and format standardisation confirmed",
    },
    {
      id: "timeliness",
      label: "Data timeliness evaluated",
      description: "Currency and relevance of source data assessed",
    },
  ] as const

  const fitnessChecks = [
    { id: "representativeness", label: "Representativeness of source data confirmed" },
    { id: "sampleSize", label: "Adequate sample size for synthesis" },
    { id: "variableSelection", label: "Key variables identified and documented" },
    { id: "biasAssessment", label: "Potential biases in source data assessed" },
    { id: "dataLineage", label: "Data lineage and provenance documented" },
  ] as const

  const allChecksComplete = () => {
    const checks = [...dataQualityChecks, ...fitnessChecks]
    return checks.every((check) => Boolean(formData[check.id]))
  }

  const handleCheckChange = (id: string, checked: boolean) => {
    const next = { ...formData, [id]: checked }
    setFormData(next)
    saveFormData(stepNumber, next)
  }

  const handleComplete = () => {
    if (allChecksComplete()) {
      setShowCompleteModal(true)
    }
  }

  const confirmComplete = () => {
    completeStep(stepNumber)
    setShowCompleteModal(false)
  }

  const handleSaveDraft = () => saveFormData(stepNumber, formData)

  const exportJSON = () => {
    const payload = {
      step: normaliseTitle(stepData.title),
      summary: stepData.summary,
      checks: [...dataQualityChecks, ...fitnessChecks].map((item) => ({
        id: item.id,
        label: item.label,
        completed: Boolean(formData[item.id]),
      })),
      notes: formData.notes || "",
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "step2-source-data-preparation.json"
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
          Ensure source data quality and fitness for purpose before synthesis. Poor quality input leads to poor quality
          synthetic data.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Prerequisites</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Access to source data</li>
          <li>Data dictionary or schema</li>
          <li>Understanding of data collection methods</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Time Estimate</h3>
        <p className="text-muted-foreground">45-90 minutes</p>
      </div>
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-muted-foreground">
        <div className="mb-2 flex items-center gap-2 text-amber-500">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">Quality matters</span>
        </div>
        Synthetic data can only be as reliable as the inputs. Address data quality issues before continuing to synthesis.
      </div>
    </div>
  )

  const checklistSection = (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
        <header className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Data Quality Assessment</h2>
          <p className="text-sm text-muted-foreground">Evaluate readiness across core quality dimensions.</p>
        </header>
        <div className="space-y-3">
          {dataQualityChecks.map((check) => (
            <label key={check.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={Boolean(formData[check.id])}
                onChange={(event) => handleCheckChange(check.id, event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
                aria-label={`Toggle ${check.label}`}
              />
              <div className="space-y-1 text-sm">
                <span className="font-medium text-foreground">{check.label}</span>
                <p className="text-muted-foreground">{check.description}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
        <header className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Fitness for Purpose</h2>
          <p className="text-sm text-muted-foreground">Confirm the dataset can support the intended synthesis use case.</p>
        </header>
        <div className="space-y-3">
          {fitnessChecks.map((check) => (
            <label key={check.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={Boolean(formData[check.id])}
                onChange={(event) => handleCheckChange(check.id, event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
                aria-label={`Toggle ${check.label}`}
              />
              <span className="text-sm text-foreground">{check.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
        <h3 className="text-lg font-semibold text-foreground">Notes & next steps</h3>
        <p className="text-sm text-muted-foreground">Document required remediation before you proceed.</p>
        <textarea
          value={(formData.notes as string) || ""}
          onChange={(event) => {
            const next = { ...formData, notes: event.target.value }
            setFormData(next)
            saveFormData(stepNumber, next)
          }}
          placeholder="List data quality issues, remediation actions, and responsible owners..."
          className="h-32 w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
        />
      </section>

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
        disabled={!allChecksComplete() || stepCompletion[stepNumber]}
        className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 ${
          allChecksComplete() && !stepCompletion[stepNumber]
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
        aria-disabled={!allChecksComplete() || stepCompletion[stepNumber]}
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
          href="/steps/3"
          className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-500/50 px-4 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/10"
        >
          Continue to Step 3 ?
        </Link>
      )}
    </div>
  )

  const supportColumn = (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card/70 p-5 shadow-md">
        <h3 className="font-semibold text-foreground">Key Terms</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Data Quality:</span> Fitness of data for intended use across
            multiple dimensions.
          </li>
          <li>
            <span className="font-medium text-foreground">Data Lineage:</span> Documentation of data origins and transformations.
          </li>
          <li>
            <span className="font-medium text-foreground">Representativeness:</span> How well data reflects the target population.
          </li>
        </ul>
        <Link href="/resources/glossary" className="mt-4 inline-flex text-sm text-emerald-300 hover:underline">
          View Full Glossary ?
        </Link>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/70 p-5 shadow-md">
        <h3 className="font-semibold text-foreground">Related Resources</h3>
        <ul className="mt-4 space-y-2 text-sm text-emerald-300">
          <li>
            <Link href="/resources/five-safes" className="hover:underline">
              Five Safes Framework
            </Link>
          </li>
          <li>
            <Link href="/templates" className="hover:underline">
              Data Quality Templates
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
                  {href.replace(/^\//, "")}
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
        <div className="space-y-8">{checklistSection}</div>
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
            <h3 className="text-xl font-semibold text-foreground">Complete Step 2?</h3>
            <p className="text-sm text-muted-foreground">
              You've completed all required assessments for Step 2. Your source data is ready for synthesis.
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
