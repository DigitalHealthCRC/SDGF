import fs from "fs"
import path from "path"

import Link from "next/link"
import {
  ArrowRight,
  ClipboardCheck,
  Download,
  FileText,
  Gavel,
  GitMerge,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Waypoints,
} from "lucide-react"

import { PageShell } from "@/components/page-shell"
import { BackButton } from "@/src/components/back-button"

export const dynamic = "force-static"

const APPENDIX_NUMBER = 9
const PDF_DIR = path.join(process.cwd(), "public/appendices_pdf")

const resolvePdfFilename = () => {
  if (!fs.existsSync(PDF_DIR)) return undefined
  const pdfFiles = fs.readdirSync(PDF_DIR)

  return pdfFiles.find((pdf) => {
    const match = pdf.match(/APPENDIX\s+(\d+)[_ ]/i)
    return match && parseInt(match[1], 10) === APPENDIX_NUMBER
  })
}

type Pathway = {
  title: string
  summary: string
  whenToUse: string[]
  commonEvidence: string[]
  caution: string
}

const pathways: Pathway[] = [
  {
    title: "Directly related + within reasonable expectations",
    summary:
      "Some privacy regimes allow secondary use/disclosure if it’s directly related to the primary purpose and within what individuals would reasonably expect.",
    whenToUse: [
      "The use case has a clear public benefit linked to health services.",
      "Your organisation’s collection notices and practice make this expectation plausible.",
      "The project’s data handling stays proportionate and tightly governed.",
    ],
    commonEvidence: [
      "Collection notices / privacy statements",
      "Use case assessment and public benefit justification",
      "Internal approvals and governance sign-off",
    ],
    caution: "This is highly context-dependent—if expectation isn’t well established, use another pathway.",
  },
  {
    title: "Consent",
    summary: "Use/disclose personal information where valid consent is obtained (voluntary, informed, specific, current, and capable).",
    whenToUse: [
      "You can practically obtain consent from the relevant cohort.",
      "Consent can clearly cover purpose and participating organisations.",
      "You can operationalise withdrawal, record-keeping, and versioning.",
    ],
    commonEvidence: ["Consent wording and participant information", "Consent register / audit trail", "Withdrawal management process"],
    caution: "Often infeasible at scale for historic collections; don’t assume implied consent is sufficient.",
  },
  {
    title: "Ethics approval (HREC) for research / health service management",
    summary:
      "Many regimes permit secondary use/disclosure for research or management of health services, often with Human Research Ethics Committee approval and potentially a waiver of consent.",
    whenToUse: [
      "The project is research or health-service-management oriented.",
      "Multiple parties or jurisdictions are involved (consider a nationally certified HREC).",
      "Synthetic outputs may still be personal information due to residual re-identification risk.",
    ],
    commonEvidence: ["HREC approval letter (and any waiver conditions)", "Protocol + data flow diagrams", "Privacy Impact Assessment (PIA)"],
    caution: "HREC approvals are conditional—match data flows and controls to what was approved.",
  },
  {
    title: "Required or authorised by law",
    summary:
      "Use/disclose where another law clearly requires it (mandatory) or authorises it (permitted) within a defined scope.",
    whenToUse: [
      "You can point to a clear legal authority tied to organisational functions or a data-sharing statute.",
      "The activity sits within the scope and conditions of that authority.",
      "You can document interpretation and controls for the authorised sharing.",
    ],
    commonEvidence: ["Citation of the enabling provision", "Legal advice or internal legal memo", "Information sharing agreement / DSA/DUA"],
    caution: "“Not prohibited” is not the same as “authorised”—the authority must be clear and direct.",
  },
  {
    title: "Effectively de-identified (very low re-identification risk)",
    summary:
      "If data is de-identified so identity is not apparent and cannot reasonably be ascertained in context, it may fall outside personal information in many regimes.",
    whenToUse: [
      "Re-identification risk is demonstrably very low in the intended release environment.",
      "You’ve assessed auxiliary data and attacker knowledge assumptions.",
      "You can control downstream context changes (or reassess when they occur).",
    ],
    commonEvidence: ["Re-identification risk assessment results (Step 4)", "Release context description and controls", "Ongoing monitoring / reassessment triggers"],
    caution: "Risk is contextual and can change—what’s safe in a secure enclave may not be safe for public release.",
  },
  {
    title: "Other exceptions and directions",
    summary:
      "Some jurisdictions include additional mechanisms (e.g., codes of practice, public interest directions) that can enable specific secondary uses/disclosures.",
    whenToUse: [
      "A specific exception is available and applicable in your jurisdiction.",
      "Conditions can be satisfied and independently verified.",
      "Governance can enforce the permitted scope over time.",
    ],
    commonEvidence: ["Copy of the direction/code and applicability assessment", "Governance approvals", "Contractual + technical controls"],
    caution: "These are jurisdiction-specific and can be narrow—confirm applicability before relying on them.",
  },
]

const sectionLinkClass =
  "inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-card/80"

export default function Appendix9Page() {
  const pdfFilename = resolvePdfFilename()
  const pdfHref = pdfFilename
    ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(pdfFilename)}`
    : null

  return (
    <PageShell className="py-12">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-slate-950/90 to-blue-950/80 text-white shadow-emerald-900/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-600/10" />
        <div className="relative z-10 px-6 py-14 md:px-10 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Appendix 9</p>
          <h1 className="mt-2 text-4xl font-bold text-balance md:text-5xl">The lawful pathways explained</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            When synthetic outputs have more than very low re‑identification risk, treat them as personal information and rely on an appropriate
            lawful pathway before use or sharing.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/resources/appendix3" className={sectionLinkClass}>
              Policy context (Appendix 3) <Scale className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/resources/appendix8" className={sectionLinkClass}>
              Decision tree (Appendix 8) <Waypoints className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/steps/4" className={sectionLinkClass}>
              Re‑identification risk (Step 4) <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="#pathways" className={sectionLinkClass}>
              Pathways summary <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
            title: "Why a pathway is needed",
            icon: Gavel,
            body: "Using health data to generate synthetic outputs is typically a secondary purpose under privacy principles and needs an exception/permission.",
          },
          {
            title: "Two stages can apply",
            icon: GitMerge,
            body: "You need a lawful basis for handling source data (always personal information) and also for synthetic outputs if they remain personal information.",
          },
          {
            title: "Document the decision",
            icon: ClipboardCheck,
            body: "Record the chosen pathway, assumptions, approvals, conditions, and controls so reviewers can audit the end-to-end data flow.",
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
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-muted/60 p-3">
              <ShieldAlert className="h-6 w-6 text-amber-200" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Not legal advice</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                This page is a governance-friendly summary. Confirm which privacy law(s) apply and which exception/pathway is valid for your
                organisation and dataset (especially across jurisdictions).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pathways" className="mb-14 scroll-mt-24">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold text-balance">Common lawful pathways</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            Use the decision tree for complex scenarios, then select and document one (or more) pathways that cover the full data flow.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {pathways.map((pathway) => (
            <div
              key={pathway.title}
              className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm transition hover:border-primary"
            >
              <h3 className="text-lg font-semibold text-foreground">{pathway.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{pathway.summary}</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground">When it fits</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {pathway.whenToUse.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Typical evidence</p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {pathway.commonEvidence.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-100">
                  <span className="font-semibold text-emerald-200">Caution:</span> {pathway.caution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="rounded-3xl border border-border/60 bg-muted/30 p-8">
          <h2 className="text-xl font-semibold text-foreground">Quick checklist for governance packs</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <h3 className="text-base font-semibold text-foreground">Minimum inclusions</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Law(s) applying and the selected lawful pathway(s)</li>
                <li>Project purpose and why it’s a secondary purpose</li>
                <li>Data flow diagram (who handles what, where, and when)</li>
                <li>Approvals/conditions (HREC, delegated authority, legal basis)</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <h3 className="text-base font-semibold text-foreground">Controls & assurance</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Re-identification risk results and release context</li>
                <li>Technical controls (access, logging, secure enclaves)</li>
                <li>Contractual controls (DSA/DUA, no re-identification clauses)</li>
                <li>Reassessment triggers (context changes, new auxiliary data)</li>
              </ul>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/resources/appendix8"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Use the decision tree <ArrowRight className="h-4 w-4" aria-hidden="true" />
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

