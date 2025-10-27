"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import TwoColumnLayout from "@/src/components/TwoColumnLayout"

type DecisionNode = { id: string; question: string; yes: NodeId; no: NodeId }
type ResultNode = { id: string; result: string }
type Node = DecisionNode | ResultNode

type NodeId =
  | "start"
  | "riskAssessment"
  | "controlsReady"
  | "reviewRisk"
  | "mitigationPlan"
  | "ethicsCheck"
  | "ethicsRequired"
  | "governanceReview"
  | "proceed"

const tree: Record<NodeId, Node> = {
  start: {
    id: "start",
    question: "Is the synthetic data intended for public release or sharing outside your organisation?",
    yes: "riskAssessment",
    no: "ethicsCheck",
  },
  riskAssessment: {
    id: "riskAssessment",
    question: "Has a formal re-identification risk assessment been completed and rated very low?",
    yes: "controlsReady",
    no: "reviewRisk",
  },
  controlsReady: {
    id: "controlsReady",
    question: "Are mitigation controls documented and approved by governance?",
    yes: "proceed",
    no: "mitigationPlan",
  },
  reviewRisk: {
    id: "reviewRisk",
    result:
      "Re-identification risk must be mitigated or synthesis parameters adjusted before proceeding. Revisit Step 4 and repeat testing.",
  },
  mitigationPlan: {
    id: "mitigationPlan",
    result:
      "Document the mitigation actions, secure approvals, and update the residual risk rating before continuing to synthesis.",
  },
  ethicsCheck: {
    id: "ethicsCheck",
    question: "Does the use case involve vulnerable cohorts or highly sensitive attributes?",
    yes: "ethicsRequired",
    no: "governanceReview",
  },
  ethicsRequired: {
    id: "ethicsRequired",
    result:
      "Submit the proposal for ethics or governance review prior to data synthesis. Proceed only once formal approval is granted.",
  },
  governanceReview: {
    id: "governanceReview",
    question: "Has the organisation's governance or privacy office endorsed proceeding without additional approvals?",
    yes: "riskAssessment",
    no: "ethicsRequired",
  },
  proceed: {
    id: "proceed",
    result:
      "The scenario meets governance expectations. You may proceed to Step 3 (Generate Synthetic Data) and ready the mitigation log for sign-off.",
  },
}

const isDecisionNode = (node: Node): node is DecisionNode => "yes" in node && "no" in node

export default function Appendix8Page() {
  const [path, setPath] = useState<NodeId[]>(["start"])
  const [history, setHistory] = useState<Array<{ id: NodeId; question: string; answer: "yes" | "no" }>>([])

  const currentId = useMemo(() => path[path.length - 1], [path])
  const current = tree[currentId]

  const answer = (response: "yes" | "no") => {
    if (!isDecisionNode(current)) return

    const nextId = current[response]
    setHistory((prev) => [...prev, { id: current.id as NodeId, question: current.question, answer: response }])
    setPath((prev) => [...prev, nextId])
  }

  const goBack = () => {
    setPath((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
    setHistory((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev))
  }

  const reset = () => {
    setPath(["start"])
    setHistory([])
  }

  const downloadJSON = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      path: history,
      outcome: !isDecisionNode(current) ? current.result : null,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const anchor = document.createElement("a")
    anchor.href = URL.createObjectURL(blob)
    anchor.download = "appendix8-decision-tree.json"
    anchor.click()
  }

  const leftPanel = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>
        Follow this branched questionnaire to confirm whether further governance or ethics review is required before you
        continue through the Framework.
      </p>
      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground/80">
        <li>Document each answer in case governance review is needed later.</li>
        <li>Use the Back button if you need to revisit a previous answer.</li>
        <li>Download your path to attach it to Step 4 or Step 5 evidence logs.</li>
      </ul>
      <Link href="/resources/appendices" className="inline-flex items-center gap-2 text-emerald-300 hover:underline">
        <span aria-hidden="true">{"\u2190"}</span>
        <span>Back to Appendices</span>
      </Link>
    </div>
  )

  const rightPanel = (
    <div className="space-y-6">
      {isDecisionNode(current) ? (
        <div className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground">{current.question}</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => answer("yes")}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
            >
              Yes
            </button>
            <button
              onClick={() => answer("no")}
              className="rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
            >
              No
            </button>
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
      ) : (
        <div className="space-y-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-emerald-200">Outcome</h2>
          <p className="text-sm text-emerald-100">{current.result}</p>
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
                <span className="font-medium text-foreground">{step.question}</span>
                <span className="text-xs uppercase text-emerald-300">Answer: {step.answer}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )

  return (
    <TwoColumnLayout
      title="Appendix 8: Decision Tree for Complex Scenarios"
      description="Answer a short series of governance questions to confirm whether additional review is required before synthesis."
      left={leftPanel}
      right={rightPanel}
    />
  )
}
