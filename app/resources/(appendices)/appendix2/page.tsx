"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Download, FileText, Search } from "lucide-react"

import { PageShell } from "@/components/page-shell"
import { Input } from "@/components/ui/input"
import { BackButton } from "@/src/components/back-button"

const PDF_FILENAME = "APPENDIX 2_ Glossary.pdf"

type GlossaryTerm = {
  term: string
  definition: string
}

const terms: GlossaryTerm[] = [
  {
    term: "Accountable decision-maker",
    definition:
      "Usually the Data Sponsor (Executive Director level) or their delegate, or the Data Custodian. For complex data use and sharing proposals it may be a Chief Executive or a Deputy Secretary.",
  },
  { term: "Aggregated data", definition: "Data produced by grouping information into categories, typically with a combined count within each category." },
  { term: "API", definition: "Application Programming Interface." },
  { term: "APPs", definition: "Australian Privacy Principles, found in the Privacy Act." },
  { term: "Attribute disclosure", definition: "When new facts can be learned or inferred about an individual from a dataset." },
  { term: "Collection", definition: "A “collection” occurs when information comes into the possession or control of an organisation." },
  {
    term: "Confidentiality Undertaking",
    definition:
      "A document containing undertakings made by a data recipient regarding the handling of shared data; may be required before data sharing.",
  },
  {
    term: "Data",
    definition:
      "Facts, statistics, instructions, concepts or other information able to be communicated, analysed or processed. May include or exclude personal, health or special category information.",
  },
  {
    term: "Data asset or dataset",
    definition:
      "A body of information managed as a single unit, recognised as valuable and enabling an organisation to perform its functions.",
  },
  {
    term: "Data breach",
    definition:
      "Loss, unauthorised access, or unauthorised disclosure of personal information. A breach is “notifiable” if likely to result in serious harm.",
  },
  {
    term: "Data Custodian",
    definition:
      "Makes decisions about management, access and release of a data asset, including quality and registration or cataloguing.",
  },
  { term: "Data fidelity", definition: "A measure of the accuracy, completeness, reliability and consistency of data in representing real-world subjects." },
  { term: "Data masking", definition: "Modifying, obscuring or replacing original data for security or confidentiality purposes." },
  {
    term: "Data Owner",
    definition:
      "The person or organisation responsible for creating the data and exercising authority over it. May delegate authority to a Data Custodian.",
  },
  { term: "Data Provider", definition: "The organisation holding and controlling the source health data involved in a synthetic health data request." },
  { term: "Data Requestor", definition: "The organisation requesting generation of synthetic health data from source data held by one or more organisations." },
  { term: "Data Sponsor", definition: "Undertakes data ownership on behalf of an organisation and ensures appropriate governance; may have authority to approve data sharing." },
  {
    term: "Data Steward",
    definition:
      "Manages a data asset day to day on behalf of the Data Sponsor, ensuring data quality and standards, and supporting Custodians and Sponsors.",
  },
  { term: "Data utility", definition: "A measure of the usefulness or value of data in achieving a goal in a particular context." },
  { term: "De-identified data", definition: "Data where a person’s identity is no longer apparent or reasonably ascertainable after applying de-identification techniques." },
  { term: "Disclosure", definition: "Provision of personal information to another party outside an organisation." },
  { term: "DSA", definition: "Data Sharing Agreement." },
  { term: "DUA", definition: "Data Use Agreement." },
  { term: "Dummy data", definition: "Placeholder or substitute data fabricated to mimic the structure of real data for testing; not meaningful for analysis." },
  { term: "Fake data", definition: "Artificially generated data; includes dummy data, mock data and synthetic health data." },
  { term: "Five Safes", definition: "A framework for assessing and managing privacy risks when sharing data within a controlled setting." },
  { term: "Health consumer", definition: "Individuals who use or will use health services, including their families and carers." },
  {
    term: "Health information",
    definition:
      "Personal information about a person’s health, disability, health services, wishes about services, donations, genetic information, healthcare identifiers, or information collected in the course of providing a health service.",
  },
  { term: "HREC", definition: "Human Research Ethics Committee." },
  { term: "Identity disclosure", definition: "Occurs when data is re-identified and a person’s identity can be linked to a record." },
  { term: "Information", definition: "See “data”." },
  { term: "Insights", definition: "Information derived from data once processed or analysed." },
  { term: "Membership disclosure", definition: "Occurs if it can be determined whether an individual’s data was in the source dataset used to generate a synthetic dataset." },
  { term: "Mock data", definition: "Simulated or fictitious data not created from real data, but may replicate structure or format." },
  { term: "NHMRC", definition: "National Health and Medical Research Council." },
  { term: "OAIC", definition: "Office of the Australian Information Commissioner." },
  { term: "Output", definition: "Results generated from data use, such as analyses, insights, reports or derived information." },
  {
    term: "Personal information",
    definition:
      "Information about a person who is reasonably identifiable. Includes true/false, opinion/fact, recorded or unrecorded information, and includes living or deceased persons.",
  },
  { term: "Perturbation", definition: "Modifying data by making small changes (e.g., adding noise) to obscure original values while preserving statistical properties." },
  { term: "PIA", definition: "Privacy Impact Assessment." },
  { term: "Privacy Act", definition: "Privacy Act 1988 (Cth)." },
  { term: "Real data", definition: "Data relating to actual people, places or events." },
  { term: "Redaction", definition: "Permanently removing or concealing data for confidentiality." },
  { term: "Secondary purpose / secondary use", definition: "Using personal information for a purpose other than the primary purpose of collection." },
  { term: "Sensitive information", definition: "A subset of personal information including racial origin, beliefs, sexual orientation, criminal record, health and genetic information, and some biometric data." },
  { term: "Sharing", definition: "Data provided from a Data Provider to a Data Requestor or End User." },
  { term: "Source data", definition: "The original data held by the Data Provider from which synthetic health data will be generated." },
  { term: "Statistical disclosure risk", definition: "Risk that an individual’s identity or new information about them can be revealed, including attribute and identity disclosure." },
  { term: "Statistical properties", definition: "Characteristics of a dataset that can be measured, analysed or interpreted." },
  { term: "Synthetic health data", definition: "Artificially generated data that mimics the structure and statistical properties of real health data, and uses real health data as input." },
  { term: "Synthetic health data request", definition: "Any request to generate or access synthetic health data for a project or multiple potential purposes." },
  { term: "Unit record data", definition: "Data at the level of a single observation relating to an individual or entity." },
  { term: "Use", definition: "The use of personal information by a person within an organisation." },
  { term: "Very low risk", definition: "A level of re-identification risk that is so low as to make identification highly impractical." },
].sort((a, b) => a.term.localeCompare(b.term))

const bucketLetter = (value: string) => {
  const first = value.trim().charAt(0).toUpperCase()
  return first >= "A" && first <= "Z" ? first : "#"
}

export default function Appendix2Page() {
  const [query, setQuery] = useState("")
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  const pdfHref = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(PDF_FILENAME)}`

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return terms
    return terms.filter((item) => item.term.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q))
  }, [query])

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryTerm[]>()
    for (const item of filtered) {
      const letter = bucketLetter(item.term)
      const list = map.get(letter)
      if (list) list.push(item)
      else map.set(letter, [item])
    }
    const letters = [...map.keys()].sort((a, b) => a.localeCompare(b))
    return { map, letters }
  }, [filtered])

  const visibleLetters = activeLetter && grouped.map.has(activeLetter) ? [activeLetter] : grouped.letters

  const jumpTo = (letter: string) => {
    setActiveLetter(letter)
    requestAnimationFrame(() => {
      document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  return (
    <PageShell className="py-12">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-slate-950/90 to-blue-950/80 text-white shadow-emerald-900/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-600/10" />
        <div className="relative z-10 px-6 py-14 md:px-10 md:py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Appendix 2</p>
          <h1 className="mt-2 text-4xl font-bold text-balance md:text-5xl">Glossary</h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            Clear, concise definitions for key terms used throughout the Framework.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/resources/appendix1" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">
              About synthetic data (Appendix 1) <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/resources/appendix3" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">
              Policy context (Appendix 3) <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={pdfHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">
              Open original PDF <FileText className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={pdfHref} download className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">
              Download PDF <Download className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-6 lg:grid-cols-3">
        {[
          { title: "Use while reading", body: "Keep this open while moving through Steps 1–6 and the other appendices." },
          { title: "Searchable", body: "Use search to find a term or phrase across definitions." },
          { title: "Governance-friendly", body: "Definitions reflect the Framework’s usage (not legal advice)." },
        ].map((card) => (
          <div key={card.title} className="rounded-2xl border border-border/60 bg-gradient-to-br from-emerald-500/10 via-background/95 to-background/80 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">{card.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
          </div>
        ))}
      </section>

      <section className="mb-14">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-2">
            <h2 className="text-3xl font-bold text-balance">Browse terms</h2>
            <p className="text-base text-muted-foreground">
              {filtered.length} term{filtered.length === 1 ? "" : "s"} shown.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActiveLetter(null)
                }}
                placeholder="Search terms and definitions..."
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {grouped.letters.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => jumpTo(letter)}
              className={
                activeLetter === letter
                  ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                  : "rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-semibold text-foreground transition hover:bg-card/80"
              }
            >
              {letter}
            </button>
          ))}
          {(activeLetter || query.trim().length > 0) && (
            <button
              type="button"
              onClick={() => {
                setActiveLetter(null)
                setQuery("")
              }}
              className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-semibold text-foreground transition hover:bg-card/80"
            >
              Reset
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/70 shadow-sm">
          <div className="max-h-[70vh] overflow-auto p-6">
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
                No terms found. Try a different search.
              </div>
            ) : (
              <div className="space-y-10">
                {visibleLetters.map((letter) => {
                  const items = grouped.map.get(letter) ?? []
                  return (
                    <section key={letter} id={`letter-${letter}`} className="scroll-mt-24 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-200">
                          {letter}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{letter}</h3>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {items.map((item) => (
                          <div key={item.term} className="rounded-2xl border border-border/60 bg-muted/10 p-5">
                            <h4 className="text-sm font-semibold text-foreground">{item.term}</h4>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.definition}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <BackButton />
    </PageShell>
  )
}

