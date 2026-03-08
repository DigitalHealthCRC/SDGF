import fs from "fs"
import path from "path"

import Link from "next/link"
import { AlertTriangle, ArrowRight, Download, FileText, ShieldCheck, Target, Users } from "lucide-react"

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
  type: "Non-adversarial" | "Adversarial"
  category: string
  method: string
  description: string
}

const techniqueCards = [
  {
    title: "Aggregation and suppression",
    body: "Remove identifiers or overtly identifying fields, or reduce granularity so the data is less easily linkable to a person.",
  },
  {
    title: "Generalisation",
    body: "Replace precise values with broader categories, such as substituting exact dates of birth with age bands.",
  },
  {
    title: "Pseudonymisation",
    body: "Use cryptographically protected transformations such as keyed hashing with appropriate key management rather than plain hashing alone.",
  },
  {
    title: "Perturbation",
    body: "Introduce controlled change through noise addition, micro-aggregation, or data swapping to reduce disclosure risk.",
  },
]

const riskCards = [
  {
    title: "Identity disclosure",
    body: "A synthetic record can be confidently linked to a specific person. Direct identifiers should already be removed, but residual linkability can still matter.",
  },
  {
    title: "Membership disclosure",
    body: "An adversary can infer whether a specific person was included in the training dataset, which can itself be highly sensitive.",
  },
  {
    title: "Attribute disclosure",
    body: "An adversary can infer new sensitive information about an individual using synthetic data plus auxiliary knowledge they already hold.",
  },
]

const metrics: MetricRow[] = [
  {
    type: "Non-adversarial",
    category: "Re-identifiability",
    method: "k-Anonymity",
    description: "Checks whether each individual is indistinguishable from at least k - 1 other individuals against a set of quasi-identifiers.",
  },
  {
    type: "Non-adversarial",
    category: "Re-identifiability",
    method: "l-Diversity",
    description: "Extends k-anonymity by ensuring sensitive attributes within each anonymised group have at least l distinct values.",
  },
  {
    type: "Non-adversarial",
    category: "Re-identifiability",
    method: "t-Closeness",
    description: "Requires the distribution of a sensitive attribute in a group to remain close to the overall dataset distribution.",
  },
  {
    type: "Non-adversarial",
    category: "Memorisation and similarity",
    method: "Hitting Rate (Common Row Proportion)",
    description: "Measures the percentage of exact matching rows between the synthetic and source data.",
  },
  {
    type: "Non-adversarial",
    category: "Memorisation and similarity",
    method: "Close Value Ratio",
    description: "Assesses the probability of near matches using a distance threshold.",
  },
  {
    type: "Non-adversarial",
    category: "Memorisation and similarity",
    method: "Similarity Ratio (epsilon-identifiability)",
    description: "Tests whether fewer than an epsilon ratio of synthetic observations are similar enough to those in the original dataset.",
  },
  {
    type: "Non-adversarial",
    category: "Memorisation and similarity",
    method: "Nearest Neighbour Accuracy",
    description: "Evaluates proximity between source and synthetic distributions, but should be interpreted cautiously because similarity-based metrics can miss serious leakage.",
  },
  {
    type: "Non-adversarial",
    category: "Distinguishability",
    method: "Data Likelihood",
    description: "Measures the likelihood of synthetic data belonging to the source data distribution.",
  },
  {
    type: "Non-adversarial",
    category: "Distinguishability",
    method: "Detection Rate",
    description: "Measures how easily models can distinguish source data from synthetic data.",
  },
  {
    type: "Adversarial",
    category: "Singling out attacks",
    method: "Singling Out Attack (Univariate)",
    description: "Observes the uniqueness of a single attribute in the synthetic data.",
  },
  {
    type: "Adversarial",
    category: "Singling out attacks",
    method: "Singling Out Attack (Multivariate)",
    description: "Examines uniqueness across combinations of attributes.",
  },
  {
    type: "Adversarial",
    category: "Record linkage attacks",
    method: "Public-Public Linkage",
    description: "Uses the synthetic dataset to establish links between records found in two external datasets.",
  },
  {
    type: "Adversarial",
    category: "Record linkage attacks",
    method: "Public-Synthetic Linkage",
    description: "Links synthetic rows to an external dataset using matching criteria, creating a basis for inference attacks.",
  },
  {
    type: "Adversarial",
    category: "Attribute inference attacks",
    method: "Exact Match AIA",
    description: "Determines a missing target attribute by matching overlapping quasi-identifiers.",
  },
  {
    type: "Adversarial",
    category: "Attribute inference attacks",
    method: "Closest Distance AIA",
    description: "Infers a sensitive value using the nearest synthetic neighbour where k = 1.",
  },
  {
    type: "Adversarial",
    category: "Attribute inference attacks",
    method: "Nearest Neighbours AIA",
    description: "Uses the k nearest synthetic neighbours where k is greater than 1.",
  },
  {
    type: "Adversarial",
    category: "Attribute inference attacks",
    method: "ML Inference AIA",
    description: "Trains a predictive model on synthetic data to infer target attributes.",
  },
  {
    type: "Adversarial",
    category: "Membership inference attacks",
    method: "Closest Distance MIA",
    description: "Infers membership if a target record is more similar to synthetic data than to unrelated data.",
  },
  {
    type: "Adversarial",
    category: "Membership inference attacks",
    method: "Nearest Neighbours MIA",
    description: "Extends the closest-distance approach to proximity against multiple neighbours, but still inherits the limits of similarity-based methods.",
  },
  {
    type: "Adversarial",
    category: "Membership inference attacks",
    method: "Probability Estimation MIA",
    description: "Uses hypothesis testing to assess whether a target record belongs to the synthetic data distribution.",
  },
  {
    type: "Adversarial",
    category: "Membership inference attacks",
    method: "MIA Shadow Model",
    description: "Uses shadow models trained with and without the target record to classify membership.",
  },
]

const practicalGuidance = [
  "Base evaluations on realistic quasi-identifiers that reflect likely adversary knowledge.",
  "Evaluate the entire dataset rather than only a pre-selected subset of records.",
  "Assess both membership disclosure and attribute disclosure, not just one attack surface.",
  "Empirically validate Differential Privacy claims, especially when the privacy budget is not close to zero.",
  "Report results across multiple synthetic data generation runs and keep worst-case outcomes visible.",
]

const futureDirections = [
  "Better empirical privacy metrics that capture worst-case rather than average-case risk.",
  "More practical, automated, and reproducible privacy auditing tools.",
  "Clearer interpretation of epsilon and delta in operational settings.",
  "Better handling of cumulative privacy loss across repeated synthetic data releases.",
  "Stronger methods for time-series, longitudinal data, free text, and other complex data types.",
]

const sectionLinkClass =
  "inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-card/80"

export default function Appendix7Page() {
  const pdfFilename = resolvePdfFilename()
  const pdfHref = pdfFilename
    ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(pdfFilename)}`
    : null

  return (
    <PageShell className="py-12">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-slate-950/90 to-cyan-950/80 text-white shadow-emerald-900/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-600/10" />
        <div className="relative z-10 px-6 py-14 md:px-10 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Appendix 7</p>
          <h1 className="mt-2 text-4xl font-bold text-balance md:text-5xl">
            De-identification techniques and privacy evaluation in synthetic data
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Updated guidance for reducing linkability, understanding disclosure risks, and evaluating synthetic data privacy using a portfolio of evidence rather than a single score.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/steps/4" className={sectionLinkClass}>
              Use in Step 4 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="#metrics" className={sectionLinkClass}>
              Evaluation metrics <Target className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="#auditing" className={sectionLinkClass}>
              Auditing and DP <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </Link>
            {pdfHref && (
              <>
                <a href={pdfHref} target="_blank" rel="noreferrer" className={sectionLinkClass}>
                  Open source PDF <FileText className="h-4 w-4" aria-hidden="true" />
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
            title: "De-identification is not binary",
            icon: ShieldCheck,
            body: "The appendix treats de-identification as a risk-management exercise. Stronger privacy controls generally reduce utility, so the trade-off must be documented and justified.",
          },
          {
            title: "Privacy risk is multi-dimensional",
            icon: Target,
            body: "Identity, membership, and attribute disclosure can each arise in different ways. Evaluating only one of them is not enough.",
          },
          {
            title: "Built for governance teams",
            icon: Users,
            body: "Use this appendix when custodians, requestors, scientists, and reviewers are documenting Step 4 decisions and supporting a Re-identification Risk Assessment.",
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
          <h2 className="text-3xl font-bold text-balance">De-identification techniques</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            De-identification refers to technical and organisational approaches that reduce the likelihood that data can be associated with an identifiable person. Even without direct identifiers, data may still be personal information if it remains reasonably linkable.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {techniqueCards.map((technique) => (
            <div
              key={technique.title}
              className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm transition hover:border-primary"
            >
              <h3 className="text-base font-semibold text-foreground">{technique.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{technique.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold text-balance">Types of privacy risk</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            The appendix distinguishes among multiple disclosure risks. Real privacy assessment needs to account for all of them, not just direct re-identification.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {riskCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="metrics" className="mb-14 scroll-mt-24">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold text-balance">Landscape of evaluation metrics</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            No single measure defines privacy safety. These methods should be read as lenses on risk, not bounded guarantees of privacy loss.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-6 py-4">
            <p className="text-sm font-semibold text-foreground">Categories of privacy metrics</p>
            <p className="text-xs text-muted-foreground">Use multiple methods aligned to a realistic threat model.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted/40 text-foreground">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">What it tells you</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {metrics.map((row) => (
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
      </section>

      <section className="mb-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-amber-500/15 p-3">
              <AlertTriangle className="h-6 w-6 text-amber-300" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-balance">Limitations of common metrics</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Similarity-based metrics and average-case scores are useful for finding some problems, but they are poor proof of safety. Privacy is a worst-case question focused on whether any individual is exposed.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
              <h3 className="text-base font-semibold text-foreground">Similarity-based metrics</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Measures such as nearest-neighbour similarity are intuitive, but research has shown they can miss serious privacy leakage and do not provide bounded privacy guarantees.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/80 p-5">
              <h3 className="text-base font-semibold text-foreground">Average-case metrics like F1</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                Aggregate scores can hide a small group of highly vulnerable people. A high F1 score clearly signals a privacy failure, but a low score does not prove safety.
              </p>
            </div>
          </div>
        </div>

        <div id="auditing" className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-background/95 to-background/80 p-8 shadow-sm scroll-mt-24">
          <h2 className="text-2xl font-bold text-balance">Differential Privacy and auditing</h2>
          <div className="mt-5 space-y-5">
            <div>
              <h3 className="text-base font-semibold text-foreground">Differential Privacy</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Differential Privacy is a property of the generation process, not the output dataset. Pure epsilon-DP is the strictest form, while approximate (epsilon, delta)-DP allows a small failure probability. Smaller epsilon values give stronger protection.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Audit claims empirically</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Real-world implementations can fail because of design flaws, incorrect assumptions, or bugs. Empirical auditing is still required even when a generator claims formal privacy guarantees.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Canary-based auditing</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Inject carefully constructed artificial records into training data, train the generator, then test whether those canaries are detectable or reconstructable in the output. Detectable canaries are concrete evidence of memorisation or leakage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold text-balance">Practical considerations for privacy evaluation</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            The framework text emphasises context-aware evaluation and transparent reporting rather than a single mechanical checklist.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {practicalGuidance.map((item, index) => (
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
          <h2 className="text-xl font-semibold text-foreground">Future directions and open challenges</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {futureDirections.map((item) => (
              <li key={item} className="rounded-2xl border border-border/60 bg-card/70 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            The appendix concludes that privacy evaluation is not optional. Responsible practice depends on realistic threat modelling, transparent assumptions, empirical auditing, and a portfolio of complementary evidence to understand and manage residual risk.
          </p>

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
