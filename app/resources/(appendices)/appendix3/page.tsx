import fs from "fs"
import path from "path"

import Link from "next/link"
import { ArrowRight, Download, FileText, Gavel, Scale, ShieldCheck, Waypoints } from "lucide-react"

import { PageShell } from "@/components/page-shell"
import { BackButton } from "@/src/components/back-button"

export const dynamic = "force-static"

const APPENDIX_NUMBER = 3
const PDF_DIR = path.join(process.cwd(), "public/appendices_pdf")

const resolvePdfFilename = () => {
  if (!fs.existsSync(PDF_DIR)) return undefined
  const pdfFiles = fs.readdirSync(PDF_DIR)

  return pdfFiles.find((pdf) => {
    const match = pdf.match(/APPENDIX\s+(\d+)[_ ]/i)
    return match && parseInt(match[1], 10) === APPENDIX_NUMBER
  })
}

type LawRow = {
  jurisdiction: string
  instrument: string
  appliesTo: string
  notes: string
}

const lawRows: LawRow[] = [
  {
    jurisdiction: "Commonwealth",
    instrument: "Privacy Act 1988 (Cth) + Australian Privacy Principles (APPs)",
    appliesTo: "Commonwealth agencies and many private/NGO health service providers",
    notes: "Sets baseline principles for collection, use, disclosure, security, access and correction.",
  },
  {
    jurisdiction: "ACT",
    instrument: "Information Privacy Act 2014 (ACT) + Territory Privacy Principles (TPPs)",
    appliesTo: "ACT public sector agencies",
    notes: "Public-sector privacy framework; health information may also be regulated separately.",
  },
  {
    jurisdiction: "ACT",
    instrument: "Health Records (Privacy and Access) Act 1997 (ACT)",
    appliesTo: "Public and private health service providers (health information)",
    notes: "Health-specific privacy obligations and access rights.",
  },
  {
    jurisdiction: "NSW",
    instrument: "Privacy and Personal Information Protection Act 1998 (NSW) + IPPs",
    appliesTo: "NSW public sector agencies",
    notes: "General personal information principles for NSW agencies.",
  },
  {
    jurisdiction: "NSW",
    instrument: "Health Records and Information Privacy Act 2002 (NSW) + HPPs",
    appliesTo: "NSW public + private sector health service providers (health information)",
    notes: "Health information rules can apply even when the federal APPs also apply.",
  },
  {
    jurisdiction: "NT",
    instrument: "Information Act 2002 (NT) + NT IPPs",
    appliesTo: "NT public sector agencies",
    notes: "Includes information privacy principles for government handling of personal information.",
  },
  {
    jurisdiction: "QLD",
    instrument: "Information Privacy Act 2009 (QLD) + QPPs",
    appliesTo: "Queensland government agencies",
    notes: "Queensland privacy principles for public sector handling and disclosure.",
  },
  {
    jurisdiction: "SA",
    instrument: "Premier & Cabinet Circular 12 – Information Privacy Principles Instruction",
    appliesTo: "South Australian public sector agencies (policy-based)",
    notes: "No dedicated privacy statute; mandatory instruction establishes binding principles.",
  },
  {
    jurisdiction: "TAS",
    instrument: "Personal Information Protection Act 2004 (Tas) + PIPPs",
    appliesTo: "Tasmanian public sector agencies",
    notes: "Public-sector privacy obligations for personal information handling.",
  },
  {
    jurisdiction: "VIC",
    instrument: "Privacy and Data Protection Act 2014 (Vic) + IPPs",
    appliesTo: "Victorian public sector organisations",
    notes: "General personal information handling obligations for Victorian public sector.",
  },
  {
    jurisdiction: "VIC",
    instrument: "Health Records Act 2001 (Vic) + HPPs",
    appliesTo: "Public and private health service providers (health information)",
    notes: "Health-specific principles often apply alongside other governance requirements.",
  },
  {
    jurisdiction: "WA",
    instrument: "Privacy and Responsible Information Sharing Act 2024 (WA)",
    appliesTo: "WA public sector organisations (commencement expected 2026)",
    notes: "Introduces comprehensive privacy obligations and a responsible information sharing framework.",
  },
]

const sectionLinkClass =
  "inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-card/80"

export default function Appendix3Page() {
  const pdfFilename = resolvePdfFilename()
  const pdfHref = pdfFilename
    ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(pdfFilename)}`
    : null

  return (
    <PageShell className="py-12">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-slate-950/90 to-blue-950/80 text-white shadow-emerald-900/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-600/10" />
        <div className="relative z-10 px-6 py-14 md:px-10 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Appendix 3</p>
          <h1 className="mt-2 text-4xl font-bold text-balance md:text-5xl">Policy and legal framework</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Synthetic health data projects still require a lawful basis. This appendix summarises the Australian privacy “patchwork” and how
            to use it to guide approvals, governance, and safe sharing decisions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/resources/appendix9" className={sectionLinkClass}>
              Lawful pathways (Appendix 9) <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/resources/appendix8" className={sectionLinkClass}>
              Decision tree (Appendix 8) <Waypoints className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/steps/5" className={sectionLinkClass}>
              Residual risk controls (Step 5) <ShieldCheck className="h-4 w-4" aria-hidden="true" />
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
            title: "Australia is a patchwork",
            icon: Scale,
            body: "Different privacy laws can apply to the same project depending on organisation type, location, and the kind of information handled.",
          },
          {
            title: "Principles drive decisions",
            icon: ShieldCheck,
            body: "Most regimes include principles covering collection, use, disclosure, security, quality, and access/correction. Disclosure is usually restricted unless an exception applies.",
          },
          {
            title: "Governance remains required",
            icon: Gavel,
            body: "Even when you believe data is de‑identified, document assumptions, approvals, ethics considerations, and residual risks before using or sharing outputs.",
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
          <h2 className="text-3xl font-bold text-balance">How to use this appendix</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            Use this as a quick orientation guide, then move to Appendix 9 for lawful pathways and Appendix 8 when a request is complex or
            uncertain.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">Practical workflow</h3>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Identify which privacy law(s) apply to your organisation and dataset.</li>
              <li>Determine whether remaining re‑identification risk is more than “very low”.</li>
              <li>Select a lawful pathway for use/disclosure and document approvals.</li>
              <li>Apply technical, contractual, and operational controls for residual risk.</li>
            </ol>
          </div>

          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-emerald-200">Important rule of thumb</h3>
            <p className="mt-3 text-sm text-emerald-100">
              If re‑identification risk remains more than very low, treat the synthetic data as personal information and use an appropriate
              lawful pathway before use or sharing.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/resources/appendix9"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Go to lawful pathways <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/steps/4"
                className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-card/80"
              >
                Re‑identification risk (Step 4)
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <div className="mb-6 space-y-2">
          <h2 className="text-3xl font-bold text-balance">Privacy laws commonly encountered</h2>
          <p className="max-w-4xl text-base text-muted-foreground">
            This is a governance-oriented summary (not legal advice). Confirm applicability with your organisation’s privacy office or legal
            team for your specific context and data flows.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-sm">
          <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
            <p className="text-sm font-semibold text-foreground">Table: laws and where they typically apply</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-sm">
              <thead>
                <tr className="bg-muted/40 text-foreground">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Jurisdiction</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Instrument</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Applies to</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {lawRows.map((row) => (
                  <tr key={`${row.jurisdiction}-${row.instrument}`} className="hover:bg-muted/20">
                    <td className="whitespace-nowrap px-6 py-4 align-top font-medium text-foreground">{row.jurisdiction}</td>
                    <td className="px-6 py-4 align-top text-foreground">{row.instrument}</td>
                    <td className="px-6 py-4 align-top text-muted-foreground">{row.appliesTo}</td>
                    <td className="px-6 py-4 align-top text-muted-foreground">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="rounded-3xl border border-border/60 bg-muted/30 p-8">
          <h2 className="text-xl font-semibold text-foreground">Next steps</h2>
          <p className="mt-2 max-w-4xl text-sm text-muted-foreground">
            When you know which law applies, move to lawful pathways and document the specific approval route, consent/authority, and any ethics
            requirements for your organisation and dataset.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/resources/appendix9"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Open Appendix 9 <ArrowRight className="h-4 w-4" aria-hidden="true" />
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

