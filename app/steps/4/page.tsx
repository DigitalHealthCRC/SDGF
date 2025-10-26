"use client"

import { useState } from "react"
import { useProgress } from "@/lib/progress-context"
import { StepProgress } from "@/components/step-progress"
import { AlertCircle, CheckCircle2, Download, Save, Printer } from "lucide-react"
import Link from "next/link"

export default function Step4() {
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const [formData, setFormData] = useState(getFormData(4))
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
  ]

  const mitigationChecks = [
    { id: "riskLevel", label: "Overall risk level determined (Very Low / Low / Medium / High)" },
    { id: "mitigationStrategy", label: "Mitigation strategies identified and documented" },
    { id: "residualRisk", label: "Residual risk after mitigation assessed" },
    { id: "acceptanceCriteria", label: "Risk acceptance criteria defined" },
    { id: "expertReview", label: "Expert review of risk assessment completed" },
  ]

  const allChecksComplete = () => {
    return (
      riskAssessmentChecks.every((check) => formData[check.id]) && mitigationChecks.every((check) => formData[check.id])
    )
  }

  const handleCheckChange = (id: string, checked: boolean) => {
    const newData = { ...formData, [id]: checked }
    setFormData(newData)
    saveFormData(4, newData)
  }

  const handleComplete = () => {
    if (allChecksComplete()) {
      setShowCompleteModal(true)
    }
  }

  const confirmComplete = () => {
    completeStep(4)
    setShowCompleteModal(false)
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "step4-reid-risk-assessment.json"
    link.click()
  }

  return (
    <div>
      <StepProgress currentStep={4} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Context */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Why This Step</h3>
                <p className="text-sm text-muted-foreground">
                  Quantify re-identification risks to determine if synthetic data achieves de-identification and what
                  additional safeguards are needed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Generated synthetic dataset</li>
                  <li>• Access to source data for comparison</li>
                  <li>• Privacy expertise or consultation</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Time Estimate</h3>
                <p className="text-sm text-muted-foreground">3-6 hours</p>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <h3 className="font-semibold text-sm">Expert Input Required</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Re-identification risk assessment requires specialized expertise. Consult privacy or data science
                  experts.
                </p>
              </div>
            </div>
          </div>

          {/* Center Column - Main Content */}
          <div className="lg:col-span-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Step 4: Assess Re-Identification Risks</h1>
              <p className="text-muted-foreground">Test and quantify privacy risks in the synthetic dataset</p>
            </div>

            {/* Risk Assessment */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Re-Identification Risk Testing</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Conduct comprehensive testing to identify potential privacy vulnerabilities.
              </p>

              <div className="space-y-6">
                {riskAssessmentChecks.map((check) => (
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

            {/* Risk Mitigation */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Risk Mitigation & Acceptance</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Document risk levels, mitigation strategies, and acceptance criteria.
              </p>

              <div className="space-y-4">
                {mitigationChecks.map((check) => (
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
                onClick={() => saveFormData(4, formData)}
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
              disabled={!allChecksComplete() || stepCompletion[4]}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                allChecksComplete() && !stepCompletion[4]
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {stepCompletion[4] ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Step Completed
                </span>
              ) : (
                "Mark Step Complete"
              )}
            </button>

            {stepCompletion[4] && (
              <Link
                href="/steps/5"
                className="block w-full mt-3 py-3 text-center rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
              >
                Continue to Step 5 →
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
                    <div className="font-medium">Re-identification</div>
                    <div className="text-muted-foreground">
                      Process of matching de-identified data back to individuals
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Attribute Disclosure</div>
                    <div className="text-muted-foreground">Revealing sensitive information about individuals</div>
                  </div>
                  <div>
                    <div className="font-medium">Membership Inference</div>
                    <div className="text-muted-foreground">Determining if someone was in the source dataset</div>
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
                  <Link href="/resources/lawful-pathways" className="block text-primary hover:underline">
                    Privacy Compliance Pathways
                  </Link>
                  <Link href="/templates" className="block text-primary hover:underline">
                    Risk Assessment Templates
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
            <h3 className="text-xl font-semibold mb-4">Complete Step 4?</h3>
            <p className="text-muted-foreground mb-6">
              You've completed re-identification risk assessment. Next, you'll establish safeguards for safe data
              sharing.
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
