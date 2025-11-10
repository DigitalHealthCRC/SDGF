"use client"

import { useState } from "react"
import TwoColumnLayout from "@/src/components/TwoColumnLayout"
import appendixData from "@/src/content/appendices/appendix8.json"

import { BackLink } from "../appendix-detail"

type WizardOption = { label: string; next: string }
type WizardNode = { id: string; text: string; options?: WizardOption[] }

const nodes = (appendixData.nodes ?? []) as WizardNode[]
const appendixNumber = typeof appendixData.id === "number" ? appendixData.id : 8
const { description: rawDescription } = appendixData as { description?: unknown }
const appendixDescription = typeof rawDescription === "string" ? rawDescription : undefined

const findStartNode = (collection: WizardNode[]) => {
  const explicit = collection.find((node) => node.id === "start")
  return explicit ?? collection[0]
}

const nodesById = nodes.reduce<Record<string, WizardNode>>((acc, node) => {
  acc[node.id] = node
  return acc
}, {})

const startNode = findStartNode(nodes)

export default function Appendix8Page() {
  const [path, setPath] = useState<string[]>(startNode ? [startNode.id] : [])
  const [history, setHistory] = useState<Array<{ id: string; text: string; answer: string }>>([])

  const currentId = path[path.length - 1]
  const currentNode = currentId ? nodesById[currentId] : undefined
  const currentOptions = currentNode?.options ?? []
  const isTerminal = !currentNode || currentOptions.length === 0

  if (!startNode) {
    return (
      <main className="mx-auto max-w-3xl space-y-6 p-8 text-sm text-muted-foreground">
        <h1 className="text-2xl font-semibold text-foreground">Appendix 8 - Decision Tree</h1>
        <p>Decision tree content is unavailable. Please contact the framework team.</p>
        <BackLink />
      </main>
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
    anchor.download = `${(appendixData.exportKey as string) ?? "appendix8-decision-tree"}.json`
    anchor.click()
    URL.revokeObjectURL(anchor.href)
  }

  const leftPanel = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>{appendixData.purpose}</p>
      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground/80">
        <li>Document each response so governance reviewers can trace the decision.</li>
        <li>Use the Back button to revisit earlier choices if circumstances change.</li>
        <li>Download the JSON log and attach it to Step 4 or Step 5 evidence packs.</li>
      </ul>
      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-200">
        Tip: If you end on a stop condition, escalate to the governance office with your recorded answers.
      </div>
      <BackLink />
    </div>
  )

  const rightPanel = (
    <div className="space-y-6">
      {appendixDescription && (
        <div className="rounded-md border border-border/60 bg-card/80 p-4 text-sm text-muted-foreground">
          {appendixDescription}
        </div>
      )}
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
      <TwoColumnLayout
        title="Appendix 8 - Decision Tree for Complex Scenarios"
        description={appendixData.purpose}
        left={leftPanel}
        right={rightPanel}
      />
    </div>
  )
}

