"use client"

import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import TemplateForm from "@/src/components/TemplateForm"

export default function Appendix6Page() {
  const fields = [
    { label: "Dataset Name" },
    { label: "Data Custodian or Source" },
    { label: "Data Quality Summary", type: "textarea", placeholder: "Summarise completeness, accuracy, and timeliness." },
    { label: "Representativeness of the Dataset", type: "textarea" },
    { label: "Known Biases or Limitations", type: "textarea" },
    { label: "Pre-processing or De-identification Performed", type: "textarea" },
    { label: "Technical Readiness for Synthesis", type: "textarea" },
    { label: "Assessed By" },
    { label: "Assessment Date", type: "date" },
  ]

  const right = <TemplateForm id="appendix6" fields={fields} />

  const left = (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p>Capture the technical state of your source dataset before it moves into synthesis.</p>
      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground/80">
        <li>Include data lineage and tooling notes.</li>
        <li>Flag any remediation required prior to Step 3.</li>
        <li>Reference evidence for each quality claim.</li>
      </ul>
      <a href="/resources/appendices" className="inline-flex items-center text-emerald-400 hover:underline">
        ← Back to Appendices
      </a>
    </div>
  )

  return (
    <TwoColumnLayout
      title="Appendix 6 – Technical Assessment"
      description="Document quality, representativeness, and readiness of the source dataset."
      left={left}
      right={right}
    />
  )
}

