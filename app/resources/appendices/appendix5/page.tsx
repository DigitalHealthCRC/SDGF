"use client"

import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import TemplateForm from "@/src/components/TemplateForm"

export default function Appendix5Page() {
  const fields = [
    { label: "Project or Use-Case Title" },
    {
      label: "Positive Impacts (benefits, efficiency, innovation)",
      type: "textarea",
      placeholder: "Describe the benefits you expect from this initiative...",
    },
    {
      label: "Negative Impacts or Risks (privacy, ethics, misuse)",
      type: "textarea",
      placeholder: "Outline the potential harms or risks identified...",
    },
    {
      label: "Mitigation Actions Planned",
      type: "textarea",
      placeholder: "Document the steps you will take to address any risks...",
    },
    {
      label: "Stakeholders Consulted",
      type: "textarea",
      placeholder: "List the stakeholders who have been involved in this assessment...",
    },
    { label: "Date of Assessment", type: "date" },
  ]

  const right = <TemplateForm id="appendix5" fields={fields} />

  const left = (
    <div className="space-y-3 text-sm text-muted-foreground">
      <p>Use this template to capture the key anticipated benefits and risks associated with your synthetic data project.</p>
      <p className="border-l-2 border-emerald-500/50 bg-emerald-500/10 p-3 text-emerald-200">
        Tip: Include tangible outcomes and impacted stakeholders to support governance review.
      </p>
      <a href="/resources/appendices" className="inline-flex items-center text-emerald-400 hover:underline">
        ← Back to Appendices
      </a>
    </div>
  )

  return (
    <TwoColumnLayout
      title="Appendix 5 – Impact Assessment"
      description="Evaluate benefits, risks, and mitigation actions before proceeding with synthesis."
      left={left}
      right={right}
    />
  )
}
