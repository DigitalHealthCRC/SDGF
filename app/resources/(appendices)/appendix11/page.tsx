"use client"

import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import TemplateForm, { type TemplateSection } from "@/src/components/TemplateForm"
import appendixData from "@/src/content/appendices/appendix11.json"

import { BackLink } from "../appendix-detail"

const appendixNumber = typeof appendixData.id === "number" ? appendixData.id : 11
const sections = (appendixData.sections ?? []) as TemplateSection[]

export default function Appendix11Page() {
  const left = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>{appendixData.purpose}</p>
      <p>Summarise every assessment outcome in one place to support approvals and audit trails.</p>
      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
        Tip: Complete this form after Step 5 sign-off so all decisions, retention settings, and conditions are easy to
        reference.
      </div>
      <BackLink />
    </div>
  )

  return (
    <div className="space-y-6">
      <TwoColumnLayout
        title="Appendix 11 - Synthetic Health Data Request & Outcomes"
        description="Document consolidated results and approvals across all framework steps."
        left={left}
        right={
          <TemplateForm
            id={(appendixData.exportKey as string) ?? "appendix11-outcomes-form"}
            exportKey={appendixData.exportKey as string | undefined}
            sections={sections}
          />
        }
      />
    </div>
  )
}
