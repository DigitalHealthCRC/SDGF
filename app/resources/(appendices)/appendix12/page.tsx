import fs from "fs"
import path from "path"

import Link from "next/link"
import { ArrowRight, BarChart3, ClipboardCheck, Download, FileText, Target } from "lucide-react"

import { PageShell } from "@/components/page-shell"
import { BackButton } from "@/src/components/back-button"

export const dynamic = "force-static"

const APPENDIX_NUMBER = 12
const PDF_DIR = path.join(process.cwd(), "public/appendices_pdf")

const resolvePdfFilename = () => {
  if (!fs.existsSync(PDF_DIR)) return undefined
  const pdfFiles = fs.readdirSync(PDF_DIR)

  return pdfFiles.find((pdf) => {
    const match = pdf.match(/APPENDIX\s+(\d+)[_ ]/i)
    return match && parseInt(match[1], 10) === APPENDIX_NUMBER
  })
}

const sectionLinkClass =
  "inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-card/80"

export default function Appendix12Page() {
  const pdfFilename = resolvePdfFilename()
  const pdfHref = pdfFilename
    ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(pdfFilename)}`
    : null

  return (
    <PageShell className="py-12">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-slate-950/90 to-blue-950/80 text-white shadow-emerald-900/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-600/10" />
        <div className="relative z-10 px-6 py-14 md:px-10 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Appendix 12</p>
          <h1 className="mt-2 text-4xl font-bold text-balance md:text-5xl">
            Evaluating fidelity and utility of synthetic health data
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Guidance for selecting and reporting evaluation measures that demonstrate how well synthetic data preserves
            source patterns and supports intended analysis.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/steps/3" className={sectionLinkClass}>
              Generate synthetic data (Step 3) <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/resources/appendix7" className={sectionLinkClass}>
              Privacy evaluation (Appendix 7) <Target className="h-4 w-4" aria-hidden="true" />
            </Link>
            {pdfHref && (
              <>
                <a href={pdfHref} target="_blank" rel="noreferrer" className={sectionLinkClass}>
                  Open original PDF <FileText className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href={pdfHref} download className={sectionLinkClass}>
                  Download PDF <Download className="h-4 w-4" aria-hidden="true" />
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mb-12 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Fidelity",
            icon: Target,
            body: "Check how closely synthetic data matches key distributions, relationships, and rare patterns.",
          },
          {
            title: "Utility",
            icon: BarChart3,
            body: "Confirm the dataset supports the analyses, models, or decisions required by the approved use case.",
          },
          {
            title: "Reporting",
            icon: ClipboardCheck,
            body: "Document chosen metrics, thresholds, and limitations for governance review and release decisions.",
          },
        ].map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/10 via-background/95 to-background/80 p-6 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-muted/60 p-3">
                  <Icon className="h-6 w-6 text-emerald-300" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-foreground">{card.title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      <section className="mb-10">
        <div className="rounded-3xl border border-border/60 bg-muted/30 p-8">
          <h2 className="text-xl font-semibold text-foreground">How to use this appendix</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <h3 className="text-base font-semibold text-foreground">Before release</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Define what "good enough" fidelity and utility mean for the approved use case.</li>
                <li>Select metrics that reflect those requirements and document thresholds.</li>
                <li>Report results alongside synthesis parameters and data limitations.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-emerald-200">Pair with privacy checks</h3>
              <p className="mt-3 text-sm text-emerald-100">
                Strong utility does not guarantee safety. Combine fidelity and utility results with privacy evaluation
                methods from Appendix 7 before sharing data.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/resources/appendix7"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Open Appendix 7 <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/resources"
                  className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-card/80"
                >
                  Back to appendices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BackButton />
    </PageShell>
  )
}
