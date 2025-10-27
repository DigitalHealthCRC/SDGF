"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Download, Printer, Save } from "lucide-react"

import { StepProgress } from "@/components/step-progress"
import { useProgress } from "@/lib/progress-context"
import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import stepDataJson from "@/src/content/framework/step4.json"

interface StepContent {
  title: string
  summary: string
  readMore?: string[]
}

interface StepFormState {
  [key: string]: boolean | string
}

const stepData = stepDataJson as StepContent

const normaliseTitle = (title?: string) => (title ? title.replace(/\s*[\u2013\u2014]\s*/, ": ") : "Step 4: Assess Re-Identification Risks")

export default function Step4Page() {
  const stepNumber = 4
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const [formData, setFormData] = useState<StepFormState>(() => ({ ...getFormData(stepNumber) }))
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const riskAssessmentChecks = [
    {
      id: "identifiabilityTest",
      label: "Identifiability testing conducted",
      description: "Attempted re-identification attacks performed and documented",
    },
    {
      id: "attributeDisclosure",
      label: "Attribute disclosure risk assessed",
      description: "Risk of inferring sensitive attributes evaluated",
    },
    {
      id: "membershipInference",
      label: "Membership inference testing completed",
      description: "Ability to determine if individual was in source data tested",
    },
    {
      id: "linkageRisk",
      label: "Linkage risk with external datasets evaluated",
      description: "Potential for linking with publicly available data assessed",
    },
  ] as const

  const mitigationChecks = [
    { id: "riskLevel", label: "Overall risk level determined" },
    { id: "mitigationStrategy", label: "Mitigation strategies identified and documented" },
    { id: "residualRisk", label: "Residual risk after mitigation assessed" },
    { id: "acceptanceCriteria", label: "Risk acceptance criteria defined" },
    { id: "expertReview", label: "Expert review of risk assessment completed" },
  ] as const

  const allChecksComplete = () => {
    const checks = [...riskAssessmentChecks, ...mitigationChecks]
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
      checks: [...riskAssessmentChecks, ...mitigationChecks].map((item) => ({
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
    link.download = "step4-reid-risk-assessment.json"
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
          Quantify re-identification risks to determine if the synthetic dataset meets very-low-risk thresholds and what safeguards are needed.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Prerequisites</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Generated synthetic dataset</li>
          <li>Access to source data for comparison</li>
          <li>Privacy expertise or consultation</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Time Estimate</h3>
        <p className="text-muted-foreground">3-6 hours</p>
      </div>
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-muted-foreground">
        <div className="mb-2 flex items-center gap-2 text-amber-500">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">Expert input required</span>
        </div>
        Re-identification testing often needs privacy or data science specialists. Document the expertise involved.
      </div>
    </div>
  )

  const checklistSection = (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
        <header className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Re-identification Risk Testing</h2>
          <p className="text-sm text-muted-foreground">Run quantitative and qualitative tests to measure privacy risk.</p>
        </header>
        <div className="space-y-3">
          {riskAssessmentChecks.map((check) => (
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
          <h2 className="text-xl font-semibold text-foreground">Risk Mitigation & Sign-off</h2>
          <p className="text-sm text-muted-foreground">Document mitigations, governance decisions, and acceptance criteria.</p>
        </header>
        <div className="space-y-3">
          {mitigationChecks.map((check) => (
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
        <h3 className="text-lg font-semibold text-foreground">Notes & sign-off</h3>
        <p className="text-sm text-muted-foreground">Capture residual risks and governance decisions.</p>
        <textarea
          value={(formData.notes as string) || ""}
          onChange={(event) => {
            const next = { ...formData, notes: event.target.value }
            setFormData(next)
            saveFormData(stepNumber, next)
          }}
          placeholder="Document residual risk, mitigations applied, and reviewers involved..."
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
          href="/steps/5"
          className="inline-flex w-full items-center justify-center rounded-lg border border-emerald-500/50 px-4 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/10"
        >
          Continue to Step 5 ?
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
            <span className="font-medium text-foreground">Re-identification:</span> Process of matching de-identified data back to individuals.
          </li>
          <li>
            <span className="font-medium text-foreground">Attribute Disclosure:</span> Revealing sensitive information about individuals.
          </li>
          <li>
            <span className="font-medium text-foreground">Membership Inference:</span> Determining if someone was in the source dataset.
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
            <Link href="/resources/lawful-pathways" className="hover:underline">
              Privacy Compliance Pathways
            </Link>
          </li>
          <li>
            <Link href="/templates" className="hover:underline">
              Risk Assessment Templates
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
            <h3 className="text-xl font-semibold text-foreground">Complete Step 4?</h3>
            <p className="text-sm text-muted-foreground">
              You've completed re-identification risk assessment. Next, you'll establish safeguards for safe data sharing.
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
