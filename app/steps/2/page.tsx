"use client"

import { useState } from "react"
import { useProgress } from "@/lib/progress-context"
import { StepProgress } from "@/components/step-progress"
import { AlertCircle, CheckCircle2, Download, Save, Printer } from "lucide-react"
import Link from "next/link"

export default function Step2() {
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const [formData, setFormData] = useState(getFormData(2))
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
      description: "Internal consistency and format standardization confirmed",
    },
    {
      id: "timeliness",
      label: "Data timeliness evaluated",
      description: "Currency and relevance of source data assessed",
    },
  ]

  const fitnessChecks = [
    { id: "representativeness", label: "Representativeness of source data confirmed" },
    { id: "sampleSize", label: "Adequate sample size for synthesis" },
    { id: "variableSelection", label: "Key variables identified and documented" },
    { id: "biasAssessment", label: "Potential biases in source data assessed" },
    { id: "dataLineage", label: "Data lineage and provenance documented" },
  ]

  const allChecksComplete = () => {
    return dataQualityChecks.every((check) => formData[check.id]) && fitnessChecks.every((check) => formData[check.id])
  }

  const handleCheckChange = (id: string, checked: boolean) => {
    const newData = { ...formData, [id]: checked }
    setFormData(newData)
    saveFormData(2, newData)
  }

  const handleComplete = () => {
    if (allChecksComplete()) {
      setShowCompleteModal(true)
    }
  }

  const confirmComplete = () => {
    completeStep(2)
    setShowCompleteModal(false)
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "step2-source-data-preparation.json"
    link.click()
  }

  return (
    <div>
      <StepProgress currentStep={2} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Context */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Why This Step</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure source data quality and fitness for purpose before synthesis. Poor quality input leads to poor
                  quality synthetic data.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Access to source data</li>
                  <li>• Data dictionary or schema</li>
                  <li>• Understanding of data collection methods</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Time Estimate</h3>
                <p className="text-sm text-muted-foreground">45-90 minutes</p>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3 className="font-semibold text-sm">Quality Matters</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Synthetic data can only be as good as the source data. Address quality issues before proceeding.
                </p>
              </div>
            </div>
          </div>

          {/* Center Column - Main Content */}
          <div className="lg:col-span-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Step 2: Prepare Source Data</h1>
              <p className="text-muted-foreground">
                Validate data quality and confirm fitness for synthetic data generation
              </p>
            </div>

            {/* Data Quality Assessment */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Data Quality Assessment</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Assess the quality dimensions of your source data using established frameworks.
              </p>

              <div className="space-y-6">
                {dataQualityChecks.map((check) => (
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

            {/* Fitness for Purpose */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Fitness for Purpose</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Confirm the source data is appropriate for your intended synthetic data use case.
              </p>

              <div className="space-y-4">
                {fitnessChecks.map((check) => (
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
                onClick={() => saveFormData(2, formData)}
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
              disabled={!allChecksComplete() || stepCompletion[2]}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                allChecksComplete() && !stepCompletion[2]
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {stepCompletion[2] ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Step Completed
                </span>
              ) : (
                "Mark Step Complete"
              )}
            </button>

            {stepCompletion[2] && (
              <Link
                href="/steps/3"
                className="block w-full mt-3 py-3 text-center rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
              >
                Continue to Step 3 →
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
                    <div className="font-medium">Data Quality</div>
                    <div className="text-muted-foreground">
                      Fitness of data for intended use across multiple dimensions
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Data Lineage</div>
                    <div className="text-muted-foreground">Documentation of data origins and transformations</div>
                  </div>
                  <div>
                    <div className="font-medium">Representativeness</div>
                    <div className="text-muted-foreground">How well data reflects the target population</div>
                  </div>
                </div>
                <Link href="/resources/glossary" className="text-sm text-primary hover:underline mt-3 inline-block">
                  View Full Glossary →
                </Link>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Related Resources</h3>
                <div className="space-y-2 text-sm">
                  <Link href="/resources/five-safes" className="block text-primary hover:underline">
                    Five Safes Framework
                  </Link>
                  <Link href="/templates" className="block text-primary hover:underline">
                    Data Quality Templates
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
            <h3 className="text-xl font-semibold mb-4">Complete Step 2?</h3>
            <p className="text-muted-foreground mb-6">
              You've completed all required assessments for Step 2. Your source data is ready for synthesis.
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
