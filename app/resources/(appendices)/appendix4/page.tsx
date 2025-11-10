"use client"

import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import TemplateForm, { type TemplateSection } from "@/src/components/TemplateForm"
import appendixData from "@/src/content/appendices/appendix4.json"

import { BackLink } from "../appendix-detail"

const appendixNumber = typeof appendixData.id === "number" ? appendixData.id : 4
const sections = (appendixData.sections ?? []) as TemplateSection[]

export default function Appendix4Page() {
  const overview = sections.map((section) => ({
    label: section.groupLabel,
    firstField: section.fields[0]?.label,
  }))

  const left = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>{appendixData.purpose}</p>
      <p>
        Use this assessment before synthetic data work commences to confirm the proposal aligns with organisational
        goals, community expectations, and governance requirements.
      </p>
      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
        Tip: Capture concise yet outcome-oriented answers. Where approvals are pending, note the decision maker and due
        date.
      </div>
      <div className="space-y-2 text-xs text-muted-foreground/80">
        <p className="font-semibold text-foreground">Assessment sections</p>
        <ul className="list-disc list-inside space-y-1">
          {overview.map((item) => (
            <li key={item.label ?? item.firstField}>
              {item.label ?? item.firstField}
            </li>
          ))}
        </ul>
      </div>
      <BackLink />
    </div>
  )

  return (
    <div className="space-y-6">
      <TwoColumnLayout
        title="Appendix 4 - Use Case Assessment"
        description="Assess the proposed synthetic data use case for benefit, suitability, and governance readiness."
        left={left}
        right={
          <TemplateForm
            id={(appendixData.exportKey as string) ?? "appendix4-use-case-assessment"}
            exportKey={appendixData.exportKey as string | undefined}
            sections={sections}
          />
        }
      />
    </div>
  )
}
