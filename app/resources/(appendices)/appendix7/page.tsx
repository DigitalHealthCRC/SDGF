import fs from "fs"
import path from "path"

import Link from "next/link"
import { ArrowRight, Download, FileText, ShieldCheck, Sparkles, Target, Users } from "lucide-react"

import { PageShell } from "@/components/page-shell"
import { BackButton } from "@/src/components/back-button"

export const dynamic = "force-static"

const APPENDIX_NUMBER = 7
const PDF_DIR = path.join(process.cwd(), "public/appendices_pdf")

const resolvePdfFilename = () => {
  if (!fs.existsSync(PDF_DIR)) return undefined
  const pdfFiles = fs.readdirSync(PDF_DIR)

  return pdfFiles.find((pdf) => {
    const match = pdf.match(/APPENDIX\s+(\d+)[_ ]/i)
    return match && parseInt(match[1], 10) === APPENDIX_NUMBER
  })
}

type MetricRow = {
  category: string
  method: string
  description: string
  type: "Non-adversarial" | "Adversarial"
}

const metrics: MetricRow[] = [
  {
    type: "Non-adversarial",
    category: "Re-identifiability",
    method: "k‑Anonymity",
    description: "Each record is indistinguishable from at least k−1 others on quasi-identifiers.",
  },
  {
    type: "Non-adversarial",
    category: "Re-identifiability",
    method: "l‑Diversity",
    description: "Each equivalence class contains at least l distinct sensitive values.",
  },
  {
    type: "Non-adversarial",
    category: "Re-identifiability",
    method: "t‑Closeness",
    description: "Sensitive attribute distribution within a class stays close to the overall distribution.",
  },
  {
    type: "Non-adversarial",
    category: "Memorisation",
    method: "Hitting rate / common rows",
    description: "Exact overlap between synthetic and source records (direct leakage signal).",
  },
  {
    type: "Non-adversarial",
    category: "Memorisation",
    method: "Close value ratio",
    description: "Near-matches within a distance threshold (captures ‘blurry’ memorisation).",
  },
  {
    type: "Non-adversarial",
    category: "Distinguishability",
    method: "Classifier / two-sample tests",
    description: "Whether a model can distinguish real vs synthetic beyond chance (utility–privacy signal).",
  },
  {
    type: "Adversarial",
    category: "Membership disclosure",
    method: "Membership inference attack (MIA)",
    description: "Attacker estimates whether an individual’s record was in the training data.",
  },
  {
    type: "Adversarial",
    category: "Attribute disclosure",
    method: "Attribute inference attack (AIA)",
    description: "Attacker infers sensitive attributes for a target using quasi-identifiers and synthetic data.",
  },
]

const recommendations = [
  "Base evaluations on quasi-identifiers (QIs).",
  "Evaluate all records (not just samples).",
  "Avoid stand‑alone similarity metrics for privacy claims.",
  "Align membership disclosure tests to an explicit threat model.",
  "Report prevalence‑adjusted scores and naive baselines.",
  "Limit attribute disclosure claims to members when applicable.",
  "Use non‑member baselines for comparison.",
  "Apply dual thresholds (absolute + relative) for decisions.",
  "Validate differential privacy empirically where used.",
  "Report stochastic variation across multiple synthetic datasets.",
]

const techniqueCards = [
  {
    title: "Aggregation",
    body: "Reduce granularity by summarising values (e.g., counts, bands, regional roll-ups).",
  },
  {
    title: "Suppression",
    body: "Remove direct identifiers or high-risk values/records when they cannot be safely generalised.",
  },
  {
    title: "Generalisation",
    body: "Replace precise values with coarser categories (e.g., date of birth → age band).",
  },
  {
    title: "Pseudonymisation",
    body: "Transform identifiers (SLKs, hashing, encryption) while recognising residual linkage risk.",
  },
  {
    title: "Perturbation",
    body: "Introduce controlled noise or swapping/micro-aggregation to reduce singling-out.",
  },
]

const sectionLinkClass =
  "inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-card/80"

export default function Appendix7Page() {
  const pdfFilename = resolvePdfFilename()
  const pdfHref = pdfFilename
    ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(pdfFilename)}`
    : null

  const nonAdversarial = metrics.filter((row) => row.type === "Non-adversarial")
  const adversarial = metrics.filter((row) => row.type === "Adversarial")

  return (
    <PageShell className="py-12">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-slate-950/90 to-blue-950/80 text-white shadow-emerald-900/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-600/10" />
        <div className="relative z-10 px-6 py-14 md:px-10 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Appendix 7</p>
          <h1 className="mt-2 text-4xl font-bold text-balance md:text-5xl">
            De‑identification techniques and privacy evaluation
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Practical guidance for reducing re‑identification risk and selecting privacy evaluation methods for synthetic health data.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/steps/4" className={sectionLinkClass}>
              Use in Step 4 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="#metrics" className={sectionLinkClass}>
              Privacy metrics <Target className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="#recommendations" className={sectionLinkClass}>
              Recommendations <Sparkles className="h-4 w-4" aria-hidden="true" />
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
            title: "What de‑identification does",
            icon: ShieldCheck,
            body: "Break the link between a dataset and a real person so disclosed facts can’t be reasonably linked back to an identified individual.",
          },
          {
            title: "Why privacy evaluation matters",
            icon: Target,
            body: "Synthetic data can still leak membership or attributes when models overfit or preserve rare patterns; evaluation validates residual risk.",
          },
          {
            title: "Who this is for",
            icon: Users,
            body: "Data custodians, requestors, scientists, and governance reviewers documenting a re‑identification risk assessment.",
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
          <h2 className="text-3xl font-bold text-balance">De‑identification techniques</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            De‑identification is a risk management exercise: stronger privacy protection generally reduces data utility.
            Effectiveness depends on data type, context, and plausible re‑identification threats.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {techniqueCards.map((technique) => (
            <div
              key={technique.title}
              className="h-full rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm transition hover:border-primary"
            >
              <h3 className="text-base font-semibold text-foreground">{technique.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{technique.body}</p>
            </div>
          ))}
          <div className="h-full rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-emerald-200">Robustness checks</h3>
            <p className="mt-3 text-sm text-emerald-100">
              Test for both directions of re‑identification risk: matching a person to data and matching data to a person.
              Document assumptions about attacker knowledge and auxiliary data.
            </p>
          </div>
        </div>
      </section>

      <section id="metrics" className="mb-14 scroll-mt-24">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold text-balance">Privacy evaluation in synthetic data</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            No single score defines “privacy safe”. Use multiple metrics aligned to the threat model and interpret results in context.
            This table summarises commonly used families of privacy evaluation methods.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-6 py-4">
            <p className="text-sm font-semibold text-foreground">Table: categories of privacy metrics</p>
            <p className="text-xs text-muted-foreground">Non‑adversarial methods focus on similarity/overlap; adversarial methods simulate attacks.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted/40 text-foreground">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Method / Metric</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">What it tells you</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[...nonAdversarial, ...adversarial].map((row) => (
                  <tr key={`${row.type}-${row.category}-${row.method}`} className="hover:bg-muted/20">
                    <td className="whitespace-nowrap px-6 py-4 align-top">
                      <span
                        className={
                          row.type === "Adversarial"
                            ? "inline-flex rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-semibold text-rose-200"
                            : "inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-200"
                        }
                      >
                        {row.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 align-top font-medium text-foreground">{row.category}</td>
                    <td className="px-6 py-4 align-top text-foreground">{row.method}</td>
                    <td className="px-6 py-4 align-top text-muted-foreground">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
            <h3 className="text-base font-semibold text-foreground">Threat-model reminders</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Define attacker knowledge and access (e.g., quasi-identifiers, auxiliary datasets).</li>
              <li>Separate membership, identity, and attribute disclosure risks.</li>
              <li>Report baselines and decision thresholds used for governance sign-off.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6">
            <h3 className="text-base font-semibold text-emerald-200">Differential privacy (DP)</h3>
            <p className="mt-3 text-sm text-emerald-100">
              DP provides guarantees about the synthesis process, not a blanket guarantee about every dataset.
              If DP is used, document the privacy budget (ε) and validate empirical privacy risk with tests.
            </p>
          </div>
        </div>
      </section>

      <section id="recommendations" className="mb-14 scroll-mt-24">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold text-balance">Consensus-based recommendations</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            Practical recommendations for reporting and decision-making during re‑identification risk assessments.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((item, index) => (
            <div
              key={item}
              className="rounded-2xl border border-border/60 bg-gradient-to-br from-chart-2/10 via-background/95 to-background/80 p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-200">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-foreground">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="rounded-3xl border border-border/60 bg-muted/30 p-8">
          <h2 className="text-xl font-semibold text-foreground">Using this appendix in practice</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <h3 className="text-base font-semibold text-foreground">Membership disclosure evaluation</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Define threat model and attacker access.</li>
                <li>Compute a naive baseline (random guessing / prevalence).</li>
                <li>Report F1 (or equivalent) against baseline and thresholds.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <h3 className="text-base font-semibold text-foreground">Attribute disclosure evaluation</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Select quasi-identifiers that reflect realistic auxiliary information.</li>
                <li>Use non-member baselines when measuring disclosure risk.</li>
                <li>Apply dual thresholds (absolute + relative) for decisions.</li>
              </ul>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/steps/4"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Go to Step 4 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-4 py-2 font-semibold text-foreground transition hover:bg-card/80"
            >
              Back to appendices
            </Link>
          </div>
        </div>
      </section>

      <BackButton />
    </PageShell>
  )
}

