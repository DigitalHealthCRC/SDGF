"use client"

import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import TemplateForm, { type TemplateSection } from "@/src/components/TemplateForm"
import appendixData from "@/src/content/appendices/appendix10.json"

import { BackLink } from "../appendix-detail"

const appendixNumber = typeof appendixData.id === "number" ? appendixData.id : 10
const sections = (appendixData.sections ?? []) as TemplateSection[]

export default function Appendix10Page() {
  const sectionLabels = sections
    .map((section) => section.groupLabel ?? section.fields[0]?.label)
    .filter(Boolean) as string[]

  const left = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>{appendixData.purpose}</p>
      <p>
        Check controls across the Five Safes to confirm synthetic data can be released to the approved audience under
        agreed conditions.
      </p>
      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
        Tip: Capture links to policies, agreements, or monitoring dashboards that demonstrate each control is in place.
      </div>
      <div className="space-y-2 text-xs text-muted-foreground/80">
        <p className="font-semibold text-foreground">Focus areas</p>
        <ul className="list-disc list-inside space-y-1">
          {sectionLabels.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>
      <BackLink />
    </div>
  )

  return (
    <div className="space-y-6">
      <TwoColumnLayout
        title="Appendix 10 - Safety Assessment (Five Safes)"
        description="Assess the adequacy of controls before releasing synthetic data."
        left={left}
        right={
          <TemplateForm
            id={(appendixData.exportKey as string) ?? "appendix10-safety-assessment"}
            exportKey={appendixData.exportKey as string | undefined}
            sections={sections}
          />
        }
      />
    </div>
  )
}
