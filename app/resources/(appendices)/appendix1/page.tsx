import fs from "fs"
import path from "path"

import Link from "next/link"
import { ArrowRight, Database, Download, FileText, ShieldCheck, Sparkles, SplitSquareHorizontal } from "lucide-react"

import { PageShell } from "@/components/page-shell"
import { BackButton } from "@/src/components/back-button"

export const dynamic = "force-static"

const APPENDIX_NUMBER = 1
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

export default function Appendix1Page() {
  const pdfFilename = resolvePdfFilename()
  const pdfHref = pdfFilename
    ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(pdfFilename)}`
    : null

  return (
    <PageShell className="py-12">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-slate-950/90 to-blue-950/80 text-white shadow-emerald-900/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-600/10" />
        <div className="relative z-10 px-6 py-14 md:px-10 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Appendix 1</p>
          <h1 className="mt-2 text-4xl font-bold text-balance md:text-5xl">About synthetic health data</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Synthetic data is generated to resemble real health data in structure and statistical properties—without being direct copies of
            individual records. It can enable safer analysis, development, and testing when used within strong governance.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/about" className={sectionLinkClass}>
              Framework overview <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/steps/1" className={sectionLinkClass}>
              Start at Step 1 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/resources/appendix7" className={sectionLinkClass}>
              Privacy evaluation (Appendix 7) <ShieldCheck className="h-4 w-4" aria-hidden="true" />
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
            title: "What it is",
            icon: Sparkles,
            body: "Data generated from a model trained on real records to preserve useful patterns while reducing direct privacy risk.",
          },
          {
            title: "What it’s for",
            icon: SplitSquareHorizontal,
            body: "Education, software testing, interoperability checks, prototyping, and analytics workflows where record-perfect truth isn’t required.",
          },
          {
            title: "What it isn’t",
            icon: Database,
            body: "A drop-in replacement for clinical truth datasets—overfitting and leakage can still occur, and quality/privacy testing remains essential.",
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

      <section className="mb-14">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold text-balance">How synthetic health data is made</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            At a high level, three pieces come together: a source dataset, a generative model, and the resulting synthetic dataset. The goal is to
            emulate statistical properties without recreating real people.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "1) Source dataset",
              body: "Real records used to learn distributions and relationships. Even without direct identifiers, quasi-identifiers and rich event data can make people identifiable in context.",
            },
            {
              title: "2) Generative model",
              body: "Learns patterns from the source data. Model choice and training approach affect both utility (how realistic) and privacy (how much leakage risk).",
            },
            {
              title: "3) Synthetic dataset",
              body: "New records for “synthetic individuals”. If correlations are simplified, privacy improves but some use cases become unsuitable.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">Privacy protection vs data utility</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Preserving more detailed correlations can improve realism and usefulness, but may increase re‑identification risk—especially for rare
              combinations or unique trajectories. Trade-offs must be explicit and justified by the use case.
            </p>
            <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Example</p>
              <p className="mt-2 text-sm text-muted-foreground">
                If a model preserves the overall caesarean rate but not its correlation with sex, you may see implausible records (e.g., caesareans
                for male patients). That can be acceptable for interface training, but unsuitable for clinical hypothesis testing.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-emerald-200">Governance is still required</h3>
            <p className="mt-3 text-sm text-emerald-100">
              Synthetic data can reduce risk, but it doesn’t remove legal obligations by default. Test re‑identification risk and, if it’s more than
              very low, treat outputs as personal information and apply a lawful pathway before use or sharing.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/steps/4"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Re‑identification risk (Step 4) <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/resources/appendix9"
                className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-card/80"
              >
                Lawful pathways (Appendix 9)
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="rounded-3xl border border-border/60 bg-muted/30 p-8">
          <h2 className="text-xl font-semibold text-foreground">Where this fits in the Framework</h2>
          <p className="mt-2 max-w-4xl text-sm text-muted-foreground">
            This appendix provides plain-language context that underpins Steps 1–5, and complements the specialised guidance in Appendices 3, 7, 8,
            and 9.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-4 py-2 font-semibold text-foreground transition hover:bg-card/80"
            >
              Back to appendices
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Explore the Framework <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <BackButton />
    </PageShell>
  )
}

