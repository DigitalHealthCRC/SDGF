"use client"

import { useState } from "react"
import { useProgress } from "@/lib/progress-context"
import { StepProgress } from "@/components/step-progress"
import { CheckCircle2, Download, Save, Printer, PartyPopper } from "lucide-react"
import Link from "next/link"

export default function Step5() {
  const { completeStep, stepCompletion, saveFormData, getFormData } = useProgress()
  const [formData, setFormData] = useState(getFormData(5))
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const safeguardChecks = [
    {
      id: "accessControls",
      label: "Access controls implemented",
      description: "Authentication, authorization, and audit logging in place",
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
  ]

  const complianceChecks = [
    { id: "privacyCompliance", label: "Privacy law compliance confirmed" },
    { id: "ethicsApproval", label: "Ethics approval obtained (if required)" },
    { id: "stakeholderConsent", label: "Stakeholder engagement and consent documented" },
    { id: "incidentResponse", label: "Incident response plan in place" },
    { id: "reviewSchedule", label: "Periodic review schedule established" },
  ]

  const allChecksComplete = () => {
    return safeguardChecks.every((check) => formData[check.id]) && complianceChecks.every((check) => formData[check.id])
  }

  const handleCheckChange = (id: string, checked: boolean) => {
    const newData = { ...formData, [id]: checked }
    setFormData(newData)
    saveFormData(5, newData)
  }

  const handleComplete = () => {
    if (allChecksComplete()) {
      setShowCompleteModal(true)
    }
  }

  const confirmComplete = () => {
    completeStep(5)
    setShowCompleteModal(false)
  }

  const exportJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "step5-residual-risk-management.json"
    link.click()
  }

  return (
    <div>
      <StepProgress currentStep={5} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Context */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Why This Step</h3>
                <p className="text-sm text-muted-foreground">
                  Implement safeguards to manage residual risks and ensure responsible, compliant data sharing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prerequisites</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Completed risk assessment</li>
                  <li>• Identified residual risks</li>
                  <li>• Organizational policies in place</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Time Estimate</h3>
                <p className="text-sm text-muted-foreground">2-3 hours</p>
              </div>
              <div className="p-4 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                <div className="flex gap-2 mb-2">
                  <PartyPopper className="w-5 h-5 text-chart-2 flex-shrink-0" />
                  <h3 className="font-semibold text-sm">Final Step</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  After completing this step, your synthetic data will be ready for safe, compliant sharing.
                </p>
              </div>
            </div>
          </div>

          {/* Center Column - Main Content */}
          <div className="lg:col-span-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">Step 5: Manage Residual Risks</h1>
              <p className="text-muted-foreground">
                Implement safeguards and establish governance for safe data sharing
              </p>
            </div>

            {/* Safeguards */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Safety Safeguards</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Implement technical and administrative controls to protect synthetic data.
              </p>

              <div className="space-y-6">
                {safeguardChecks.map((check) => (
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

            {/* Compliance & Governance */}
            <div className="bg-card border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Compliance & Governance</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Ensure legal compliance and establish ongoing governance processes.
              </p>

              <div className="space-y-4">
                {complianceChecks.map((check) => (
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
                onClick={() => saveFormData(5, formData)}
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
              disabled={!allChecksComplete() || stepCompletion[5]}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                allChecksComplete() && !stepCompletion[5]
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {stepCompletion[5] ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Framework Complete!
                </span>
              ) : (
                "Complete Framework"
              )}
            </button>

            {stepCompletion[5] && (
              <div className="mt-6 p-6 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <PartyPopper className="w-6 h-6 text-chart-2" />
                  Congratulations!
                </h3>
                <p className="text-muted-foreground mb-4">
                  You've completed all five steps of the Synthetic Health Data Governance Framework. Your synthetic data
                  is now ready for safe, lawful, and efficient use.
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Return to Home
                </Link>
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
                    <div className="font-medium">Residual Risk</div>
                    <div className="text-muted-foreground">Privacy risk remaining after mitigation measures</div>
                  </div>
                  <div>
                    <div className="font-medium">Data Sharing Agreement</div>
                    <div className="text-muted-foreground">Legal contract governing data use and obligations</div>
                  </div>
                  <div>
                    <div className="font-medium">Five Safes</div>
                    <div className="text-muted-foreground">Framework for managing data access risks</div>
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
                  <Link href="/resources/agreements" className="block text-primary hover:underline">
                    Data Agreement Templates
                  </Link>
                  <Link href="/templates" className="block text-primary hover:underline">
                    Governance Templates
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
            <div className="flex items-center gap-3 mb-4">
              <PartyPopper className="w-8 h-8 text-chart-2" />
              <h3 className="text-xl font-semibold">Complete Framework?</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              You've completed all safeguards and governance requirements. Your synthetic health data governance
              framework is complete and ready for implementation.
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
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
