"use client"

import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import TemplateForm, { type TemplateSection } from "@/src/components/TemplateForm"
import appendixData from "@/src/content/appendices/appendix5.json"

import { BackLink } from "../appendix-detail"

const appendixNumber = typeof appendixData.id === "number" ? appendixData.id : 5
const sections = (appendixData.sections ?? []) as TemplateSection[]

export default function Appendix5Page() {
  const fieldSummary = sections.flatMap((section) => section.fields.map((field) => field.label))

  const left = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>{appendixData.purpose}</p>
      <p>
        Document tangible benefits and potential harms so governance reviewers can weigh trade-offs quickly. Reference
        prior ethics, engagement, or cultural protocols where relevant.
      </p>
      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
        Tip: Capture evidence or links that support each answer so the assessment can be revisited without repeating
        work.
      </div>
      <div className="space-y-2 text-xs text-muted-foreground/80">
        <p className="font-semibold text-foreground">What you will record</p>
        <ul className="list-disc list-inside space-y-1">
          {fieldSummary.slice(0, 6).map((label) => (
            <li key={label}>{label}</li>
          ))}
          <li>…and more within each assessment section.</li>
        </ul>
      </div>
      <BackLink />
    </div>
  )

  return (
    <div className="space-y-6">
      <TwoColumnLayout
        title="Appendix 5 - Impact Assessment"
        description="Evaluate expected benefits, harms, and mitigation actions before progressing."
        left={left}
        right={
          <TemplateForm
            id={(appendixData.exportKey as string) ?? "appendix5-impact-assessment"}
            exportKey={appendixData.exportKey as string | undefined}
            sections={sections}
          />
        }
      />
    </div>
  )
}
