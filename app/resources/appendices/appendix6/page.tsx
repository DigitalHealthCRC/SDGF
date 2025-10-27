"use client"

import TemplateForm from "@/src/components/TemplateForm"

export default function Appendix6Page() {
  const fields = [
    { label: "Dataset Name" },
    { label: "Data Custodian or Source" },
    { label: "Data Quality Summary" },
    { label: "Representativeness of the Dataset" },
    { label: "Known Biases or Limitations" },
    { label: "Pre-processing or De-identification Performed" },
    { label: "Technical Readiness for Synthesis" },
    { label: "Assessed By" },
    { label: "Assessment Date", type: "date" },
  ]

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">Appendix 6 - Technical Assessment</h1>
      <p className="text-muted-foreground">
        Complete this form to document technical readiness of the source data before synthesis, covering quality,
        representativeness, and bias.
      </p>
      <TemplateForm id="appendix6" fields={fields} />
    </main>
  )
}
