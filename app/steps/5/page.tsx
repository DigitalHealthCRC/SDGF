"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, Download, PartyPopper, Printer, Save } from "lucide-react"

import { StepProgress } from "@/components/step-progress"
import { useProgress } from "@/lib/progress-context"
import { usePersona } from "@/lib/persona-context"
import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import stepDataJson from "@/src/content/framework/step5.json"

interface StepContent {
  title: string
  summary: string
  readMore?: string[]
}

interface StepFormState {
  [key: string]: boolean | string
}

const stepData = stepDataJson as StepContent

const normaliseTitle = (title?: string) => (title ? title.replace(/\s*[\u2013\u2014]\s*/, ": ") : "Step 5: Manage Residual Risks")

const formatAppendixLabel = (href: string) => {
  const match = href.match(/appendix(\d+)/i)
  if (match) return `Appendix ${match[1]}`
  return href.replace(/^\//, "")
}

export default function Step5Page() {
  const stepNumber = 5
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const { persona, isStepVisible } = usePersona()

  const personaLabel = persona?.label
  const personaId = persona?.id
  const showPersonaNotice = Boolean(personaLabel && !isStepVisible(stepNumber))
  const nextStepForPersona = persona?.allowedSteps.find((n) => n > stepNumber) ?? null
  const recommendedStep = showPersonaNotice ? nextStepForPersona : null
  const [formData, setFormData] = useState<StepFormState>(() => ({ ...getFormData(stepNumber) }))
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const safeguardChecks = [
    {
      id: "accessControls",
      label: "Access controls implemented",
      description: "Authentication, authorisation, and audit logging in place",
    },
    {
      id: "dataAgreements",
      label: "Data sharing agreements established",
      description: "DSA or DUA executed with clear terms and obligations",
    },
    {
      id: "usageRestrictions",
      label: "Usage restrictions documented",
      description: "Permitted and prohibited uses clearly specified",
    },
    {
      id: "monitoringPlan",
      label: "Ongoing monitoring plan established",
      description: "Process for detecting and responding to misuse defined",
    },
  ] as const

  const complianceChecks = [
    { id: "privacyCompliance", label: "Privacy law compliance confirmed" },
    { id: "ethicsApproval", label: "Ethics approval obtained (if required)" },
    { id: "stakeholderConsent", label: "Stakeholder engagement and consent documented" },
    { id: "incidentResponse", label: "Incident response plan in place" },
    { id: "reviewSchedule", label: "Periodic review schedule established" },
  ] as const

  const allChecksComplete = () => {
    const checks = [...safeguardChecks, ...complianceChecks]
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
      checks: [...safeguardChecks, ...complianceChecks].map((item) => ({
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
    link.download = "step5-residual-risk-management.json"
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
          Implement safeguards to manage residual risks and ensure responsible, compliant data sharing.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Prerequisites</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Completed risk assessment</li>
          <li>Identified residual risks</li>
          <li>Organisational policies in place</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Time Estimate</h3>
        <p className="text-muted-foreground">2-3 hours</p>
      </div>
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-muted-foreground">
        <div className="mb-2 flex items-center gap-2 text-emerald-400">
          <PartyPopper className="h-5 w-5" />
          <span className="font-semibold">Final step!</span>
        </div>
        After completing this step, your synthetic data environment will be ready for safe, compliant sharing.
      </div>
    </div>
  )

  const checklistSection = (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
        <header className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Safety Safeguards</h2>
          <p className="text-sm text-muted-foreground">Implement technical and administrative controls to protect synthetic data.</p>
        </header>
        <div className="space-y-3">
          {safeguardChecks.map((check) => (
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
          <h2 className="text-xl font-semibold text-foreground">Compliance & Governance</h2>
          <p className="text-sm text-muted-foreground">Confirm legal, ethical, and operational readiness before release.</p>
        </header>
        <div className="space-y-3">
          {complianceChecks.map((check) => (
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
        <h3 className="text-lg font-semibold text-foreground">Notes & follow-up</h3>
        <p className="text-sm text-muted-foreground">Outline communications, agreement clauses, and monitoring actions.</p>
        <textarea
          value={(formData.notes as string) || ""}
          onChange={(event) => {
            const next = { ...formData, notes: event.target.value }
            setFormData(next)
            saveFormData(stepNumber, next)
          }}
          placeholder="Record responsibilities, monitoring schedules, and outstanding actions..."
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
            Framework Complete!
          </span>
        ) : (
          "Complete Framework"
        )}
      </button>
    </div>
  )

  const supportColumn = (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card/70 p-5 shadow-md">
        <h3 className="font-semibold text-foreground">Key Terms</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">Residual Risk:</span> Privacy risk remaining after mitigation measures.
          </li>
          <li>
            <span className="font-medium text-foreground">Data Sharing Agreement:</span> Legal contract governing data use and obligations.
          </li>
          <li>
            <span className="font-medium text-foreground">Five Safes:</span> Framework for managing access risks across people, projects, data, settings, and outputs.
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
            <Link href="/resources/appendices/appendix10" className="hover:underline">
              Five Safes Framework (Appendix 10)
            </Link>
          </li>
          <li>
            <Link href="/resources/appendices/appendix11" className="hover:underline">
              Framework Outcomes Form (Appendix 11)
            </Link>
          </li>
          <li>
            <Link href="/templates" className="hover:underline">
              Governance Templates
            </Link>
          </li>
        </ul>
      </div>

      {readMoreLinks.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card/70 p-5 shadow-md">
          <h3 className="font-semibold text-foreground">Appendices</h3>
          <ul className="mt-4 space-y-2 text-sm text-emerald-300">
            {readMoreLinks.map((href) => {
              const label = formatAppendixLabel(href)
              return (
                <li key={href}>
                  <Link href={href} className="hover:underline">
                    {label}
                  </Link>
                </li>
              )
            })}
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
      {showPersonaNotice && personaLabel && (
        <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-8">
          <div className="space-y-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
            <p className="font-semibold text-amber-100">Step {stepNumber} is optional for the {personaLabel} journey.</p>
            <p className="text-amber-100/80">
              The governance wrap-up below is available if you need it.{` `}
              {recommendedStep
                ? `Otherwise, Step ${recommendedStep} remains the suggested next activity for your role.`
                : "You have unlocked every step recommended for your persona."}
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
            <div className="flex items-center gap-3 text-emerald-400">
              <PartyPopper className="h-6 w-6" />
              <h3 className="text-xl font-semibold text-foreground">Complete Framework?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              You have completed all safeguards and governance requirements. Your synthetic data framework is ready for implementation.
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
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



