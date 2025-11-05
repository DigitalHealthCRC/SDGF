"use client"

import { usePersona } from "@/lib/persona-context"
import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import TemplateForm, { type TemplateSection } from "@/src/components/TemplateForm"
import appendixData from "@/src/content/appendices/appendix6.json"

import { BackLink, RestrictionNotice } from "../appendix-detail"

const appendixNumber = typeof appendixData.id === "number" ? appendixData.id : 6
const sections = (appendixData.sections ?? []) as TemplateSection[]

export default function Appendix6Page() {
  const { persona, isAppendixVisible } = usePersona()
  const personaLabel = persona?.label
  const showPersonaNotice = Boolean(personaLabel && !isAppendixVisible(appendixNumber))

  const headlineFields = sections.flatMap((section) => section.fields.slice(0, 2).map((field) => field.label))

  const left = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>{appendixData.purpose}</p>
      <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground/80">
        <li>Reference data lineage, custodians, and lawful use conditions.</li>
        <li>Flag remediation actions needed before progressing to Step 3.</li>
        <li>Link to dashboards or quality evidence that supports each decision.</li>
      </ul>
      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
        Tip: Capture blockers early so delivery teams can plan cleansing or linkage activity without delaying synthesis.
      </div>
      <div className="space-y-2 text-xs text-muted-foreground/80">
        <p className="font-semibold text-foreground">Sections covered</p>
        <ul className="list-disc list-inside space-y-1">
          {headlineFields.slice(0, 5).map((label) => (
            <li key={label}>{label}</li>
          ))}
          <li>…plus detailed readiness and outcome tracking.</li>
        </ul>
      </div>
      <BackLink />
    </div>
  )

  return (
    <div className="space-y-6">
      {showPersonaNotice && personaLabel && (
        <RestrictionNotice title="Appendix 6 – Technical Assessment" personaLabel={personaLabel} />
      )}
      <TwoColumnLayout
        title="Appendix 6 - Technical Assessment"
        description="Document dataset quality, representativeness, and readiness indicators."
        left={left}
        right={
          <TemplateForm
            id={(appendixData.exportKey as string) ?? "appendix6-technical-assessment"}
            exportKey={appendixData.exportKey as string | undefined}
            sections={sections}
          />
        }
      />
    </div>
  )
}
