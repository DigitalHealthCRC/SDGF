"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Download, FileText } from "lucide-react"

import TwoColumnLayout from "@/src/components/TwoColumnLayout"

import { BackLink } from "../appendix-detail"
import { PageShell } from "@/components/page-shell"

type WizardOption = { label: string; next: string }
type WizardNode = { id: string; text: string; options?: WizardOption[] }

const APPENDIX_TITLE = "Appendix 8 - Decision Tree for Complex Scenarios"
const APPENDIX_PURPOSE =
  "Provide a guided decision pathway for requests where risk cannot be reduced to very low, or where lawful pathways and approvals are uncertain."
const EXPORT_KEY = "appendix8_decision_tree"
const PDF_FILENAME = "APPENDIX 8_ Decision tree for complex synthetic health data scenarios.pdf"

const nodes: WizardNode[] = [
  {
    id: "start",
    text: "Has a Re-identification Risk Assessment been completed on the synthetic dataset?",
    options: [
      { label: "Yes", next: "risk_result" },
      { label: "No", next: "do_risk_assessment" },
    ],
  },
  {
    id: "do_risk_assessment",
    text: "Complete a Re-identification Risk Assessment. If residual risk cannot be reduced to very low, treat the dataset as personal information and proceed via a lawful pathway.",
    options: [{ label: "Continue", next: "risk_result" }],
  },
  {
    id: "risk_result",
    text: "What is the assessed re-identification risk?",
    options: [
      { label: "Very low", next: "proceed_step5" },
      { label: "More than very low, but can be reduced", next: "apply_more_controls" },
      { label: "More than very low and cannot be reduced", next: "lawful_pathway" },
    ],
  },
  {
    id: "apply_more_controls",
    text: "Consult with the Requestor and apply further de-identification techniques and controls. Re-run the assessment.",
    options: [{ label: "Re-run assessment", next: "risk_result" }],
  },
  {
    id: "lawful_pathway",
    text: "Treat as personal information. Determine a lawful pathway (e.g., seek waiver of consent via HREC for research).",
    options: [
      { label: "View lawful pathways", next: "appendix9_link" },
      { label: "Stop and document outcome", next: "end_stop" },
    ],
  },
  {
    id: "appendix9_link",
    text: "Open Appendix 9 to review lawful pathways and conditions. When ready, return to confirm pathway and approvals.",
    options: [{ label: "Pathway confirmed", next: "end_pathway_confirmed" }],
  },
  {
    id: "proceed_step5",
    text: "Residual risk is very low. Proceed to Step 5 (Safety Assessment, controls and approvals) and document the decision.",
    options: [{ label: "Go to Step 5 controls", next: "end_step5" }],
  },
  {
    id: "end_step5",
    text: "Route to Safety Assessment (Appendix 10) and complete final documentation (Appendix 11).",
    options: [],
  },
  {
    id: "end_pathway_confirmed",
    text: "Proceed under the confirmed lawful pathway with appropriate approvals and controls documented.",
    options: [],
  },
  {
    id: "end_stop",
    text: "Request cannot proceed under the Framework without a lawful pathway. Record decision and rationale.",
    options: [],
  },
]

const findStartNode = (collection: WizardNode[]) => {
  const explicit = collection.find((node) => node.id === "start")
  return explicit ?? collection[0]
}

const startNode = findStartNode(nodes)

export default function Appendix8Page() {
  const nodesById = useMemo(
    () =>
      nodes.reduce<Record<string, WizardNode>>((acc, node) => {
        acc[node.id] = node
        return acc
      }, {}),
    [],
  )

  const [path, setPath] = useState<string[]>(startNode ? [startNode.id] : [])
  const [history, setHistory] = useState<Array<{ id: string; text: string; answer: string }>>([])

  const currentId = path[path.length - 1]
  const currentNode = currentId ? nodesById[currentId] : undefined
  const currentOptions = currentNode?.options ?? []
  const isTerminal = !currentNode || currentOptions.length === 0

  if (!startNode) {
    return (
      <PageShell variant="narrow" className="space-y-6 py-10 text-sm text-muted-foreground">
        <h1 className="text-2xl font-semibold text-foreground">{APPENDIX_TITLE}</h1>
        <p>Decision tree content is unavailable. Please contact the framework team.</p>
        <BackLink />
      </PageShell>
    )
  }

  const answer = (option: WizardOption) => {
    if (!currentNode) return
    setHistory((prev) => [...prev, { id: currentNode.id, text: currentNode.text, answer: option.label }])
    setPath((prev) => [...prev, option.next])
  }

  const goBack = () => {
    setPath((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
    setHistory((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev))
  }

  const reset = () => {
    setPath([startNode.id])
    setHistory([])
  }

  const downloadJSON = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      path: history,
      outcome: isTerminal ? currentNode?.text ?? null : null,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const anchor = document.createElement("a")
    anchor.href = URL.createObjectURL(blob)
    anchor.download = `${EXPORT_KEY}.json`
    anchor.click()
    URL.revokeObjectURL(anchor.href)
  }

  const pdfHref = PDF_FILENAME
    ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/appendices_pdf/${encodeURIComponent(PDF_FILENAME)}`
    : null

  const leftPanel = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>{APPENDIX_PURPOSE}</p>
      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground/80">
        <li>Document each response so governance reviewers can trace the decision.</li>
        <li>Use the Back button to revisit earlier choices if circumstances change.</li>
        <li>Download the JSON log and attach it to Step 4 or Step 5 evidence packs.</li>
      </ul>
      <div className="flex flex-wrap gap-2 pt-1">
        <Link
          href="/resources/appendix9"
          className="inline-flex items-center rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card/80"
        >
          Open Appendix 9
        </Link>
        <Link
          href="/resources/appendix3"
          className="inline-flex items-center rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card/80"
        >
          Open Appendix 3
        </Link>
        <Link
          href="/steps/4"
          className="inline-flex items-center rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card/80"
        >
          Step 4
        </Link>
        <Link
          href="/steps/5"
          className="inline-flex items-center rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card/80"
        >
          Step 5
        </Link>
      </div>
      {pdfHref && (
        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href={pdfHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card/80"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Open original PDF
          </a>
          <a
            href={pdfHref}
            download
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-card/80"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </a>
        </div>
      )}
      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
        Tip: If you end on a stop condition, escalate to the governance office with your recorded answers.
      </div>
      <BackLink />
    </div>
  )

  const rightPanel = (
    <div className="space-y-6">
      {currentNode && !isTerminal && (
        <div className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground">{currentNode.text}</h2>
          <div className="flex flex-wrap gap-3">
            {currentOptions.map((option) => (
              <button
                key={`${currentNode.id}-${option.next}`}
                onClick={() => answer(option)}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
              >
                {option.label}
              </button>
            ))}
            {path.length > 1 && (
              <button
                onClick={goBack}
                className="rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
              >
                Back
              </button>
            )}
            <button
              onClick={reset}
              className="rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {isTerminal && (
        <div className="space-y-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-emerald-200">Outcome</h2>
          <p className="text-sm text-emerald-100">{currentNode?.text ?? "Outcome unavailable."}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={reset}
              className="rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
            >
              Start Over
            </button>
            <button
              onClick={goBack}
              className="rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
            >
              Step Back
            </button>
            <button
              onClick={downloadJSON}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
            >
              Download Path (JSON)
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <section className="space-y-3 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
          <h3 className="font-semibold text-foreground">Path taken</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            {history.map((step, index) => (
              <li key={`${step.id}-${index}`} className="flex flex-col">
                <span className="font-medium text-foreground">{step.text}</span>
                <span className="text-xs uppercase text-emerald-300">Answer: {step.answer}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 via-slate-950/90 to-blue-950/80 text-white shadow-emerald-900/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-emerald-600/10" />
        <div className="relative z-10 px-6 py-12 md:px-10 md:py-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Appendix 8</p>
          <h1 className="mt-2 text-3xl font-bold text-balance md:text-4xl">{APPENDIX_TITLE}</h1>
          <p className="mt-3 max-w-3xl text-base text-white/80">{APPENDIX_PURPOSE}</p>
        </div>
      </section>

      <TwoColumnLayout
        title={APPENDIX_TITLE}
        description={APPENDIX_PURPOSE}
        left={leftPanel}
        right={rightPanel}
      />
    </div>
  )
}
