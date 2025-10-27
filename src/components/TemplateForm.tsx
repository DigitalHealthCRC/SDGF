"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type TemplateField = {
  label: string
  type?: string
  placeholder?: string
}

export default function TemplateForm({ id, fields }: { id: string; fields: TemplateField[] }) {
  const [values, setValues] = useState<Record<string, string>>({})

  // Load saved draft
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem(id)
    if (saved) setValues(JSON.parse(saved))
  }, [id])

  // Save whenever values change
  useEffect(() => {
    if (typeof window === "undefined") return
    if (Object.keys(values).length === 0) return
    window.localStorage.setItem(id, JSON.stringify(values))
  }, [id, values])

  const handleChange = (label: string, value: string) =>
    setValues((prev) => ({
      ...prev,
      [label]: value,
    }))

  // Export as JSON
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(values, null, 2)], { type: "application/json" })
    const anchor = document.createElement("a")
    anchor.href = URL.createObjectURL(blob)
    anchor.download = `${id}.json`
    anchor.click()
    URL.revokeObjectURL(anchor.href)
  }

  const printPDF = () => window.print()

  const renderField = (field: TemplateField) => {
    const commonProps = {
      value: values[field.label] || "",
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        handleChange(field.label, event.target.value),
      placeholder: field.placeholder || "",
    }

    if (field.type === "textarea") {
      return (
        <Textarea
          {...commonProps}
          className="min-h-[120px] resize-y rounded-lg border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      )
    }

    return (
      <Input
        {...commonProps}
        type={field.type || "text"}
        className="rounded-lg border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
    )
  }

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <Card
          key={field.label}
          className="border border-border/50 bg-muted/20 shadow-lg shadow-black/20 ring-1 ring-white/5 backdrop-blur"
        >
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold tracking-wide text-foreground/90">{field.label}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <Label className="sr-only">{field.label}</Label>
            {renderField(field)}
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-wrap gap-3 pt-2">
        <Button type="button" onClick={downloadJSON} className="px-5 py-2 shadow-md shadow-primary/30">
          Download JSON
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={printPDF}
          className="px-5 py-2 shadow-md shadow-black/20 hover:shadow-black/30"
        >
          Print PDF
        </Button>
      </div>
    </div>
  )
}

export function Appendix5ImpactAssessmentForm() {
  return (
    <TemplateForm
      id="appendix5-impact-assessment"
      fields={[
        { label: "Impact Area" },
        { label: "Benefits", type: "textarea", placeholder: "Describe the positive outcomes expected..." },
        { label: "Risks", type: "textarea", placeholder: "Outline potential negative impacts or challenges..." },
        { label: "Mitigation Actions", type: "textarea", placeholder: "List planned mitigation strategies..." },
      ]}
    />
  )
}

export function Appendix6TechnicalAssessmentForm() {
  return (
    <TemplateForm
      id="appendix6-technical-assessment"
      fields={[
        { label: "Dataset Name" },
        { label: "Data Custodian or Source" },
        { label: "Data Quality Summary", type: "textarea" },
        { label: "Representativeness of the Dataset", type: "textarea" },
        { label: "Known Biases or Limitations", type: "textarea" },
        { label: "Pre-processing or De-identification Performed", type: "textarea" },
        { label: "Technical Readiness for Synthesis", type: "textarea" },
        { label: "Assessed By" },
        { label: "Assessment Date", type: "date" },
      ]}
    />
  )
}

export function Appendix8DecisionTreeForm() {
  return (
    <TemplateForm
      id="appendix8-decision-tree"
      fields={[
        { label: "Scenario Description", type: "textarea" },
        { label: "Decision Outcome", type: "textarea" },
      ]}
    />
  )
}

export function Appendix10SafetyAssessmentForm() {
  return (
    <TemplateForm
      id="appendix10-safety-assessment"
      fields={[
        { label: "Risk Score" },
        { label: "Re-identification Likelihood", type: "textarea" },
        { label: "Mitigation Actions", type: "textarea" },
      ]}
    />
  )
}

export function Appendix11RequestOutcomesForm() {
  return (
    <TemplateForm
      id="appendix11-request-outcomes"
      fields={[
        { label: "Requester Name" },
        { label: "Purpose", type: "textarea" },
        { label: "Decision Outcome", type: "textarea" },
        { label: "Follow-up Actions", type: "textarea" },
      ]}
    />
  )
}
