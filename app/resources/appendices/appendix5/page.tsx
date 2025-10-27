"use client"

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

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">Appendix 5 – Impact Assessment</h1>
      <p className="text-muted-foreground">
        Use this template to identify the expected benefits, potential harms, and mitigation strategies associated with
        generating or using synthetic data.
      </p>
      <TemplateForm id="appendix5" fields={fields} />
    </main>
  )
}
