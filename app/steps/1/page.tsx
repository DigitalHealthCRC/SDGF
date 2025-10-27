"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Download, Printer, Save } from "lucide-react"
import { StepProgress } from "@/components/step-progress"
import { useProgress } from "@/lib/progress-context"
import stepDataJson from "@/src/content/framework/step1.json"

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

const formatReadMoreLabel = (href: string) => {
  const match = href.match(/appendix(\d+)/i)
  if (match) {
    return `Appendix ${match[1]}`
  }
  return href.replace(/^\//, "")
}

export default function Step1Page() {
  const stepNumber = 1
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const saved = (getFormData(stepNumber) as StepFormState) || { checklist: [] }
  const [formState, setFormState] = useState<StepFormState>(() => ({
    checklist: ensureChecklist(saved.checklist, stepData.checklist.length),
  }))
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const checklistEntries = useMemo(
    () => stepData.checklist.map((label, index) => ({ index, label })),
    [stepData.checklist]
  )

  const sections = useMemo(() => {
    const splitIndex = Math.min(3, checklistEntries.length)
    const primary = checklistEntries.slice(0, splitIndex)
    const secondary = checklistEntries.slice(splitIndex)

    const result: Array<{ title: string; description: string; items: { index: number; label: string }[] }> = []

    if (primary.length > 0) {
      result.push({
        title: "Use Case Assessment (Appendix 4)",
        description: "All three criteria must be met for the use case to proceed under this Framework.",
        items: primary,
      })
    }

    if (secondary.length > 0) {
      result.push({
        title: "Impact Assessment (Appendix 5)",
        description: "Consider broader impacts including public interest, ethics, and community expectations.",
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
    link.download = "step1-use-case-assessment.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const readMoreLinks = stepData.readMore ?? []
  const pageTitle = normaliseTitle(stepData.title)

  return (
    <div>
      <StepProgress currentStep={stepNumber} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Context */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Why This Step</h3>
                <p className="text-sm text-muted-foreground">{stepData.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Clear project description</li>
                  <li>Understanding of intended benefits</li>
                  <li>Awareness of data sources</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Time Estimate</h3>
                <p className="text-sm text-muted-foreground">30-60 minutes</p>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3 className="font-semibold text-sm">If This Fails</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  If the use case doesn't meet these criteria, it's considered "complex" and requires alternative lawful
                  pathways (e.g., HREC approval).
                </p>
              </div>
            </div>
          </div>

          {/* Center Column - Main Content */}
          <div className="lg:col-span-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
              <p className="text-muted-foreground">{stepData.summary}</p>
            </div>

            {sections.map((section) => (
              <div key={section.title} className="bg-card border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                <p className="text-sm text-muted-foreground mb-6">{section.description}</p>
                <div className="space-y-4">
                  {section.items.map(({ index, label }) => (
                    <label key={index} className="flex gap-4">
                      <input
                        type="checkbox"
                        checked={formState.checklist[index] ?? false}
                        onChange={() => toggleItem(index)}
                        className="mt-1.5 h-4 w-4 rounded border-muted-foreground/40"
                      />
                      <div>
                        <div className="font-medium">{label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={handleSaveDraft} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button onClick={exportJSON} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
                <Download className="w-4 h-4" />
                Export JSON
              </button>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>

            {/* Complete Step Button */}
            <button
              onClick={handleComplete}
              disabled={!allComplete || stepCompletion[stepNumber]}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                allComplete && !stepCompletion[stepNumber]
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {stepCompletion[stepNumber] ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Step Completed
                </span>
              ) : (
                "Mark Step Complete"
              )}
            </button>

            {stepCompletion[stepNumber] && (
              <Link
                href="/steps/2"
                className="block w-full mt-3 py-3 text-center rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
              >
                Continue to Step 2 &rarr;
              </Link>
            )}

            {readMoreLinks.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold mb-2">Read more</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {readMoreLinks.map((href) => (
                    <li key={href}>
                      <Link href={href} className="text-primary hover:underline">
                        {formatReadMoreLabel(href)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Support */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Key Terms</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium">De-identified</div>
                    <div className="text-muted-foreground">
                      Data where identity is no longer apparent or reasonably ascertainable
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Personal Information</div>
                    <div className="text-muted-foreground">Information about an identifiable individual</div>
                  </div>
                  <div>
                    <div className="font-medium">Very Low Risk</div>
                    <div className="text-muted-foreground">
                      Re-identification is so impractical there's almost no likelihood
                    </div>
                  </div>
                </div>
                <Link href="/resources/glossary" className="text-sm text-primary hover:underline mt-3 inline-block">
                  View Full Glossary &rarr;
                </Link>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Related Resources</h3>
                <div className="space-y-2 text-sm">
                  <Link href="/resources/lawful-pathways" className="block text-primary hover:underline">
                    Lawful Pathways Guide
                  </Link>
                  <Link href="/resources/decision-tree" className="block text-primary hover:underline">
                    Decision Tree for Complex Cases
                  </Link>
                  <Link href="/templates" className="block text-primary hover:underline">
                    Download Assessment Templates
                  </Link>
                </div>
              </div>

              {readMoreLinks.length > 0 && (
                <div className="bg-card border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Appendices</h3>
                  <ul className="space-y-2 text-sm">
                    {readMoreLinks.map((href) => (
                      <li key={href}>
                        <Link href={href} className="text-primary hover:underline">
                          {formatReadMoreLabel(href)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Complete Step 1?</h3>
            <p className="text-muted-foreground mb-6">
              You've completed all required assessments for Step 1. Marking this step complete will unlock Step 2 and
              save your progress.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmComplete}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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
