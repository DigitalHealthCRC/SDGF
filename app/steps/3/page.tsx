"use client"

import { useState } from "react"
import { useProgress } from "@/lib/progress-context"
import { StepProgress } from "@/components/step-progress"
import { AlertCircle, CheckCircle2, Download, Save, Printer } from "lucide-react"
import Link from "next/link"

export default function Step3() {
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const [formData, setFormData] = useState(getFormData(3))
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const synthesisChecks = [
    {
      id: "methodSelection",
      label: "Synthesis method selected and documented",
      description: "Appropriate technique chosen based on data type and use case",
    },
    {
      id: "parameterConfig",
      label: "Synthesis parameters configured",
      description: "Privacy-utility tradeoffs balanced and documented",
    },
    {
      id: "validationPlan",
      label: "Validation plan established",
      description: "Metrics and tests defined to assess synthetic data quality",
    },
    {
      id: "utilityPreservation",
      label: "Utility preservation strategy documented",
      description: "Approach to maintain statistical properties and relationships",
    },
  ]

  const documentationChecks = [
    { id: "methodDescription", label: "Detailed method description documented" },
    { id: "softwareTools", label: "Software and tools used recorded" },
    { id: "assumptions", label: "Assumptions and limitations documented" },
    { id: "qualityMetrics", label: "Quality metrics and thresholds defined" },
    { id: "iterationLog", label: "Synthesis iterations and refinements logged" },
  ]

  const allChecksComplete = () => {
    return (
      synthesisChecks.every((check) => formData[check.id]) && documentationChecks.every((check) => formData[check.id])
    )
  }

  const handleCheckChange = (id: string, checked: boolean) => {
    const newData = { ...formData, [id]: checked }
    setFormData(newData)
    saveFormData(3, newData)
  }

  const handleComplete = () => {
    if (allChecksComplete()) {
      setShowCompleteModal(true)
    }
  }

  const confirmComplete = () => {
    completeStep(3)
    setShowCompleteModal(false)
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "step3-synthetic-data-generation.json"
    link.click()
  }

  return (
    <div>
      <StepProgress currentStep={3} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Context */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Why This Step</h3>
                <p className="text-sm text-muted-foreground">
                  Document the synthesis approach to ensure reproducibility, transparency, and appropriate
                  privacy-utility balance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Validated source data</li>
                  <li>• Synthesis tool or platform</li>
                  <li>• Technical expertise in synthesis methods</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Time Estimate</h3>
                <p className="text-sm text-muted-foreground">2-4 hours</p>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3 className="font-semibold text-sm">Documentation Critical</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Thorough documentation enables reproducibility and supports re-identification risk assessment.
                </p>
              </div>
            </div>
          </div>

          {/* Center Column - Main Content */}
          <div className="lg:col-span-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Step 3: Generate Synthetic Data</h1>
              <p className="text-muted-foreground">Document synthesis approach and validate synthetic data quality</p>
            </div>

            {/* Synthesis Approach */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Synthesis Approach</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Select and configure appropriate synthesis methods for your data and use case.
              </p>

              <div className="space-y-6">
                {synthesisChecks.map((check) => (
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

            {/* Documentation Requirements */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Documentation Requirements</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Comprehensive documentation supports transparency and enables future audits.
              </p>

              <div className="space-y-4">
                {documentationChecks.map((check) => (
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
                onClick={() => saveFormData(3, formData)}
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
              disabled={!allChecksComplete() || stepCompletion[3]}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                allChecksComplete() && !stepCompletion[3]
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {stepCompletion[3] ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Step Completed
                </span>
              ) : (
                "Mark Step Complete"
              )}
            </button>

            {stepCompletion[3] && (
              <Link
                href="/steps/4"
                className="block w-full mt-3 py-3 text-center rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
              >
                Continue to Step 4 →
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
                    <div className="font-medium">Synthesis Method</div>
                    <div className="text-muted-foreground">
                      Technique used to generate synthetic data (e.g., GANs, SMOTE, parametric)
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Privacy-Utility Tradeoff</div>
                    <div className="text-muted-foreground">Balance between data privacy and analytical usefulness</div>
                  </div>
                  <div>
                    <div className="font-medium">Utility Preservation</div>
                    <div className="text-muted-foreground">Maintaining statistical properties of source data</div>
                  </div>
                </div>
                <Link href="/resources/glossary" className="text-sm text-primary hover:underline mt-3 inline-block">
                  View Full Glossary →
                </Link>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Related Resources</h3>
                <div className="space-y-2 text-sm">
                  <Link href="/resources/about-synthetic-data" className="block text-primary hover:underline">
                    About Synthetic Data
                  </Link>
                  <Link href="/templates" className="block text-primary hover:underline">
                    Synthesis Documentation Templates
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
            <h3 className="text-xl font-semibold mb-4">Complete Step 3?</h3>
            <p className="text-muted-foreground mb-6">
              You've documented your synthesis approach. Next, you'll assess re-identification risks.
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
