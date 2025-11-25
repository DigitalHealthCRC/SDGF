// app/steps/4/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Download, Printer, Save } from "lucide-react"

import { StepProgress } from "@/components/step-progress"
import { useProgress } from "@/lib/progress-context"
import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import stepDataJson from "@/src/content/framework/step4.json"
import { getAppendixLabelFromHref } from "@/src/lib/appendix-labels"
import { StepNavigation } from "@/src/components/step-navigation"
import { RoleBadgeBar } from "@/src/components/RoleBadgeBar"
import { GovernanceIntentCard } from "@/src/components/GovernanceIntentCard"
import { DecisionPanel } from "@/src/components/DecisionPanel"
import { EvidenceChecklist } from "@/src/components/EvidenceChecklist"

interface StepContent {
  title: string
  summary: string
  checklist: string[]
  readMore?: string[]
  accountable: string
  support_roles: string[]
  decisions?: any[]
  governance_intent?: string
  operational_evidence?: string[]
}

interface StepFormState {
  checklist: boolean[]
}

const stepData = stepDataJson as StepContent

const normaliseTitle = (title?: string) => (title ? title.replace(/\s*[\u2013\u2014]\s*/, ": ") : "Step 4: Assess Re-identification Risk")

const ensureChecklist = (source: boolean[] | undefined, length: number) =>
  Array.from({ length }, (_, idx) => (Array.isArray(source) ? Boolean(source[idx]) : false))

export default function Step4Page() {
  const stepNumber = 4
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()

  const saved = (getFormData(stepNumber) as StepFormState) || { checklist: [] }
  const [formState, setFormState] = useState<StepFormState>(() => ({
    checklist: ensureChecklist(saved.checklist, stepData.checklist.length),
  }))
  const [showCompleteModal, setShowCompleteModal] = useState(false)

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
    link.download = "step4-reidentification-risk.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDecisionChange = (question: string, selected: any) => {
    console.log("Decision", question, selected)
  }

  const readMoreLinks = stepData.readMore ?? []
  const curatedResources = [
    { href: "/resources/appendix7", label: "Re-identification Metrics (Appendix 7)" },
    { href: "/resources/appendix9", label: "Lawful Pathways (Appendix 9)" },
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

  const pageTitle = normaliseTitle(stepData.title)
  const evidenceItems = stepData.operational_evidence?.map((label) => ({ label })) || []

  const leftColumn = (
    <div className="space-y-6 text-sm">
      <RoleBadgeBar accountable={stepData.accountable as any} supportRoles={stepData.support_roles as any} />
      <GovernanceIntentCard intent={stepData.governance_intent ?? ""} />
      {stepData.decisions && (
        <DecisionPanel decisions={stepData.decisions} onDecisionChange={handleDecisionChange} />
      )}
      <div>
        <h3 className="font-semibold text-foreground">Why This Step</h3>
        <p className="text-muted-foreground">
          Ensure the synthetic dataset meets the 'very low risk' threshold for re-identification before release.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Prerequisites</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Completed Step 3 (synthetic data generated)</li>
          <li>Access to re-identification metrics tools</li>
          <li>Understanding of risk thresholds</li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-foreground">Time Estimate</h3>
        <p className="text-muted-foreground">60-120 minutes</p>
      </div>
      <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-muted-foreground">
        <div className="mb-2 flex items-center gap-2 text-amber-500">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">Risk threshold critical</span>
        </div>
        Only proceed if residual risk is 'very low'. High risk requires PIA and GC approval.
      </div>
    </div>
  )

  const checklistContent = (
    <div className="space-y-6">
      <section className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
        <header>
          <h2 className="text-xl font-semibold text-foreground">Re-identification Risk Assessment</h2>
          <p className="text-sm text-muted-foreground">Complete all assessments to verify 'very low' risk status.</p>
        </header>
        <div className="space-y-3">
          {stepData.checklist.map((label, index) => (
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

      <EvidenceChecklist items={evidenceItems} />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSaveDraft}
          className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
        >
          <Save className="h-4 w-4" /> Save Draft
        </button>
        <button
          type="button"
          onClick={exportJSON}
          className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
        >
          <Download className="h-4 w-4" /> Export JSON
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
        >
          <Printer className="h-4 w-4" /> Print
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
            <CheckCircle2 className="h-5 w-5" /> Step Completed
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
          Continue to Step 5 →
        </Link>
      )}

      {combinedResources.length > 0 && (
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
      )}
    </div>
  )

  const rightColumn = (
    <div className="space-y-8">
      {checklistContent}
      <StepNavigation currentStep={4} />
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
              You have completed all required assessments for Step 4. The synthetic dataset meets 'very low' risk criteria.
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
