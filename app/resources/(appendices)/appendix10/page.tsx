"use client"

import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import TemplateForm, { type TemplateSection } from "@/src/components/TemplateForm"
import appendixData from "@/src/content/appendices/appendix10.json"

import { BackLink } from "../appendix-detail"

const sections = (appendixData.sections ?? []) as TemplateSection[]
const storageId = (appendixData.exportKey as string) ?? "appendix10-safety-assessment"
const pdfFilename = "APPENDIX 10_ Safety Assessment.pdf"

export default function Appendix10Page() {
  const pdfHref = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(pdfFilename)}`

  const left = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>{appendixData.purpose}</p>
      <p>
        Check controls across the Five Safes to confirm synthetic data can be released to the approved audience under
        agreed conditions.
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href={pdfHref}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card/80"
        >
          Open original PDF
        </a>
        <a
          href={pdfHref}
          download
          className="rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card/80"
        >
          Download PDF
        </a>
      </div>
      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
        Tip: Capture links to policies, agreements, or monitoring dashboards that demonstrate each control is in place.
      </div>
      <div className="space-y-2 text-xs text-muted-foreground/80">
        <p className="font-semibold text-foreground">Jump to section</p>
        <ol className="space-y-1">
          {sections.map((section, index) => {
            const label = section.groupLabel ?? section.fields[0]?.label ?? `Section ${index + 1}`
            const anchorId = `${storageId}-section-${index + 1}-${label
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")}`
            return (
              <li key={anchorId}>
                <a href={`#${anchorId}`} className="underline underline-offset-2 hover:text-foreground">
                  {label}
                </a>
              </li>
            )
          })}
        </ol>
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
            id={storageId}
            exportKey={appendixData.exportKey as string | undefined}
            sections={sections}
          />
        }
      />
    </div>
  )
}
