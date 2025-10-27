"use client"

import { useState } from "react"

import TwoColumnLayout from "@/src/components/TwoColumnLayout"

type Node = {
  id: string
  question: string
  yes?: string
  no?: string
  result?: string
}

const tree: Record<string, Node> = {
  start: {
    id: "start",
    question: "Is the synthetic data intended for public release or sharing outside your organisation?",
    yes: "riskAssessment",
    no: "ethicsCheck",
  },
  riskAssessment: {
    id: "riskAssessment",
    question: "Has a re-identification risk assessment been completed and rated 'very low'?",
    yes: "proceed",
    no: "reviewRisk",
  },
  ethicsCheck: {
    id: "ethicsCheck",
    question: "Does the use case involve potentially sensitive or vulnerable populations?",
    yes: "ethicsRequired",
    no: "proceed",
  },
  reviewRisk: {
    id: "reviewRisk",
    result: "Re-identification risk must be mitigated or synthesis parameters adjusted before proceeding.",
  },
  ethicsRequired: {
    id: "ethicsRequired",
    result: "Submit the proposal for ethics or governance review prior to data synthesis.",
  },
  proceed: {
    id: "proceed",
    result: "The scenario meets governance expectations. You may proceed to Step 3 (Generate Synthetic Data).",
  },
}

export default function Appendix8Page() {
  const [currentId, setCurrentId] = useState("start")
  const [history, setHistory] = useState<{ q: string; a: string }[]>([])

  const current = tree[currentId]

  const answer = (response: "yes" | "no") => {
    const next = current[response]
    setHistory((prev) => [...prev, { q: current.question, a: response }])
    if (next) setCurrentId(next)
  }

  const reset = () => {
    setCurrentId("start")
    setHistory([])
  }

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" })
    const anchor = document.createElement("a")
    anchor.href = URL.createObjectURL(blob)
    anchor.download = "appendix8_decisiontree.json"
    anchor.click()
  }

  const leftPanel = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>Use this decision tree to check whether your scenario needs further governance, ethics, or risk review.</p>
      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground/80">
        <li>Answer honestly and document the path for governance records.</li>
        <li>Restart at any time to explore alternate outcomes.</li>
      </ul>
      <a href="/resources/appendices" className="inline-flex items-center gap-2 text-emerald-300 hover:underline">
        <span aria-hidden="true">{"\u2190"}</span>
        <span>Back to Appendices</span>
      </a>
    </div>
  )

  const rightPanel = (
    <div className="space-y-6">
      {current.result ? (
        <div className="space-y-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-emerald-200">Outcome</h2>
          <p className="text-sm text-emerald-100">{current.result}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={reset}
              className="rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
            >
              Restart
            </button>
            <button
              onClick={downloadJSON}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2"
            >
              Download Path (JSON)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
          <h2 className="text-lg font-semibold text-foreground">{current.question}</h2>
          <div className="flex flex-wrap gap-4">
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
          </div>
        </div>
      )}

      {history.length > 0 && (
        <section className="space-y-3 rounded-xl border border-border/60 bg-card/70 p-6 shadow-md">
          <h3 className="font-semibold text-foreground">Path taken</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {history.map((h, index) => (
              <li key={index}>
                <span className="font-medium text-foreground">{h.q}</span>
                <span className="ml-2 uppercase text-emerald-300">{h.a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )

  return (
    <TwoColumnLayout
      title="Appendix 8 – Decision Tree for Complex Scenarios"
      description="Answer a short series of governance questions to confirm whether additional review is required before synthesis."
      left={leftPanel}
      right={rightPanel}
    />
  )
}
