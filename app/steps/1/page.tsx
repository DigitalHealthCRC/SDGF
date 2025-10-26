"use client"

import { useState } from "react"
import { useProgress } from "@/lib/progress-context"
import { StepProgress } from "@/components/step-progress"
import { AlertCircle, CheckCircle2, Download, Save, Printer } from "lucide-react"
import Link from "next/link"

export default function Step1() {
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const [formData, setFormData] = useState(getFormData(1))
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const useCaseChecks = [
    {
      id: "publicBenefit",
      label: "Clear public benefit purpose related to health services",
      description: "The use case must be for consumer health or health system outcomes",
    },
    {
      id: "deidentified",
      label: "Aim is to achieve a de-identified dataset",
      description: "The synthetic dataset must significantly minimize risk compared to source data",
    },
    {
      id: "transparency",
      label: "Public communications setting expectations",
      description: "Organization has communicated about synthetic data use to health consumers",
    },
  ]

  const impactChecks = [
    { id: "publicInterest", label: "Public interest assessment completed" },
    { id: "resourcing", label: "Resourcing impacts evaluated" },
    { id: "beneficiaries", label: "Beneficiaries identified" },
    { id: "communityExpectations", label: "Community expectations considered" },
    { id: "privacyImpacts", label: "Privacy impacts assessed" },
    { id: "dataEthics", label: "Data ethics reviewed" },
    { id: "indigenousData", label: "Indigenous data sovereignty considered (if applicable)" },
  ]

  const allChecksComplete = () => {
    return useCaseChecks.every((check) => formData[check.id]) && impactChecks.every((check) => formData[check.id])
  }

  const handleCheckChange = (id: string, checked: boolean) => {
    const newData = { ...formData, [id]: checked }
    setFormData(newData)
    saveFormData(1, newData)
  }

  const handleComplete = () => {
    if (allChecksComplete()) {
      setShowCompleteModal(true)
    }
  }

  const confirmComplete = () => {
    completeStep(1)
    setShowCompleteModal(false)
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "step1-use-case-assessment.json"
    link.click()
  }

  return (
    <div>
      <StepProgress currentStep={1} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Context */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Why This Step</h3>
                <p className="text-sm text-muted-foreground">
                  Confirm the use case is acceptable under this Framework by ensuring it meets public benefit criteria,
                  aims for de-identification, and has transparent communications.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Clear project description</li>
                  <li>• Understanding of intended benefits</li>
                  <li>• Awareness of data sources</li>
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
              <h1 className="text-3xl font-bold mb-2">Step 1: Assess the Use Case</h1>
              <p className="text-muted-foreground">
                Determine if the proposed use case is acceptable and assess potential impacts
              </p>
            </div>

            {/* Use Case Assessment */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Use Case Assessment (Appendix 4)</h2>
              <p className="text-sm text-muted-foreground mb-6">
                All three criteria must be met for the use case to proceed under this Framework.
              </p>

              <div className="space-y-6">
                {useCaseChecks.map((check) => (
                  <div key={check.id} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={check.id}
                      checked={formData[check.id] || false}
                      onChange={(e) => handleCheckChange(check.id, e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-input"
                    />
                    <label htmlFor={check.id} className="flex-1 cursor-pointer">
                      <div className="font-medium mb-1">{check.label}</div>
                      <div className="text-sm text-muted-foreground">{check.description}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Assessment */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Impact Assessment (Appendix 5)</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Consider broader impacts including public interest, ethics, and community expectations.
              </p>

              <div className="space-y-4">
                {impactChecks.map((check) => (
                  <div key={check.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={check.id}
                      checked={formData[check.id] || false}
                      onChange={(e) => handleCheckChange(check.id, e.target.checked)}
                      className="w-5 h-5 rounded border-input"
                    />
                    <label htmlFor={check.id} className="flex-1 cursor-pointer font-medium">
                      {check.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => saveFormData(1, formData)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={exportJSON}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>

            {/* Complete Step Button */}
            <button
              onClick={handleComplete}
              disabled={!allChecksComplete() || stepCompletion[1]}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                allChecksComplete() && !stepCompletion[1]
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {stepCompletion[1] ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Step Completed
                </span>
              ) : (
                "Mark Step Complete"
              )}
            </button>

            {stepCompletion[1] && (
              <Link
                href="/steps/2"
                className="block w-full mt-3 py-3 text-center rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
              >
                Continue to Step 2 →
              </Link>
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
                  View Full Glossary →
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
